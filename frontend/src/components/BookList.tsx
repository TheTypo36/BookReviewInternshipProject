import Card from "./Card";
import { useBook } from "../contexts/BookContenxt";

export interface bookInterface {
  id: number;
  title: string;
  country: string;
  coverImg: string;
  Language: string;
  Author: string;
  Year: string;
  page: number;
  Link: string;
}
function BookList() {
  const { books, pagination, page, setPage } = useBook();

  return (
    <div className="mt-40">
      {books?.map((book) => (
        <Card
          key={book.id}
          id={book.id}
          title={book.title}
          coverImg={book.coverImg}
          Author={book.Author}
          Link={book.Link}
          page={book.page}
          Year={book.Year}
          country={book.country}
          Language={book.Language}
        />
      ))}
      <div className="mx-auto flex flex-roww-full justify-center items-center   opacity-20 ">
        <button
          onClick={() => setPage(pagination?.prevPage || 1)}
          className="m-2 h-10 w-20 shadow-sm rounded-sm cursor-pointer  bg-red-700 text-white"
          disabled={page === 1}
        >
          prevPage
        </button>
        <button
          onClick={() => setPage(pagination?.nextPage || 1)}
          className="m-2 h-10 w-20 shadow-sm  cursor-pointer rounded-sm bg-red-700 text-white"
          disabled={page === pagination?.totalPage}
        >
          nextPage
        </button>
      </div>
    </div>
  );
}

export default BookList;
