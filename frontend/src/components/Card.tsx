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
    <div>
      <h1 onClick={handleBookProfile}>{title}</h1>
      <img onClick={handleBookProfile} src={coverImg} />
      <span>{Author}</span>
      <span>{Year}</span>
      <span>{page}</span>
      <span>{Language}</span>
      <span>{country}</span>
      <a href={Link}>Link to wiki</a>
    </div>
  );
}

export default Card;
