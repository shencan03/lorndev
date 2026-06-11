import IndexCard from "@/components/IndexCard"
import MovieCard from "@/components/MovieCard"
import PeopleCard from "@/components/PeopleCard"
import BooksCard from "@/components/BooksCard"

const curationList = [
  {title: "Movies", href: "/curation#movies"},
  {title: "TV", href: "/curation#tv"},
  {title: "Books", href: "/curation#books"},
  {title: "People", href: "/curation#people"}
]

export default function Curation() {
  return (
      <div className="flex flex-col gap-1000 mx-auto">
        <IndexCard items={curationList} colCount={2}/>
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
  )
}