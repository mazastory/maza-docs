/**
 * MAZA OS — utils/delay.ts
 * 
 * 티스토리의 탐지 시스템을 회피하고 인간적인 리듬을 부여합니다.
 */

export async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export async function humanDelay(min = 1000, max = 3000) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(ms);
}
