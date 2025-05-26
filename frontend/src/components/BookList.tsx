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
    <div>
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

      <button onClick={() => setPage(pagination?.prevPage || 1)}>
        prevPage
      </button>
      <div>currpage: {page}</div>
      <button onClick={() => setPage(pagination?.nextPage || 1)}>
        nextPage
      </button>
      <div>totalPages: {pagination?.totalPage}</div>
    </div>
  );
}

export default BookList;
