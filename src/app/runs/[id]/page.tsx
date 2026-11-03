import { RunDetailPage } from "@/features/run-detail/ui/run-detail-page";

export default async function RunDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RunDetailPage runId={id} />;
}
