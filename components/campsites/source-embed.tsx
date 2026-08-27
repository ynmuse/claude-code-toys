import { getSourceEmbedUrl } from "@/lib/campsites/source-embed";
import type { Campsite } from "@/lib/campsites/types";

/**
 * 원본 영상·게시물을 상세 화면 안에 바로 삽입한다. embed 주소를 뽑을 수 없으면
 * 아무것도 그리지 않아, 호출부의 "원본 보기" 링크만으로 대응한다.
 */
export function SourceEmbed({ source }: { source: Campsite["source"] }) {
  const embedUrl = getSourceEmbedUrl(source);
  if (!embedUrl) return null;

  if (source.platform === "youtube") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
        <iframe
          src={embedUrl}
          title={source.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-md bg-muted">
      <iframe src={embedUrl} title={source.title} className="h-[38rem] w-full" />
    </div>
  );
}
