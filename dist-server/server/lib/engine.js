import { callAI } from './aiClient.js';
import { validateContent } from './validator.js';
import { supabaseAdmin } from './supabaseServer.js';
import { getOptimizedImage } from './imageService.js';
import { RendererAgent } from './rendererAgent.js';
import { calculateSEOScore, isSafeTopic } from './seoEngine.js';
import { parseJSON } from './parser.js';
import { buildGeneratePrompt } from '../routes/generate.js';
/**
 * 단일 포스트 생성 및 저장 엔진
 */
export async function generateAndSavePost(userId, siteId, keyword) {
    if (!supabaseAdmin)
        throw new Error('Supabase Admin client not initialized');
    if (!isSafeTopic(keyword)) {
        throw new Error('Unsafe topic for AdSense');
    }
    console.log(`[Engine] Generating post for: ${keyword}`);
    // 0. 사이트 정보 조회 (수수익 최적화 연동을 위해)
    let adsenseStatus = 'pending';
    let adsensePub = '';
    let coupangId = '';
    let coupangTracking = '';
    const { data: site } = await supabaseAdmin
        .from('ms_sites')
        .select('adsense_status, adsense_pub, metadata')
        .eq('id', siteId)
        .maybeSingle();
    if (site) {
        adsenseStatus = site.adsense_status || 'pending';
        adsensePub = site.adsense_pub || '';
        coupangId = site.metadata?.coupang_id || '';
        coupangTracking = site.metadata?.coupang_tracking_code || '';
    }
    // 1. AI 생성
    const prompt = buildGeneratePrompt(keyword);
    const raw = await callAI(prompt, { jsonMode: true });
    const data = typeof raw === 'string' ? parseJSON(raw) : raw;
    // 2. 이미지 매칭 (첫 번째 이미지는 썸네일로 활용하기 위해 제목 주입)
    const [img1, img2, img3] = await Promise.all([
        getOptimizedImage(keyword, data.title), // [FIX] 제목 전달하여 썸네일 생성
        getOptimizedImage(`${keyword} detail`),
        getOptimizedImage(`${keyword} view`)
    ]);
    data.image1 = img1;
    data.image2 = img2;
    data.image3 = img3;
    // 3. 렌더링 및 SEO 검증 (수수익 메타데이터 포함)
    const renderResult = RendererAgent.renderPost(data, {
        topic: keyword,
        adsenseStatus,
        adsensePub,
        coupangId,
        coupangTracking
    });
    const seoScore = calculateSEOScore(renderResult.html, keyword);
    const fullMarkdown = `# ${data.title}

${data.intro}

![${keyword}](${img1})

${data.definitionSection ? `## ${data.definitionSection.title}\n\n${data.definitionSection.content}\n\n` : ''}

${data.comparisonData ? `## ${data.comparisonData.title}\n\n| ${data.comparisonData.headers.join(' | ')} |\n| ${data.comparisonData.headers.map(() => '---').join(' | ')} |\n${data.comparisonData.rows.map((row) => `| ${row.join(' | ')} |`).join('\n')}\n\n` : ''}

${data.practicalExamples ? `## 실전 적용 사례\n\n${data.practicalExamples.map((ex) => `### CASE: ${ex.case}\n- **❌ BAD:** ${ex.bad}\n- **✅ GOOD:** ${ex.good}`).join('\n\n')}\n\n` : ''}

## ${keyword} 심층 분석

${data.content1}

> 💡 **전문가 팁**
> ${data.insightBox}

![${keyword} 상세](${img2})

## 추가 활용 가이드 및 주의사항

${data.content2}

> ✍️ **경험담**
> ${data.experienceNote}

![${keyword} 마무리](${img3})

${data.outro}`;
    const validation = validateContent(fullMarkdown, keyword);
    // 4. DB 저장
    const { data: savedPost, error: postError } = await supabaseAdmin.from('ms_posts').insert([{
            user_id: userId,
            site_id: siteId,
            title: data.title,
            content: fullMarkdown,
            html_content: renderResult.html,
            status: 'draft',
            source_type: 'keyword',
            word_count: fullMarkdown.replace(/\s+/g, '').length,
            seo_score: seoScore,
            metadata: { blocks: renderResult.blocks, data, validation_score: validation.score }
        }]).select('id').single();
    if (postError)
        throw postError;
    return { postId: savedPost.id, title: data.title };
}
/**
 * [E-01] 경험 기반 포스트 생성 엔진 (Vision Writer)
 */
export async function generateFromExperience(userId, siteId, imageBase64, keyword) {
    if (!supabaseAdmin)
        throw new Error('Supabase Admin client not initialized');
    const { VisionAgent } = await import('./visionAgent.js');
    const { uploadBufferToR2 } = await import('./imageService.js');
    console.log(`[Engine] 📸 Generating Experience Post for: ${keyword}`);
    // 1. Vision 분석 (Experience Discovery)
    const experience = await VisionAgent.analyzeExperience(imageBase64, keyword);
    // 3. AI 집필 (Experience-First Prompting)
    const prompt = [
        {
            role: "user",
            content: `
        당신은 "Experience Writer"입니다. 아래의 직접적인 경험 데이터를 바탕으로 2,500자 이상의 고품질 E-E-A-T 블로그 글을 작성하세요.
        
        [경험 데이터]
        - 키워드: ${keyword}
        - 1인칭 서사 소스: ${experience.storytelling}
        - 관찰 디테일: ${experience.observation}
        - 감정적 훅: ${experience.emotional_hook}
        
        [집필 지침]
        1. 도입부는 반드시 제공된 "감정적 훅"으로 시작하여 독자의 몰입을 유도하세요.
        2. 본문 중간에 "제가 현장에서 직접 확인한 바로는..."과 같은 실무적 팁을 3개 이상 포함하세요.
        3. 단순 정보 나열이 아닌, 경험을 통해 깨달은 '인사이트'를 중심으로 서술하세요.
        
        [반환 형식: JSON]
        {
          "title": "사람들의 클릭을 부르는 경험 중심 제목",
          "intro": "서론",
          "content1": "본문 섹션 1 (서사 중심)",
          "content2": "본문 섹션 2 (정보/팁 중심)",
          "insightBox": "가장 중요한 핵심 인사이트",
          "outro": "결론"
        }
      `
        }
    ];
    const raw = await callAI(prompt, { jsonMode: true, model: "gemini-3-flash-preview" });
    const data = typeof raw === 'string' ? parseJSON(raw) : raw;
    // 4. 이미지 처리 및 업로드 (AI가 만든 제목을 입혀서 썸네일로 변환)
    const buffer = Buffer.from(imageBase64, 'base64');
    const uploadResult = await uploadBufferToR2(buffer, 'image/jpeg', data.title);
    const experienceImageUrl = uploadResult?.url || "";
    const deviceInferred = uploadResult?.device || null;
    // 5. 렌더링 및 저장
    data.image1 = experienceImageUrl;
    const renderResult = RendererAgent.renderPost(data, { topic: keyword });
    const fullMarkdown = `# ${data.title}\n\n${data.intro}\n\n![${keyword}](${experienceImageUrl})\n\n${data.content1}\n\n> ✍️ **경험 분석**\n> ${experience.storytelling}\n\n${data.content2}\n\n${data.outro}`;
    const { data: savedPost, error: postError } = await supabaseAdmin.from('ms_posts').insert([{
            user_id: userId,
            site_id: siteId,
            title: data.title,
            content: fullMarkdown,
            html_content: renderResult.html,
            status: 'draft',
            source_type: 'experience',
            word_count: fullMarkdown.length,
            seo_score: 95, // 경험 기반 글은 가점 부여
            metadata: { experience, data, device_info: deviceInferred }
        }]).select('id').single();
    if (postError)
        throw postError;
    return { postId: savedPost.id, title: data.title, imageUrl: experienceImageUrl };
}
/**
 * 시리즈 벌크 스케줄링 엔진
 */
export async function scheduleSeries(userId, seriesId) {
    if (!supabaseAdmin)
        return;
    const { data: series } = await supabaseAdmin
        .from('ms_topic_clusters')
        .select('*')
        .eq('id', seriesId)
        .single();
    if (!series || !series.keywords || series.keywords.length === 0) {
        console.warn(`[Engine] Series ${seriesId} has no keywords. Skipping.`);
        return;
    }
    console.log(`[Engine] Scheduling series: ${series.title} (${series.keywords.length} posts)`);
    const intervalHours = series.interval_hours || 3;
    let nextPublishTime = new Date();
    // Find the last scheduled post for this user to append to it
    const { data: lastScheduled } = await supabaseAdmin
        .from('ms_scheduled_posts')
        .select('publish_at')
        .eq('user_id', userId)
        .order('publish_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (lastScheduled) {
        const lastTime = new Date(lastScheduled.publish_at).getTime();
        const candidateTime = new Date(lastTime + (intervalHours * 60 * 60 * 1000));
        // [PATCH] 만약 이전 예약글이 너무 먼 과거라면 현재 시간부터 시작하도록 보호 (W-05 안정성 보완)
        nextPublishTime = candidateTime > new Date() ? candidateTime : new Date();
    }
    for (const keyword of series.keywords) {
        try {
            // 멱등성 보장을 위한 해시 생성 (사이트 + 시리즈 + 키워드)
            const publishHash = Buffer.from(`${series.site_id}_${seriesId}_${keyword}`).toString('base64');
            // 1. 예약 정보 등록 (글 생성 없이 'queued' 상태로 시작)
            const { data: scheduledTask, error: scheduleError } = await supabaseAdmin.from('ms_scheduled_posts').insert([{
                    user_id: userId,
                    site_id: series.site_id,
                    keyword: keyword,
                    publish_at: nextPublishTime.toISOString(),
                    status: 'queued',
                    publish_hash: publishHash,
                    metadata: { cluster_id: seriesId }
                }]).select().single();
            if (scheduleError) {
                console.error("[Engine] Schedule Error for keyword:", keyword, scheduleError);
                if (scheduleError.code === '23505') { // Unique violation (이미 예약됨)
                    console.log(`[Engine] Skip: Keyword "${keyword}" already scheduled for this series.`);
                    continue;
                }
                throw scheduleError;
            }
            console.log(`[Engine] Queued: ${keyword} for ${nextPublishTime.toISOString()}`);
            // 시리즈 인덱스 업데이트
            await supabaseAdmin
                .from('ms_topic_clusters')
                .update({ current_index: series.keywords.indexOf(keyword) + 1 })
                .eq('id', seriesId);
            // 다음 발행 시간 계산
            nextPublishTime = new Date(nextPublishTime.getTime() + (intervalHours * 60 * 60 * 1000));
        }
        catch (err) {
            console.error(`[Engine] Failed to queue keyword "${keyword}":`, err.message);
        }
    }
    // Update series status
    await supabaseAdmin.from('ms_topic_clusters').update({ status: 'active' }).eq('id', seriesId);
}
