import { describe, expect, it } from "vitest";

import { hasVideoSource, matchesFacilities, matchesFacility, matchesRegion } from "@/lib/campsites/types";

describe("matchesRegion", () => {
  it("region 값이 필터 접두어로 시작하면 매칭한다", () => {
    expect(matchesRegion({ region: "강원 홍천" }, "강원")).toBe(true);
    expect(matchesRegion({ region: "경기 여주" }, "강원")).toBe(false);
  });

  it("필터가 없으면(null) 모두 매칭한다", () => {
    expect(matchesRegion({ region: "강원" }, null)).toBe(true);
  });
});

describe("matchesFacility", () => {
  it("필터 이름 자체와 정확히 같은 태그도 매칭한다", () => {
    // 실제 데이터에 '애견운동장'이라는 원본 태그가 그대로 붙은 캠핑장이 있다.
    expect(matchesFacility({ amenities: ["애견운동장"] }, "애견운동장")).toBe(true);
  });

  it("동의어 태그도 매칭한다", () => {
    expect(matchesFacility({ amenities: ["개인울타리"] }, "개별울타리")).toBe(true);
    expect(matchesFacility({ amenities: ["애견놀이터"] }, "애견운동장")).toBe(true);
  });

  it("그룹에 없는 태그는 매칭하지 않는다", () => {
    expect(matchesFacility({ amenities: ["개별샤워실"] }, "애견운동장")).toBe(false);
  });
});

describe("matchesFacilities", () => {
  it("빈 배열이면 모두 매칭한다", () => {
    expect(matchesFacilities({ amenities: [] }, [])).toBe(true);
  });

  it("고른 필터를 모두 만족해야 매칭한다(AND)", () => {
    const site = { amenities: ["개별울타리", "애견수영장"] };
    expect(matchesFacilities(site, ["개별울타리"])).toBe(true);
    expect(matchesFacilities(site, ["개별울타리", "애견운동장"])).toBe(false);
  });
});

describe("hasVideoSource", () => {
  it("유튜브·인스타그램만 참이다", () => {
    expect(hasVideoSource({ source: { platform: "youtube" } })).toBe(true);
    expect(hasVideoSource({ source: { platform: "instagram" } })).toBe(true);
    expect(hasVideoSource({ source: { platform: "web" } })).toBe(false);
  });
});
