import { Tent } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SourceLine } from "@/components/campsites/source-line";
import { getCampsiteThumbnailUrl } from "@/lib/campsites/source-embed";
import type { Campsite } from "@/lib/campsites/types";

export function CampsiteCard({ campsite }: { campsite: Campsite }) {
  const thumbnailUrl = getCampsiteThumbnailUrl(campsite.source);

  return (
    <Link href={`/campsites/${campsite.id}`} className="block outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-xl">
      <Card className="h-full overflow-hidden pt-0 transition-colors hover:bg-accent/40">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- 외부 썸네일 도메인을 next/image에 등록하지 않고 그대로 표시한다.
            <img src={thumbnailUrl} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Tent className="size-8 text-muted-foreground/40" aria-hidden />
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle>{campsite.name}</CardTitle>
          <CardDescription>{campsite.region}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {campsite.amenities.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {campsite.amenities.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
          <p className="line-clamp-3 text-sm text-muted-foreground">{campsite.summary}</p>
          <SourceLine source={campsite.source} className="text-xs" />
        </CardContent>
      </Card>
    </Link>
  );
}
