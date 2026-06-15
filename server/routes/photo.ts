import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { callDeepAI } from '../lib/aiClient.js';
import { uploadBufferToR2, getOptimizedImage, extractDeviceInfo } from '../lib/imageService.js';
import { requireAuth } from '../middleware/auth.js';
import { VisionAgent } from '../lib/visionAgent.js';
import { validateContent } from '../lib/validator.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { MazaLogger } from '../lib/logger.js';

const router = express.Router();

function markdownToBlocks(markdown: string) {
  const blocks: any[] = [];
  const lines = markdown.split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', text: currentParagraph.join('<br/>') });
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      flushParagraph();
      blocks.push({ type: 'title', text: line.substring(2).trim() });
    } else if (line.startsWith('## ')) {
      flushParagraph();
      blocks.push({ type: 'heading', level: 2, text: line.substring(3).trim() });
    } else if (line.startsWith('### ')) {
      flushParagraph();
      blocks.push({ type: 'heading', level: 3, text: line.substring(4).trim() });
    } else if (line.startsWith('> 💡') || line.startsWith('>💡')) {
       flushParagraph();
       // try to get the next line for the insight content
       let insightText = line.replace('> 💡', '').replace('>💡', '').trim();
       if (insightText.startsWith('**') && i + 1 < lines.length && lines[i+1].startsWith('>')) {
         insightText = lines[i+1].replace('>', '').trim();
         i++;
       }
       blocks.push({ type: 'insight', text: insightText });
    } else if (line.startsWith('>')) {
      flushParagraph();
      blocks.push({ type: 'intro', text: line.replace('>', '').trim() });
    } else if (line === '') {
      flushParagraph();
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      blocks.push({ type: 'paragraph', text: line });
    } else {
      currentParagraph.push(line);
    }
  }
  flushParagraph();
  
  // If no blocks were generated for some reason, just wrap everything in a paragraph
  if (blocks.length === 0 && markdown.trim()) {
    blocks.push({ type: 'paragraph', text: markdown.replace(/\n/g, '<br/>') });
  }
  
  return blocks;
}
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

