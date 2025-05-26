import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_URLS } from "../config";

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
interface paginationInterface {
  itemsPerPage: number;
  nextPage: number;
  prevPage: number;
  totalItem: number;
  totalPage: number;
}

interface bookContextInterface {
  books: bookInterface[] | null;
  pagination: paginationInterface | null;
  page: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}
interface BookProviderProps {
  children: ReactNode;
}

const BookContenxt = createContext<bookContextInterface | null>(null);
function BookProvider({ children }: BookProviderProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [books, setBooks] = useState<[bookInterface] | null>(null);
  const [pagination, setPagination] = useState<paginationInterface | null>(
    null
  );
  const fetchBooks = (page: number, limit: number) => {
    axios.get(API_URLS.GET_ALL_BOOKS(page, limit)).then((response) => {
      console.log("books...", response);
      setBooks(response.data.data);
      setPagination(response.data.pagination);
    });
  };

  useEffect(() => {
    fetchBooks(page, limit);
  }, [page, limit]);
  const context: bookContextInterface = {
    books,
    pagination,
    page,
    setPage,
    setLimit,
  };
  return (
    <BookContenxt.Provider value={context}>{children}</BookContenxt.Provider>
  );
}

export const useBook = () => {
  const context = useContext(BookContenxt);
  if (context === null) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};

export default BookProvider;
