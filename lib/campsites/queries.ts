import { createClient } from "@/lib/supabase/server";
import type { Campsite } from "@/lib/campsites/types";

const CAMPSITE_COLUMNS =
  "id, name, region, dog_size, amenities, summary, source_platform, source_title, source_url, source_channel";

type CampsiteRow = {
  id: string;
  name: string;
  region: string;
  dog_size: string;
  amenities: string[] | null;
  summary: string;
  source_platform: Campsite["source"]["platform"];
  source_title: string;
  source_url: string;
  source_channel: string | null;
};

function toCampsite(row: CampsiteRow): Campsite {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    dogSize: row.dog_size,
    amenities: row.amenities ?? [],
    summary: row.summary,
    source: {
      platform: row.source_platform,
      title: row.source_title,
      url: row.source_url,
      channel: row.source_channel,
    },
  };
}

/** 경기·강원 반려동반 캠핑장 전체 목록. 화면에서 클라이언트 사이드로 필터링한다. */
export async function getCampsites(): Promise<Campsite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campsites")
    .select(CAMPSITE_COLUMNS)
    .order("name");

  if (error) {
    throw new Error(`캠핑장 목록을 불러오지 못했습니다: ${error.message}`);
  }
  return (data ?? []).map(toCampsite);
}

/** 캠핑장 하나를 조회한다. 존재하지 않으면 null. */
export async function getCampsiteById(id: string): Promise<Campsite | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campsites")
    .select(CAMPSITE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`캠핑장 정보를 불러오지 못했습니다: ${error.message}`);
  }
  return data ? toCampsite(data) : null;
}
