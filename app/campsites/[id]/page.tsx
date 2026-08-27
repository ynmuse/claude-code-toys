import { notFound } from "next/navigation";

import { CampsiteDetail } from "@/components/campsites/campsite-detail";
import { getCampsiteById } from "@/lib/campsites/queries";

export default async function CampsitePage(props: PageProps<"/campsites/[id]">) {
  const { id } = await props.params;
  const campsite = await getCampsiteById(id);

  if (!campsite) {
    notFound();
  }

  return <CampsiteDetail campsite={campsite} />;
}
