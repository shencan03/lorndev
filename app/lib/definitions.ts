export type TVCard = {
  name: string;
  poster_path: string;
  url: string;
  year?: number;
};

export type MovieCard = {
  title: string;
  poster_path: string;
  url: string;
  year?: number;
};

export type SongCard = {
  title: string;
  artists: string;
  thumbnail: string;
  videoId: string;
};

export type GameCard = {
  name: string;
  cover: string;
  url: string;
  year?: number;
};
