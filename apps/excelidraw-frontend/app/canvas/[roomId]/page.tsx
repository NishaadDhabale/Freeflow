import { RoomCanvas } from '@/components/RoomCanvas';

type PageProps = {
  params: Promise<{
    roomId: string;
  }>;
};
export const dynamic = 'force-dynamic';
export default async function CanvasPage({
  params,
}: PageProps) {
  const {roomId} = await params;

  return <RoomCanvas roomId={roomId} />;
}
