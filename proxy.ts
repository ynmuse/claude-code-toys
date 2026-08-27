import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

// Next.js 16부터 middleware.ts는 proxy.ts로 이름이 바뀌었다.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 아래 경로는 제외하고 모든 요청 경로에서 실행한다:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico, 이미지 확장자 파일
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