router.post('/', requireAuth, upload.array('photos', 5), async (req: any, res) => {
  try {
    const { keyword, template, photo_contexts: contextsJson } = req.body;
    const user_id = req.userId;
    let photoContexts: string[] = [];
    try {
      if (contextsJson) photoContexts = JSON.parse(contextsJson);
    } catch (e) {
      console.error("Failed to parse photo_contexts", e);
    }
    const files = req.files as Express.Multer.File[];
    
    // [New] Asset Generation (No photos, just keyword)
    if (!files || files.length === 0) {
      if (keyword) {
        console.log(`[Asset Gen] No photos provided, generating from keyword: ${keyword}`);
        const url = await getOptimizedImage(keyword);
        return res.json({ success: true, url });
      }
      return res.status(400).json({ success: false, error: 'At least one photo or keyword is required' });
    }

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // 1. Generate Content
    // 템플릿별 특화 지침 추가
    const TEMPLATE_PROMPTS: Record<string, string> = {
      cafe: '☕ 카페/디저트 특화: 공간의 분위기(채광, 가구, 소음도), 시그니처 메뉴의 시각적 특징과 미각적 디테일, 인스타 감성 포인트 등을 생생하게 묘사하세요.',
      restaurant: '🍽️ 맛집/음식 특화: 음식의 온도감, 식재료의 조화, 첫 입의 임팩트, 사장님의 철학이나 서비스 특징을 강조하여 침샘을 자극하는 글을 쓰세요.',
      travel: '✈️ 장소/여행 특화: 그 장소에 가야만 느낄 수 있는 공기의 흐름, 주변 풍경과의 조화, 방문 시 주의사항이나 가장 좋았던 시간대 등 여행자의 시선에서 작성하세요.',
      product: '📦 제품 리뷰 특화: 패키징의 첫인상, 손에 닿는 질감, 실생활에서의 유용함, 유사 제품 대비 확실한 차별점을 논리적이면서도 감성적으로 전달하세요.',
      daily: '🏃 일상/기록 특화: 거창한 정보보다는 소소한 행복, 그 순간의 감정 변화, 독자들도 공감할 수 있는 일상의 가치를 따뜻한 시선으로 기록하세요.'
    };

    const templateInstruction = TEMPLATE_PROMPTS[template] || '';

    // 1. [E-01] Pre-analysis Pass: VisionAgent를 통한 사진별 감성/경험 추출
    MazaLogger.info(`[VisionWriter] 📸 Starting pre-analysis for ${files.length} photos...`);
    const analyses: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageBase64 = file.buffer.toString('base64');
      const analysis = await VisionAgent.analyzeExperience(
        imageBase64, 
        keyword || "수익형 블로그",
        photoContexts[i] // 전달: 사용자 메모 (장소, 동행, 시기 등)
      );
      analyses.push(analysis);
    }

    // [E-01] 사진별 코멘트 및 AI 분석 결과 병합
    let photoDescriptions = "\n\n[Experience-First 사진별 원본 데이터]:\n";
    photoDescriptions += files.map((file, i) => {
      const userCtx = photoContexts[i] ? `\n   - 사용자 직접 메모: ${photoContexts[i]}` : "";
      const aiAnal = analyses[i] ? `\n   - AI 시각적 관찰: ${analyses[i].observation}\n   - 추천 스토리텔링: ${analyses[i].storytelling}\n   - 감정적 톤: ${analyses[i].emotional_hook}` : "";
      return `[사진 ${i+1} 상세 기록]${userCtx}${aiAnal}\n`;
    }).join("\n");

    // [P-02] Extract device info for AI prompt
    const preDevices: string[] = [];
    for (const file of files) {
      const device = await extractDeviceInfo(file.buffer);
      if (device) preDevices.push(device);
    }
    const deviceInferred = preDevices.length > 0 ? preDevices[0] : null;
    const deviceContext = deviceInferred ? `\n[P-02 Technical Evidence]: 이 사진들은 ${deviceInferred} 기기로 촬영되었습니다. 본문 중간에 이 기기 특유의 감성이나 '직접 촬영했다는 증거'를 자연스럽게 언급하여 E-E-A-T를 극대화하세요.` : "";

    const promptText = `당신은 사용자의 사진 속에 담긴 '경험'을 발견하고 가공하는 전문 블로그 작가이자 경험 증명 에이전트(Vision Writer)입니다.
제공된 사진(들)과 AI 사전 분석 데이터를 기반으로, 독자에게 신뢰와 감동을 주는 2,500자 이상의 압도적인 고품질 블로그 글을 작성해주세요.

${templateInstruction}

[필수 지침 - Experience-First (E-01) Manifesto]
1. **사진의 원본성 (Authenticity)**: 사진은 단순한 시각 정보가 아닙니다. "제가 이 사진을 찍었을 때..."와 같은 1인칭 시점을 철저히 유지하며, 사진 속 장소나 물건에 대한 당신만의 감상과 에피소드를 풍부하게 서술하세요.
2. **다층적 맥락 주입 (Contextual Depth)**: 단순히 "무엇이 있다"가 아니라, 당시의 공기, 주변 소리, 함께 있던 사람, 본인의 취향 등 사소한 맥락을 주입하여 인간적 향취를 극대화하세요.
3. **감정적 스토리텔링 (Emotional Hook)**: 글의 도입부는 반드시 감정적인 문장으로 시작하세요. AI 사전 분석 결과에 포함된 '감정 선'과 '스토리텔링 훅'을 본문에 자연스럽게 녹여내세요.
4. **고중량 신뢰도 (High-Weight Authority)**: 2,500자 이상의 충분한 분량을 확보하되, 글의 후반부에는 독자들이 궁금해할 만한 실무 정보(위치, 팁, 주의사항 등)를 매우 상세하게 포함하세요.

[필수 구성 - FAQ 섹션]
- 글의 마지막 부분에 독자들이 궁금해할 만한 실무 정보(영업시간, 주차, 예약 팁, 위치 등)를 **[자주 묻는 질문(FAQ)]**이라는 소제목 하에 Q&A 형식으로 4개 이상 작성하세요.

${photoDescriptions}

[형식 지침]
- 반드시 마크다운(Markdown) 문법을 사용하여 H1, H2, H3 구조를 명확히 해주세요. (H2 소제목 3개 이상 권장)
- 문장 사이사이에 사람만이 느낄 수 있는 미묘한 디테일과 감정 표현을 듬뿍 담으세요.
- 글의 마지막에는 반드시 관련된 해시태그 5개를 작성해주세요.
${deviceContext}
${keyword ? `\n[추가 요청사항/키워드]: ${keyword}` : ''}`;

    const visionPrompt = [
      {
        role: 'user',
        content: promptText,
        inlineDataArray: files.map(file => ({
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype
        }))
      }
    ];

    const content = await callDeepAI(visionPrompt);

    if (!content) {
       throw new Error("AI Content generation failed");
    }

    let keyword_id = null;
    let site_id = null;
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `사진 기반 자동 생성 글`;
    
    // 2. 이미지 처리 및 업로드 (P-01: Metadata Scrubbing & WebP Optimization via ImageService)
    const imageUrls: string[] = [];
    const devices: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // [Thumbnail] 첫 번째 이미지에만 제목을 입혀서 대표 썸네일로 만듬
      const titleForImage = i === 0 ? title : undefined;
      const result = await uploadBufferToR2(file.buffer, file.mimetype, titleForImage) as any;
      
      if (result && result.url) {
        imageUrls.push(result.url);
        if (result.device) devices.push(result.device);
      }
    }
    
    const blocks = markdownToBlocks(content);
    
    // 블록에 이미지 삽입 로직 (문단 사이에 고르게 분산)
    if (imageUrls.length > 0) {
      const finalBlocks: any[] = [];
      let imgIndex = 0;
      let pCount = 0;
      
      for (let i = 0; i < blocks.length; i++) {
        finalBlocks.push(blocks[i]);
        if (blocks[i].type === 'paragraph' || blocks[i].type === 'intro') {
          pCount++;
          // 대략 1~2문단마다 이미지 한 장씩 삽입
          if (pCount % 2 === 1 && imgIndex < imageUrls.length) {
            finalBlocks.push({ type: 'image', url: imageUrls[imgIndex], alt: `${title} 관련 사진 ${imgIndex + 1}` });
            imgIndex++;
          }
        }
      }
      
      // 남은 이미지가 있다면 맨 마지막이나 적당한 곳에 추가
      while (imgIndex < imageUrls.length) {
        // 해시태그나 FAQ 전에 삽입하기 위해 마지막에서 두 번째 위치 탐색
        const insertPos = finalBlocks.findIndex(b => b.type === 'hashtags' || b.type === 'faq' || b.type === 'conclusion');
        if (insertPos !== -1) {
          finalBlocks.splice(insertPos, 0, { type: 'image', url: imageUrls[imgIndex], alt: `${title} 추가 사진 ${imgIndex + 1}` });
        } else {
          finalBlocks.push({ type: 'image', url: imageUrls[imgIndex], alt: `${title} 추가 사진 ${imgIndex + 1}` });
        }
        imgIndex++;
      }
      
      blocks.length = 0;
      blocks.push(...finalBlocks);
    }

    if (supabaseAdmin) {
       const { data: site } = await supabaseAdmin.from('ms_sites').select('id').eq('user_id', user_id).maybeSingle();
       if (site) site_id = site.id;
       
       if (keyword) {
           const { data: existingKeyword } = await supabaseAdmin.from('ms_keywords')
             .select('id, used_count')
             .eq('user_id', user_id)
             .eq('keyword', keyword)
             .maybeSingle();
             
           if (existingKeyword) {
              keyword_id = existingKeyword.id;
              await supabaseAdmin.from('ms_keywords')
                .update({ used_count: existingKeyword.used_count + 1 })
                .eq('id', keyword_id);
           } else {
              const { data: newKeyword } = await supabaseAdmin.from('ms_keywords')
                .insert([{ user_id, site_id, keyword, used_count: 1 }]).select().maybeSingle();
              if (newKeyword) keyword_id = newKeyword.id;
           }
       }
       
       // using blocks from outer scope
       
       const validation = validateContent(content, keyword || title);
       
       // [E-03] 최종 경험 인증 인장(Seal) 추가
       if (deviceInferred) {
         blocks.push({ 
           type: 'insight', 
           text: `✓ Experience Verified: This content is grounded in real-world photography captured with ${deviceInferred}. (MazaStudio E-01 Protocol)` 
         });
       }

       await supabaseAdmin.from('ms_posts').insert([{
         user_id,
         site_id,
         keyword_id,
         title,
         content,
         status: 'draft',
         source_type: 'photo',
         word_count: content.length,
         seo_score: validation.score / 100,
         metadata: { 
           blocks,
           device_info: deviceInferred,
           validation_score: validation.score,
           validation_details: validation.checks
         }
       }]);

       // [Asset-01] 경험 이미지 자산고(Asset Vault)에 자동 등록
       if (imageUrls.length > 0 && keyword) {
         const assetData = imageUrls.map(url => ({
           user_id,
           keyword,
           url,
           device_info: deviceInferred,
           is_verified: true,
           source: 'user_upload'
         }));
         await supabaseAdmin.from('ms_image_assets').insert(assetData).catch((e: any) => {
            console.warn("[Asset Vault] Registration skipped", e.message);
         });
       }

       await supabaseAdmin.from('ms_events').insert([{
         user_id,
         event_type: 'generate_post',
         metadata: { keyword, source: 'photo' }
       }]);
    }

    // blocks are already generated above
    res.json({ 
      success: true, 
      message: 'Content generated and saved successfully', 
      data: { 
        content, 
        blocks, 
        image1: imageUrls[0] || null // 익스텐션 썸네일 호환성용
      } 
    });
  } catch(error: unknown) {
    console.error("[Generate Photo Error]", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
