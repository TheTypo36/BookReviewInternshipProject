import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { API_URLS } from "../config";
import axios from "axios";
import ReadListCard from "./ReadListCard";
function ReadList() {
  const { userName, userId } = useAuth();
  const [fav, setFav] = useState([]);
  useEffect(() => {
    axios
      .get(API_URLS.GET_READ_LIST(userId), {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.readLists);
        setFav(response.data.readLists);
      });
  }, [userId]);

  if (fav.length == 0) {
    return (
      <div className="text-2xl absolute top-50 left-30">
        no book to show....
      </div>
    );
  }
  return (
    <div>
      <div>Welcome {userName}, to you ReadList</div>
      <div className="w-full h-full mt-30 grid md:grid-col-2 sm:grid-col-1 grid-cols-4 gap-2">
        {fav.map(({ book }: any) => (
          <ReadListCard
            key={book.id + book.title}
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
