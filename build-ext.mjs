/**
 * MAZA OS — build-ext.mjs
 *
 * esbuild 기반 익스텐션 전용 빌드/Watch 스크립트.
 *
 * content scripts (injector, sync_token):
 *   - manifest에 "type": "module" 없이 로드 → IIFE 번들로 빌드해야 함
 *   - export {} 등 ES module 구문 절대 불가
 *
 * background (background.ts):
 *   - manifest에 "type": "module" → ESM으로 빌드 가능
 */

import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import { argv } from 'process';
import fs from 'fs';

const isWatch = argv.includes('--watch');

// 1. Content Scripts: IIFE 번들 (export 구문 없어야 함)
const contentScripts = [
  {
    entryPoints: ['extension/content/injector.ts'],
    outfile: 'dist-ext/content/injector.js',
  },
  {
    entryPoints: ['extension/content/sync_token.ts'],
    outfile: 'dist-ext/content/sync_token.js',
  },
];

// 2. Background Service Worker: ESM 번들
const backgroundScript = {
  entryPoints: ['extension/background/background.ts'],
  outfile: 'dist-ext/background/background.js',
  format: 'esm',
};

const sharedOptions = {
  bundle: true,
  platform: 'browser',
  target: 'chrome120',
  sourcemap: true,
  logLevel: 'info',
};

async function build() {
  // Content scripts → IIFE (format 미지정 시 esbuild 기본값 = iife for bundle)
  for (const entry of contentScripts) {
    await esbuild.build({
      ...sharedOptions,
      ...entry,
      format: 'iife', // ← 핵심: export {} 삽입 방지
    });
  }

  // Background → ESM
  await esbuild.build({
    ...sharedOptions,
    ...backgroundScript,
  });

  // Sidebar
  await esbuild.build({
    ...sharedOptions,
    entryPoints: ['extension/sidebar.ts'],
    outfile: 'dist-ext/sidebar.js',
    format: 'iife',
  });

  copyStaticAssets();
  zipExtension();
  console.log('[MAZA Build] ✅ Extension build & zip complete.');
}

function zipExtension() {
  try {
    console.log('[MAZA Build] 📦 Zipping extension...');
    // Create zip from dist-ext contents
    execSync(`cd dist-ext && zip -r ../dist/maza-extension.zip . * -x "*.map"`, { stdio: 'inherit' });
    // Also sync to public/ for web app download
    execSync(`cp dist/maza-extension.zip public/maza-extension.zip`, { stdio: 'inherit' });
    console.log('[MAZA Build] 🟢 Zip created: dist/maza-extension.zip & public/maza-extension.zip');
  } catch (err) {
    console.error('[MAZA Build] ❌ Failed to create zip:', err.message);
  }
}

function copyStaticAssets() {
  execSync(
    `rsync -a --include='*/' --include='*.json' --include='*.html' --include='*.png' --include='*.css' --exclude='*.ts' --exclude='*.js' --exclude='*.map' extension/ dist-ext/`,
    { stdio: 'inherit' }
  );
}

async function watch() {
  const ctxList = [];

  for (const entry of contentScripts) {
    const ctx = await esbuild.context({
      ...sharedOptions,
      ...entry,
      format: 'iife',
      plugins: [{
        name: 'rebuild-log',
        setup(build) {
          build.onEnd(result => {
            if (result.errors.length === 0) {
              console.log(`[MAZA Watch] ✅ Rebuilt: ${entry.outfile}`);
              zipExtension();
            }
          });
        },
      }],
    });
    ctxList.push(ctx);
  }

  const bgCtx = await esbuild.context({
    ...sharedOptions,
    ...backgroundScript,
    plugins: [{
      name: 'rebuild-log',
      setup(build) {
        build.onEnd(result => {
          if (result.errors.length === 0) {
            console.log(`[MAZA Watch] ✅ Rebuilt: background.js`);
            zipExtension();
          }
        });
      },
    }],
  });
  ctxList.push(bgCtx);

  const sidebarCtx = await esbuild.context({
    ...sharedOptions,
    entryPoints: ['extension/sidebar.ts'],
    outfile: 'dist-ext/sidebar.js',
    format: 'iife',
    plugins: [{
      name: 'rebuild-log',
      setup(build) {
        build.onEnd(result => {
          if (result.errors.length === 0) {
            console.log(`[MAZA Watch] ✅ Rebuilt: sidebar.js`);
            zipExtension();
          }
        });
      },
    }],
  });
  ctxList.push(sidebarCtx);

  // 초기 정적 자산 복사
  copyStaticAssets();

  // [WATCH FIX] HTML, JSON, CSS, PNG 등 정적 파일 감시 추가
  console.log('[MAZA Watch] 👀 Watching static assets in extension/ ...');
  let fsTimeout;
  fs.watch('extension', { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.html') || filename.endsWith('.json') || filename.endsWith('.css') || filename.endsWith('.png'))) {
      if (!fsTimeout) {
        console.log(`[MAZA Watch] 📄 Static asset changed: ${filename}. Syncing...`);
        copyStaticAssets();
        zipExtension();
        fsTimeout = setTimeout(() => { fsTimeout = null; }, 500); // 디바운스
      }
    }
  });

  await Promise.all(ctxList.map(ctx => {
    ctx.watch();
    // esbuild onEnd 플러그인에서 zipExtension 호출 추가 (JS 변경시에도 zip 갱신)
  }));
  console.log('[MAZA Watch] 👀 Watching TS/JS source files...');
}

if (isWatch) {
  watch().catch(console.error);
} else {
  build().catch(() => process.exit(1));
}
