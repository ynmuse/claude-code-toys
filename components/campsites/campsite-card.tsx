import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SourceLine } from "@/components/campsites/source-line";
import type { Campsite } from "@/lib/campsites/types";

export function CampsiteCard({ campsite }: { campsite: Campsite }) {
  return (
    <Link href={`/campsites/${campsite.id}`} className="block outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-xl">
      <Card className="h-full transition-colors hover:bg-accent/40">
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
