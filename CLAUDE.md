# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vibes — 바이브 코딩 시대의 블라인드 MVP 매칭 플랫폼. 현재 웨이트리스트 수집용 랜딩페이지 단계.
빌드 도구/프레임워크 없이 순수 HTML/CSS/JS로 구성된 정적 사이트(SSG).

## Commands

```bash
# 테스트 실행 (Playwright E2E)
npx playwright test

# 단일 테스트 실행
npx playwright test tests/landing.spec.js

# 시각 QA (Python Playwright 필요)
python tests/visual-qa.py

# OG 이미지 생성
node gen-og.js

# 로컬 서버 (정적 파일이므로 아무 서버나 가능)
npx serve .
```

## Architecture

**단일 HTML 파일 아키텍처** — `index.html` 하나에 모든 스타일(~1,446줄)과 스크립트가 인라인.

### 핵심 파일

| 파일 | 역할 |
|------|------|
| `index.html` | 메인 랜딩페이지 (스타일 + JS 인라인, ~2,163줄) |
| `privacy.html` / `terms.html` | 법적 문서 |
| `gen-og.js` | Puppeteer로 og.html → og.png 변환 |
| `playwright.config.js` | Playwright 설정 (Chromium only, 직렬 실행) |
| `tests/landing.spec.js` | E2E 테스트 (SEO, JSON-LD, 반응형, 폼 검증, 접근성) |
| `tests/visual-qa.py` | 시각 QA 스크린샷 캡처 |

### CSS 디자인 토큰

```
--bg: #08080C    --accent: #D4A853    --green: #4ADE80    --red: #F87171
--text-bright: #F0ECE4    --text: #A8A4B0    --text-dim: #5C5A6A
```

폰트: Instrument Serif (영문) / Noto Serif KR (한글) / Pretendard (본문) / JetBrains Mono (코드)
스페이싱: 8px 그리드 시스템 (`--space-1` ~ `--space-12`)

### JavaScript 주요 패턴

- **Intersection Observer**: `.rv` 클래스 요소에 스크롤 진입 시 `.vis` 추가 (100ms 스태거)
- **Problem 카드**: `--mouse-x`, `--mouse-y` CSS 변수로 마우스 트래킹 그래디언트
- **Terminal 애니메이션**: 비동기 타이핑 (40ms ± 20ms) + requestAnimationFrame 프로그레스 바
- **Web Audio API**: 프로그래밍된 lo-fi 신시사이저 (reverb, 코드, 베이스, 하이햇)
- **폼 제출**: Google Sheets API (no-cors fetch POST → `script.google.com`)

### 반응형 브레이크포인트

`1024px` → `768px` → `640px` → `380px`
`prefers-reduced-motion: reduce` 시 애니메이션 제거

## Deployment

Vercel SSG — 빌드 스텝 없이 정적 파일 직접 서빙.

## Conventions

- 모든 콘텐츠는 한국어
- 접근성: skip link, ARIA labels, focus-visible, reduced motion 지원
- 클래스 네이밍: `.rv`(reveal), `.vis`(visible), `.blind`(블라인드 효과)
- `.gitignore`에 `og.html`, `gen-og.js`, `package.json`, `package-lock.json` 포함됨 (git 추적 안 함)
