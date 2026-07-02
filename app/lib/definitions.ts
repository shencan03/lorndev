type IndexCardItem = {
  title: string;
  href: string;
};

export type IndexCardProps = {
  items: IndexCardItem[];
};

export type NavLinkProps = {
  link: string;
  href: string;
};

type Artist = {
  title: string;
  url?: string;
};

type Album = {
  title: string;
  url: string;
};

export interface LastPlayed extends Artist, Album {
  title: string;
  url: string;
  thumbnailurl: string;
  album?: Album | null;
  artist?: Artist | null;
}
