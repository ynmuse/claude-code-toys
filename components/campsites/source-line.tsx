import { cn } from "@/lib/utils";
import type { Campsite } from "@/lib/campsites/types";

const SOURCE_LABEL: Record<Campsite["source"]["platform"], string> = {
  youtube: "유튜브",
  instagram: "인스타그램",
  web: "공식 정보",
};

const SOURCE_DOT_CLASS: Record<Campsite["source"]["platform"], string> = {
  youtube: "bg-red-500",
  instagram: "bg-pink-500",
  web: "bg-muted-foreground",
};

/** 카드·상세에서 공통으로 쓰는 "● 유튜브 · 채널명" 한 줄. 채널명이 없으면 라벨만. */
export function SourceLine({ source, className }: { source: Campsite["source"]; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-muted-foreground", className)}>
      <span className={cn("size-1.5 shrink-0 rounded-full", SOURCE_DOT_CLASS[source.platform])} />
      {SOURCE_LABEL[source.platform]}
      {source.channel ? ` · ${source.channel}` : null}
    </span>
  );
}

export { SOURCE_LABEL };
