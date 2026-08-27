# 캠핑장 상세에서 잘못된 형식의 id는 404가 아니라 500이 뜬다

**Symptom**: `/campsites/[id]`에 UUID 형식이 아닌 값(오타, 조작된 URL, 손상된 링크
등)으로 접근하면 "찾을 수 없음" 안내 대신 Next.js 에러 페이지(500)가 뜬다.

**Observed evidence**: `lib/campsites/queries.ts`의 `getCampsiteById`가
`supabase.from("campsites").select(...).eq("id", id)`를 호출할 때, `id`가 유효한
UUID가 아니면 PostgREST가 "invalid input syntax for type uuid" 에러를 반환한다.
코드는 이 `error`를 존재하지 않는 UUID의 경우와 구분하지 않고 무조건
`throw new Error(...)`로 처리한다. 반면 유효한 UUID인데 데이터가 없는 경우는
`data`가 `null`이 되어 `app/campsites/[id]/page.tsx`가 `notFound()`로 정상적인
404를 띄운다. code-review low 단계에서 diff만 보고 발견했으며, 실제 브라우저로
재현하지는 않았다.

**Suspected cause**: `getCampsiteById`가 Supabase 에러 코드를 구분하지 않고 모든
에러를 동일하게 처리하기 때문으로 추정된다. PostgREST의 UUID 파싱 에러는 보통
`22P02`(invalid_text_representation) 코드로 온다.

**What was tried**: 이번 work unit(pet-camping-browse)의 주 경로(카드 클릭 →
상세 → 목록)는 항상 유효한 UUID로만 진입하므로 영향이 없다고 판단해, 이번
범위에서는 고치지 않고 기록만 남긴다.

**Proposed next step**: `getCampsiteById`에서 에러 코드가 `22P02`(또는 유사한
입력 형식 에러)일 때는 `null`을 반환하도록 분기해, 호출부의 `notFound()`가
그대로 처리하게 한다. 그 외 에러(네트워크, 권한 등)만 계속 throw한다.
