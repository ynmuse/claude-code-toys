import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackToListButton } from "@/components/campsites/back-to-list-button";
import { SOURCE_LABEL, SourceLine } from "@/components/campsites/source-line";
import type { Campsite } from "@/lib/campsites/types";

export function CampsiteDetail({ campsite }: { campsite: Campsite }) {
  const isWebSource = campsite.source.platform === "web";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <BackToListButton />

      <div className="flex flex-col gap-3 border-b pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{campsite.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{campsite.region}</p>
        </div>
        {campsite.amenities.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {campsite.amenities.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className="max-w-prose text-[0.9375rem] leading-relaxed text-muted-foreground">{campsite.summary}</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">반려견 크기</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-[0.9375rem] leading-relaxed">{campsite.dogSize}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                원본 콘텐츠·공식 정보에서 확인한 내용을 그대로 옮긴 것입니다. 정확한 조건은 예약 전 캠핑장에
                다시 확인하십시오.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">기본 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-2.5 text-sm">
                <dt className="text-muted-foreground">지역</dt>
                <dd>{campsite.region}</dd>
                <dt className="text-muted-foreground">시설</dt>
                <dd>{campsite.amenities.length > 0 ? campsite.amenities.join(", ") : "확인된 시설 정보 없음"}</dd>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">이 정보의 출처</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <SourceLine source={campsite.source} className="text-xs" />
            <p className="text-[0.9375rem] font-medium leading-relaxed">{campsite.source.title}</p>
            <a
              href={campsite.source.url}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "outline" })}
            >
              {isWebSource ? "공식 정보 보기" : "원본 보기"}
              <ExternalLink data-icon="inline-end" />
            </a>
            {isWebSource ? (
              <p className="rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                이 캠핑장은 유튜브·인스타그램에서 찾았지만 원본 게시물 링크를 특정하지 못해, {SOURCE_LABEL.web}
                로 대신 연결합니다.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
