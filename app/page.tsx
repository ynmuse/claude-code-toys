import { CampsiteBrowser } from "@/components/campsites/campsite-browser";
import { getCampsites } from "@/lib/campsites/queries";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const campsites = await getCampsites();

  const region = typeof searchParams.region === "string" ? searchParams.region : null;
  const facilityParam = searchParams.facility;
  const facilities = Array.isArray(facilityParam) ? facilityParam : facilityParam ? [facilityParam] : [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">강아지 동반 캠핑</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          유튜브·인스타그램에 올라온 반려견 캠핑 콘텐츠에서 인기있는 최신컨텐츠 중 경기·강원 캠핑장 {campsites.length}곳입니다.
        </p>
      </div>
      <CampsiteBrowser campsites={campsites} initialRegion={region} initialFacilities={facilities} />
    </div>
  );
}
