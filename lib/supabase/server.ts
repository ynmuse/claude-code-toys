import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Server Component / Server Action / Route Handler에서 사용하는 Supabase 클라이언트.
 * Fluid compute 환경을 고려해 전역 변수에 두지 않고, 매번 새로 생성한다.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 호출된 경우 무시한다.
            // proxy에서 세션을 갱신하고 있다면 문제 없다.
          }
        },
      },
    }
  )
}
