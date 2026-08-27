"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CampsiteCard } from "@/components/campsites/campsite-card";
import {
  FACILITY_FILTER_NAMES,
  hasVideoSource,
  matchesFacilities,
  matchesQuery,
  matchesRegion,
  type Campsite,
} from "@/lib/campsites/types";

const REGIONS = ["경기", "강원"];

type CampsiteBrowserProps = {
  campsites: Campsite[];
  initialRegion: string | null;
  initialFacilities: string[];
  initialQuery: string;
};

/** 첫 화면 전체(추천·필터·목록). 필터는 URL 쿼리와 동기화해 상세를 오가도 유지된다. */
export function CampsiteBrowser({ campsites, initialRegion, initialFacilities, initialQuery }: CampsiteBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [region, setRegion] = useState<string | null>(initialRegion);
  const [facilities, setFacilities] = useState<string[]>(initialFacilities);
  const [query, setQuery] = useState(initialQuery);

  const isFiltered = region !== null || facilities.length > 0 || query.trim() !== "";

  const picks = useMemo(() => campsites.filter(hasVideoSource), [campsites]);
  const pickIds = useMemo(() => new Set(picks.map((site) => site.id)), [picks]);

  const results = useMemo(
    () =>
      campsites.filter((site) => {
        if (!matchesRegion(site, region)) return false;
        if (!matchesFacilities(site, facilities)) return false;
        if (!matchesQuery(site, query)) return false;
        // 조건이 없을 땐 위 추천 영역에 이미 나온 곳을 아래 목록에서 뺀다.
        if (!isFiltered && pickIds.has(site.id)) return false;
        return true;
      }),
    [campsites, region, facilities, query, isFiltered, pickIds]
  );

  function syncUrl(nextRegion: string | null, nextFacilities: string[], nextQuery: string) {
    const params = new URLSearchParams();
    if (nextRegion) params.set("region", nextRegion);
    nextFacilities.forEach((name) => params.append("facility", name));
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  function handleRegionChange(value: string[]) {
    const next = value[0] ?? null;
    setRegion(next);
    syncUrl(next, facilities, query);
  }

  function handleFacilityToggle(name: string, checked: boolean) {
    const next = checked ? [...facilities, name] : facilities.filter((f) => f !== name);
    setFacilities(next);
    syncUrl(region, next, query);
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    syncUrl(region, facilities, next);
  }

  function resetFilters() {
    setRegion(null);
    setFacilities([]);
    setQuery("");
    syncUrl(null, [], "");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-0 z-10 flex flex-wrap items-end gap-x-6 gap-y-4 rounded-xl border bg-card px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">이름 검색</span>
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="캠핑장 이름으로 찾기"
            className="w-48"
            aria-label="캠핑장 이름 검색"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">지역</span>
          <ToggleGroup value={region ? [region] : []} onValueChange={handleRegionChange} variant="outline">
            {REGIONS.map((r) => (
              <ToggleGroupItem key={r} value={r}>
                {r}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">시설</span>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {FACILITY_FILTER_NAMES.map((name) => (
              <label key={name} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={facilities.includes(name)}
                  onCheckedChange={(checked) => handleFacilityToggle(name, checked === true)}
                />
                {name}
              </label>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            <b className="font-semibold text-foreground">{results.length}</b>곳
          </span>
          {isFiltered ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              조건 지우기
            </Button>
          ) : null}
        </div>
      </div>

      {!isFiltered && picks.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">영상으로 확인된 곳</h2>
            <p className="text-sm text-muted-foreground">
              실제로 다녀온 사람이 올린 유튜브·인스타그램 콘텐츠가 확인된 캠핑장입니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((site) => (
              <CampsiteCard key={site.id} campsite={site} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {isFiltered ? "조건에 맞는 캠핑장" : "그 외 캠핑장"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isFiltered
              ? "고른 조건에 모두 맞는 캠핑장입니다. 카드를 누르면 자세한 평가를 볼 수 있습니다."
              : `위 추천 ${picks.length}곳을 제외한 나머지입니다. 카드를 누르면 자세한 평가를 볼 수 있습니다.`}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((site) => (
              <CampsiteCard key={site.id} campsite={site} />
            ))}
          </div>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>이 조건에 맞는 캠핑장이 아직 없습니다</EmptyTitle>
              <EmptyDescription>
                모아둔 캠핑장은 경기·강원 {campsites.length}곳뿐입니다. 검색어를 지우거나 시설 조건을 하나
                빼고, 지역을 넓혀 보십시오.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={resetFilters}>
                조건 지우기
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </section>
    </div>
  );
}
