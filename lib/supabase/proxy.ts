import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { hasEnvVars } from "@/lib/supabase/utils"

/**
 * proxy(구 middleware)에서 호출해 Auth 세션 쿠키를 갱신한다.
 * 페이지별 접근 제어(로그인 필요 라우트 리다이렉트 등)는 범위 밖이며,
 * 필요해지면 이 함수 안에서 user 유무를 보고 추가하면 된다.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 환경변수가 없으면 세션 갱신을 건너뛴다.
  if (!hasEnvVars) {
    return supabaseResponse
  }

  // Fluid compute 환경을 고려해 전역 변수에 두지 않고, 요청마다 새로 생성한다.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // createServerClient와 getClaims() 사이에 다른 코드를 넣지 않는다.
  // 실수로 코드를 끼워 넣으면 사용자가 임의로 로그아웃되는 문제를 디버깅하기 어려워진다.
  await supabase.auth.getClaims()

  // supabaseResponse 객체를 그대로 반환해야 한다.
  // 새 응답 객체가 필요하면 request를 넘겨 생성한 뒤,
  // supabaseResponse의 쿠키를 복사하고 나서 반환한다.
  return supabaseResponse
}
