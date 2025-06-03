const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BASE_URL
    : import.meta.env.VITE_PROD_BASE_URL;

const API_URLS = {
  LOGIN: () => `${BASE_URL}${import.meta.env.VITE_USER_SIGN_IN}`,
  LOGOUT: () => `${BASE_URL}${import.meta.env.VITE_USER_SIGN_OUT}`,
  REGISTER: () => `${BASE_URL}${import.meta.env.VITE_USER_REGISTER}`,
  GET_READ_LIST: (userId: number | null) =>
    `${BASE_URL}${import.meta.env.VITE_USER_GET_READ_LIST}?userId=${userId}`,
  ADD_BOOK: () => `${BASE_URL}${import.meta.env.VITE_BOOK_ADD_BOOK}`,
  REMOVE_BOOK: (bookId: number) =>
    `${BASE_URL}${import.meta.env.VITE_BOOK_REMOVE_BOOK}?bookId=${bookId}`,
  GET_ALL_BOOKS: (page: number, limit: number) =>
    `${BASE_URL}${
      import.meta.env.VITE_BOOK_GET_ALL_BOOK
    }?page=${page}&limit=${limit}`,
  GET_BOOK: (bookId: number) =>
    `${BASE_URL}${import.meta.env.VITE_BOOK_GET_A_BOOK}/${bookId}`,
  WRITE_REVIEW: (bookId: number) =>
    `${BASE_URL}${import.meta.env.VITE_WRITE_REVIEW}?bookId=${bookId}`,
  GET_REVIEW: (bookId: number) =>
    `${BASE_URL}${import.meta.env.VITE_GET_BOOK_REVIEW}?bookId=${bookId}`,
};

export { API_URLS };
