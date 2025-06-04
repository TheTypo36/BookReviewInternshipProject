import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { bookInterface } from "./BookList";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../config";
import { toast } from "react-toastify";

function Card({
  id,
  title,
  Author,
  Link,
  Year,
  page,
  country,
  Language,
  coverImg,
}: bookInterface) {
  const { userId } = useAuth();
  const navigation = useNavigate();
  function handleAddToReadList() {
    axios
      .post(
        API_URLS.ADD_BOOK_TO_READ_LIST(userId, id),
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status == 200) {
          toast.success("book added to fav list");
        } else {
          toast.success("book failed to added to favlist");
        }
        console.log(response);
      })
      .catch((error) => {
        console.error("error on hitting add book to fav api route", error);
      });
  }
  const handleBookProfile = () => {
    navigation(`/book/${id}`);
  };
  return (
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 m-10 lg:ml-30 sm:ml-5 lg:w-200 sm:w-100 shadow-2xl hover:scale-110 relative rounded-md">
      <div>
        <img
          onClick={handleBookProfile}
          src={coverImg}
          className="col-start-1"
        />
      </div>
      <div className="m-10">
        <div>
          <h1
            onClick={handleBookProfile}
            className="text-3xl text-purple-400 font-bold"
          >
            {title}
          </h1>
        </div>
        <div className="text-xl row-span-1/2">
          <span className="text-2xl">{Author}</span> <br /> <br />{" "}
          <span className="">{Year}</span> <br /> <span>{page}</span>
          <span>{Language}</span>
          <br />
          <span>{country}</span> | <a href={Link}>Link to wiki</a>
        </div>
      </div>
      <div
        onClick={handleAddToReadList}
        className="w-30 h-15 rounded-sm shadow-2xs bg-red-400 opacity-80 cursor-pointer absolute bottom-10 right-5 p-2"
      >
        📖Add To Fav
      </div>
    </div>
  );
}

export default Card;
