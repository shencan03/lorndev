import IndexCard from "@/app/ui/IndexCard";
import MovieCard from "@/app/ui/MovieCard";
import PeopleCard from "@/app/ui/PeopleCard";
import BooksCard from "@/app/ui/BooksCard";

const curationList = [
  { title: "Movies", href: "/curation#movies" },
  { title: "TV", href: "/curation#tv" },
  { title: "Books", href: "/curation#books" },
  { title: "People", href: "/curation#people" },
];

export default function Curation() {
  return (
    <div className="flex flex-col gap-100 ">
      <IndexCard items={curationList} />
      <div id="movies">
        <MovieCard />
      </div>
      <div id="tv">
        <MovieCard />
      </div>
      <div id="people">
        <PeopleCard />
      </div>
      <div id="books">
        <BooksCard />
      </div>
    </div>
  );
}
