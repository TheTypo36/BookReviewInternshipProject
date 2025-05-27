import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { API_URLS } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AddBook() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [Language, setLanguage] = useState("");
  const [Author, setAuthor] = useState("");
  const [Year, setYear] = useState("");
  const [page, setPage] = useState("");
  const [Link, setLink] = useState("");
  const [coverImg, setCoverImg] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("country", country);
    formData.append("Language", Language); // Ensure casing matches backend/Prisma if this is a string
    formData.append("Author", Author); // Ensure casing
    formData.append("Year", Year); // Ensure casing
    formData.append("page", page.toString()); // Convert number to string for FormData
    formData.append("Link", Link);
    if (coverImg) {
      // Check if a file is actually selected
      formData.append("coverImg", coverImg); // Append the actual File object
    }
    axios
      .post(API_URLS.ADD_BOOK(), formData, { withCredentials: true })
      .then((Response) => {
        console.log(Response);
        if (Response.status == 200 || Response.status == 202) {
          toast.success("successfully added the book ");
        }
      })
      .catch(() => {
        toast.error("failed to add book");
      })
      .finally(() => {
        navigate("/");
      });
  };
  if (isAdmin) {
    return (
      <div className="mt-60 sm:w-100  lg:w-200 mx-auto p-5 min-xl rounded-xl text-xl shadow-xl ">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <h1 className="text-2xl text-center m-5 font-bold text-purple-800">
          SignUp
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col p-10">
          <input
            type="text"
            value={title}
            placeholder="enter the title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <input
            type="text"
            value={country}
            placeholder="Enter the country..."
            onChange={(e) => setCountry(e.target.value)}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <input
            type="text"
            value={Language}
            placeholder="enter the Language"
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <input
            type="text"
            value={Author}
            placeholder="enter the Author"
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <input
            type="text"
            value={Year}
            placeholder="enter the Year"
            onChange={(e) => setYear(e.target.value)}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <input
            type="text"
            value={page}
            placeholder="enter the page"
            onChange={(e) => setPage(e.target.value)}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <input
            type="text"
            value={Link}
            placeholder="enter the Link"
            onChange={(e) => setLink(e.target.value)}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setCoverImg(e.target.files[0]);
              } else {
                setCoverImg(null);
              }
            }}
            className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
          />
          <button
            type="submit"
            className="h-12 w-20 cursor-pointer bg-green-300 mx-auto rounded-md text-white m-2 p-2 pb-5"
          >
            signUp
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="text-8xl text-red-600 absolute top-100 right-100">
      Access Denied
    </div>
  );
}

export default AddBook;
