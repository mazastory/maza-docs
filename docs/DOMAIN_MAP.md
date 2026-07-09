# DOMAIN MAP

## Challenge Domain

src/pages/AdsenseChallenge/*
src/components/challenge/*
src/lib/challenge/*

책임

* 애드센스 챌린지
* 승인 가이드
* 법적 페이지

---

## Content Domain

src/pages/NicheHunter/*
src/pages/Writer/*
src/components/writer/*
src/lib/content/*
src/lib/seo/*
src/lib/image/*

책임

* 키워드
* SEO
* 글 생성
* 이미지 생성

---

## Publishing Domain

src/components/PostMapper/*
src/lib/scheduler/*
src/lib/publisher/*
server/workers/publishWorker.ts
server/lib/schedulerService/*

책임

* Queue
* Schedule
* Publish
* Verify

---

## Shared Domain

src/shared/*
server/shared/*

책임

* logger
* types
* constants
* events
