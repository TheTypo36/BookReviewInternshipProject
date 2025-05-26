import { useBook } from "../contexts/BookContenxt";
import { useParams } from "react-router-dom";

function BookProfile() {
  const { id } = useParams<{ id: string }>();

  const { books } = useBook();
  const bookId = Number(id);
  console.log(id, bookId);

  const book = books?.find((b) => b.id === bookId);
  console.log(book?.coverImg);
  const imageUrl = bookId <= 100 ? `/${book?.coverImg}` : book?.coverImg;
  return (
    <div>
      {book?.title}

      <img src={imageUrl} />
    </div>
  );
}

export default BookProfile;
