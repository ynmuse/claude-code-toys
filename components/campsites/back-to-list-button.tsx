"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * 브라우저 히스토리로 돌아간다. 목록의 필터·스크롤 상태는 URL 쿼리에 있으므로
 * router.back()이어야 그대로 복원된다. 상세로 직접 들어와 히스토리가 없으면
 * 첫 화면으로 이동한다.
 */
export function BackToListButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
    >
      <ArrowLeft data-icon="inline-start" />
      목록으로
    </Button>
  );
}
