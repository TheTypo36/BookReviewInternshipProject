import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { bookInterface } from "../contexts/BookContenxt";
import { useNavigate } from "react-router-dom";

function ReadListCard({
  id,
  Author,
  title,
  Link,
  page,
  Year,
  coverImg,
  country,
  Language,
}: bookInterface) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  function handleRemove() {}

  if (!isLoggedIn) {
    navigate("/");
  }
  return (
    <div className="shadow-xl rounded-l lg:h-140 sm:h-50 lg:w-100 w-50 flex flex-col p-5 m-5">
      <div className="text-2xl text-purple-700">
        <a href={Link}>
          {id}: {title}
        </a>
      </div>
      <div className="h-fit w-fit">
        <img src={coverImg} />
      </div>
      <div className="flex flex-row w-full justify-evenly">
        <div className="flex flex-col">
          <span>{Author}</span>
          <span>{Year}</span>
        </div>
        <div className="flex flex-col">
          <span>{country}</span>
          <span>{page}</span>
          <span>{Language}</span>
        </div>
      </div>
      <div
        className="hover:shadow-xl  h-10 w-30 cursor-pointer"
        onClick={handleRemove}
      >
        ❌ remove
      </div>
    </div>
  );
}

export default ReadListCard;
