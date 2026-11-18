import ShuffledCarousel from "@/app/ui/shuffled-carousel";
import SongCard from "@/app/ui/song-card";
import { LIKED_SONGS, youtubeMusicUrl } from "@/app/lib/ytmusic/getSong";

export default function SongCarousel() {
  return (
    <ShuffledCarousel
      id="songs"
      max={24}
      placeholderClassName="aspect-square"
      items={LIKED_SONGS.map((song) => ({
        key: song.videoId,
        href: youtubeMusicUrl(song.videoId),
        card: <SongCard song={song} />,
      }))}
    />
  );
}
