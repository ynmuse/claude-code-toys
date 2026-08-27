/**
 * Supabase `campsites` 테이블 한 행. 컬럼은 pet-camping-dataset work unit이
 * 정한 그대로이며, region·dog_size·amenities는 조사한 원문을 그대로 담은
 * 자유 텍스트(또는 자유 텍스트 배열)다.
 */
export type Campsite = {
  id: string;
  name: string;
  /** "강원", "강원 홍천"처럼 시·군까지 포함될 수 있다. */
  region: string;
  /** "정보 미확인"처럼 정해진 값이 아닌 자유 텍스트. 필터에는 쓰지 않는다. */
  dogSize: string;
  amenities: string[];
  summary: string;
  source: {
    platform: "youtube" | "instagram" | "web";
    /** 영상 제목 또는 게시물 캡션. */
    title: string;
    url: string;
    /** web 출처거나 원본에 계정명이 없으면 null. */
    channel: string | null;
  };
};

/**
 * 시설 필터 하나가 매칭할 실제 태그 동의어 묶음. `pet-camping-browse` 스펙에서
 * 확정한 목록이다. 이 묶음에 없는 태그(개별샤워실 등)는 필터 대상이 아니며
 * 카드·상세에는 원본 태그 그대로 노출한다.
 */
export const FACILITY_GROUPS: Record<string, string[]> = {
  애견운동장: ["애견운동장", "개별운동장", "애견놀이터", "대형견전용놀이터", "소형견전용놀이터"],
  개별울타리: ["개별울타리", "개인울타리", "개별펜스"],
};

export const FACILITY_FILTER_NAMES = Object.keys(FACILITY_GROUPS);

/** region엔 "강원 홍천"처럼 시·군까지 포함되어 있어 접두어로 판단한다. */
export function matchesRegion(site: Pick<Campsite, "region">, region: string | null): boolean {
  return !region || site.region.startsWith(region);
}

/** 필터 하나가 동의어 그룹 중 하나라도 있으면 매칭된 것으로 본다. */
export function matchesFacility(site: Pick<Campsite, "amenities">, facilityName: string): boolean {
  const group = FACILITY_GROUPS[facilityName];
  return group?.some((tag) => site.amenities.includes(tag)) ?? false;
}

export function matchesFacilities(site: Pick<Campsite, "amenities">, facilityNames: string[]): boolean {
  return facilityNames.every((name) => matchesFacility(site, name));
}

/** 원본 영상·게시물이 실제로 확인된 곳(추천 대상)인지. */
export function hasVideoSource(site: { source: Pick<Campsite["source"], "platform"> }): boolean {
  return site.source.platform === "youtube" || site.source.platform === "instagram";
}
