export type TVCard = {
  name: string;
  poster_path: string;
};

export type MovieCard = {
  title: string;
  poster_path: string;
};

export interface TVReview extends TVCard {
  review: string;
}

export interface MovieReview extends MovieCard {
  review: string;
}

export type MediaObj = "review" | "card";

export type SongCard = {
  title: string;
  artists: string;
  thumbnail: string;
  videoId: string;
};
