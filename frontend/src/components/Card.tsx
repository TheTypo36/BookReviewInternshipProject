import type { bookInterface } from "./BookList";
import { useNavigate } from "react-router-dom";

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
  const navigation = useNavigate();
  const handleBookProfile = () => {
    navigation(`/book/${id}`);
  };
  return (
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 m-10 lg:ml-30 sm:ml-5 lg:w-200 sm:w-100 shadow-2xl hover:scale-110 rounded-md">
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
    </div>
  );
}

export default Card;
