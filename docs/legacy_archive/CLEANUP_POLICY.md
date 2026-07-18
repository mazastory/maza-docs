# CLEANUP_POLICY.md

## Cleanup Constitution

핵심 원칙:

```
완성된 기능은 정리까지 포함해야 한다.

정리 없는 기능은 미완성이다.
```

---

## Why Cleanup Matters

현재 상태:

```
기능 추가 = 쉬움
기능 삭제 = 안 함

결과: 코드 부패
```

---

## Every Feature Has Cleanup Phase

새 기능 개발 완료 후:

```
개발 완료
  ↓
테스트 통과
  ↓
정리 (MANDATORY)
  ↓
푸시
```

정리 단계 없이는 merge 불가능

---

## Cleanup Checklist

모든 커밋 전 반드시 확인:

### 코드 레벨

```
☐ 사용하지 않는 import 제거?
☐ 사용하지 않는 함수 제거?
☐ 사용하지 않는 변수 제거?
☐ 콘솔 로그 제거?
☐ 주석 처리된 코드 제거?
```

### 파일 레벨

```
☐ 사용하지 않는 파일 삭제?
☐ 빈 파일 삭제?
☐ 중복 파일 병합?
```

### 아키텍처 레벨

```
☐ 사용하지 않는 Worker 제거?
☐ 사용하지 않는 Queue 제거?
☐ 사용하지 않는 Service 제거?
☐ 사용하지 않는 Component 제거?
```

모두 통과 후 커밋

---

## Metrics That Matter

프로젝트 건강도 지표:

```
Current State (2026-06-03):
├─ 파일 수: 794개
├─ 코드 라인: ~200,000줄
├─ tools/ 폴더: 188개
├─ Worker 수: 7개 (허용: 2개)
└─ Queue 수: 5개 (허용: 2개)

Target State:
├─ 파일 수: 500개 이하 (-37%)
├─ 코드 라인: ~120,000줄 (-40%)
├─ tools/ 폴더: 20개 (-89%)
├─ Worker 수: 2개 (-71%)
└─ Queue 수: 2개 (-60%)
```

---

## Prohibited Cleanup Patterns

❌ 잘못된 정리:

```
❌ legacy/ 폴더에 집어넣기
  → 죽은 코드 저장소가 됨

❌ backup/ 폴더 만들기
  → 추가 복잡도만 증가

❌ archived/ 폴더 추가
  → 언젠가 재사용할 거라는 착각

❌ -old, -new, -v2 파일명
  → 중복 저장
```

### ✅ 올바른 정리:

```
✅ 완전 삭제 (Git 히스토리에 남아있음)
✅ 또는 저장소 외부 이관
✅ 또는 다른 파일에 병합
```

---

## Dead Code Identification

제거 대상 코드:

```
❌ 호출되지 않는 함수
❌ 실행되지 않는 코드 경로
❌ 주석 처리된 코드
❌ 테스트에 사용되지 않는 코드
❌ 사용되지 않는 export
```

---

## Cleanup Automation

자동으로 감지되는 것:

```
TypeScript 컴파일러:
  - 사용되지 않는 import
  - 사용되지 않는 변수

ESLint:
  - 미사용 코드
  - 콘솔 로그
  - 주석 처리된 코드
```

도구 활용:
```bash
npm run lint -- --fix
npm run type-check
```

---

## Performance vs Cleanup

```
새 기능으로 성능 개선 제안?
  → 먼저 불필요한 코드 제거하세요

최적화 요청?
  → 먼저 죽은 코드 정리하세요

리팩토링 제안?
  → 먼저 미사용 기능 삭제하세요
```

정리가 최우선입니다.

---

## Cleanup Workflow

1. **개발 완료**
   - 기능 구현 완료
   - 테스트 통과

2. **정리 시작**
   - 불필요한 import 제거
   - 미사용 함수 제거
   - 중복 코드 병합

3. **검증**
   - 테스트 재실행
   - 빌드 확인
   - 린트 통과

4. **커밋**
   ```
   feat: Add X feature
   cleanup: Remove Y dead code
   refactor: Merge Z duplicate functions
   ```

5. **푸시**

---

## Exception: When NOT to Cleanup

정리하지 않아도 되는 경우:

```
❌ 핵심 기능 구현 중 (임시)
  → 나중에 정리

❌ 실험 단계 코드
  → 나중에 결정

❌ 버그 긴급 수정
  → 다음 정리 주기에 포함
```

하지만 이들은 **최대 1주일 이내** 정리되어야 함

---

## Project Growth Control

프로젝트 성장 제어:

```
Monthly Review:
├─ 파일 수 증가? → 정리 계획 수립
├─ 복잡도 증가? → 리팩토링 추진
├─ 코드 라인 증가? → 통합 검토
└─ 미사용 코드? → 즉시 제거
```

---

## Final Rule

```
Cleanup is not optional.

Cleanup is not afterthought.

Cleanup is part of the feature.

No feature is complete without cleanup.
```
