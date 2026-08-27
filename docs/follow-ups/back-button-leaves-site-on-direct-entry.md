# 상세 화면에 직접 진입하면 "목록으로" 버튼이 사이트 밖으로 나갈 수 있다

**Symptom**: 공유 링크나 검색 결과처럼 첫 화면을 거치지 않고 `/campsites/[id]`로
바로 들어온 경우, "목록으로" 버튼을 누르면 이 사이트의 목록 화면이 아니라 이
사이트에 들어오기 전 방문했던 페이지(또는 그 이전 히스토리)로 이동할 수 있다.

**Observed evidence**: `components/campsites/back-to-list-button.tsx`가
`window.history.length > 1`일 때 `router.push("/")` 대신 무조건 `router.back()`을
호출한다. `history.length`는 현재 탭의 전체 세션 히스토리 길이라 이 사이트 진입
이전의 다른 사이트 방문 기록도 포함한다. 이번 work unit의 주 경로(첫 화면 →
카드 클릭 → 상세 → 목록으로)는 항상 사이트 안에서만 이동하므로 이 문제가
드러나지 않았고, 실제로 사이트 밖에서 직접 진입해 재현하지는 않았다.

**Suspected cause**: `history.length`만으로는 직전 페이지가 이 사이트 안인지
밖인지 구분할 수 없기 때문으로 추정된다.

**What was tried**: 이번 범위에서는 정상 흐름(카드 클릭으로 진입)만 수용 기준에
포함되어 있어 고치지 않고 기록만 남긴다.

**Proposed next step**: 이 사이트 안에서 이동해 왔는지 표시하는 상태(예: 상세
진입 시 `document.referrer`가 같은 origin인지 확인하거나, 목록 화면에서 상세로
이동할 때 세션 스토리지에 플래그를 남기는 방법)를 두고, 그 표시가 없으면
`router.back()` 대신 항상 `router.push("/")`로 목록으로 보낸다.
