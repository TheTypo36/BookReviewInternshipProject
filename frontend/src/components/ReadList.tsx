import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { API_URLS } from "../config";
import axios from "axios";
import Card from "./Card";
import type { bookInterface } from "../contexts/BookContenxt";
function ReadList() {
  const { userName, userId } = useAuth();
  const [fav, setFav] = useState([]);
  useEffect(() => {
    axios.get(API_URLS.GET_READ_LIST(userId)).then((response) => {
      console.log(response);
      setFav(response.data.books);
    });
  });
  return (
    <div>
      <div>Welcome {userName}, to you ReadList</div>
      <div>
        {fav.map((book: bookInterface) => (
          <Card
            id={book.id}
            title={book.title}
            Year={book.Year}
            Author={book.Author}
            page={book.page}
            Language={book.Language}
            Link={book.Link}
            country={book.country}
            coverImg={book.coverImg}
          />
        ))}
      </div>
    </div>
  );
}

export default ReadList;
