export type MovieEntry = { title: string; tmdbId: number };

// Mirrors https://letterboxd.com/Sobrietyy/films/ (newest release first).
export const MOVIES: MovieEntry[] = [
  { title: "All Quiet on the Western Front (2022)", tmdbId: 49046 },
  { title: "Blade Runner 2049 (2017)", tmdbId: 335984 },
  { title: "The Intern (2015)", tmdbId: 257211 },
  { title: "The Equalizer (2014)", tmdbId: 156022 },
  { title: "The Wolf of Wall Street (2013)", tmdbId: 106646 },
  { title: "The Departed (2006)", tmdbId: 1422 },
  { title: "The Terminal (2004)", tmdbId: 594 },
  { title: "Man on Fire (2004)", tmdbId: 9509 },
  { title: "Catch Me If You Can (2002)", tmdbId: 640 },
  { title: "Gladiator (2000)", tmdbId: 98 },
  { title: "The Green Mile (1999)", tmdbId: 497 },
  { title: "Fight Club (1999)", tmdbId: 550 },
  { title: "The Matrix (1999)", tmdbId: 603 },
  { title: "You've Got Mail (1998)", tmdbId: 9489 },
  { title: "Saving Private Ryan (1998)", tmdbId: 857 },
  { title: "Braveheart (1995)", tmdbId: 197 },
  { title: "Pulp Fiction (1994)", tmdbId: 680 },
  { title: "Scent of a Woman (1992)", tmdbId: 9475 },
  { title: "Unforgiven (1992)", tmdbId: 33 },
  { title: "Reservoir Dogs (1992)", tmdbId: 500 },
  { title: "Pretty Woman (1990)", tmdbId: 114 },
  { title: "The Untouchables (1987)", tmdbId: 117 },
  { title: "The Godfather (1972)", tmdbId: 238 },
  { title: "The Good, the Bad and the Ugly (1966)", tmdbId: 429 },
];
