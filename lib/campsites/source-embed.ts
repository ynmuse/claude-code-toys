import type { Campsite } from "@/lib/campsites/types";

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([\w-]{6,})/,
];

const INSTAGRAM_PATTERN = /instagram\.com\/(p|reel)\/([\w-]+)/;

function extractYoutubeVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function getInstagramEmbedUrl(url: string): string | null {
  const match = url.match(INSTAGRAM_PATTERN);
  if (!match) return null;
  const [, kind, code] = match;
  return `https://www.instagram.com/${kind}/${code}/embed`;
}

/**
 * 원본 콘텐츠(유튜브·인스타그램)를 상세 화면 안에 바로 삽입할 수 있는 iframe 주소.
 * `web` 출처는 원본이 아니라 대체 링크라서 다루지 않고, URL 패턴이 예상과 다르면
 * null을 돌려줘 호출부가 기존 "원본 보기" 링크로만 대응하게 한다.
 */
export function getSourceEmbedUrl(source: Campsite["source"]): string | null {
  if (source.platform === "youtube") return getYoutubeEmbedUrl(source.url);
  if (source.platform === "instagram") return getInstagramEmbedUrl(source.url);
  return null;
}

/**
 * 목록 카드에 쓸 대표 이미지. 유튜브 출처만 영상 썸네일을 자동으로 가져올 수
 * 있고, 인스타그램·web 출처는 인증 없이 프론트에서 가져올 방법이 없어 null을
 * 돌려준다 — 호출부가 플레이스홀더로 대응한다.
 */
export function getCampsiteThumbnailUrl(source: Campsite["source"]): string | null {
  if (source.platform !== "youtube") return null;
  const videoId = extractYoutubeVideoId(source.url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}
