/**
 * Supabase 환경변수가 설정되어 있는지 여부.
 * 값이 비어 있으면 proxy의 세션 갱신을 건너뛰기 위해 사용한다.
 */
export const hasEnvVars =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
