import { useBook } from "../contexts/BookContenxt";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";

function BookProfile() {
  const { id } = useParams<{ id: string }>();

  const { books } = useBook();
  const bookId = Number(id);
  console.log(id, bookId);

  const book = books?.find((b) => b.id === bookId);
  console.log(book?.coverImg);
  const imageUrl = bookId <= 100 ? `/${book?.coverImg}` : book?.coverImg;

  return (
    <div className="mt-30 p-1 min-h-l w-6xl shadow-xl rounded-2xl relative m-auto flex flex-col lg:flex-row">
      <div>
        <div className="text-2xl ml-5 font-bold h-10 rounded-xl  text-purple-500 hover:cursor-pointer p-2 mb-2">
          {book?.title}
        </div>
        <a href={book?.Link}>
          <img
            src={imageUrl}
            className="hover:cursor-pointer hover:scale-105 w-120 m-5"
          />
        </a>
      </div>
      <div>
        <h2 className="m-5 mb-0 text-2xl text-purple-700">
          Wanna leave Review...
        </h2>
        {/* {!reviews && !loadingReview && <h1>no review</h1>}
        {reviews?.map((review) => (
          <h1>{review.content}</h1>
        ))} */}
        <ReviewCard book={book} bookId={bookId} />
      </div>
    </div>
  );
}

export default BookProfile;
