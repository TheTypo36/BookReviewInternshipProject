import axios from "axios";
import { useState } from "react";
import { API_URLS } from "../config";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, email, password);
    axios
      .post(API_URLS.REGISTER(), {
        name,
        email,
        password,
      })
      .then((Response) => {
        console.log(Response.data);
        if (Response) {
          toast.success("user registered successfully!!");
        }
      })
      .catch(() => {
        toast.error("registration failed");
      })
      .finally(() => {
        navigate("/sign-in");
      });
  };
  return (
    <div className="mt-60 sm:w-100  lg:w-200 mx-auto p-5 min-xl rounded-xl text-xl shadow-xl ">
      <ToastContainer
        position="top-right"
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
          value={name}
          placeholder="enter the username"
          onChange={(e) => setName(e.target.value)}
          className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
        />
        <input
          type="email"
          value={email}
          placeholder="Enter the email..."
          onChange={(e) => setEmail(e.target.value)}
          className="w-full shadow-2xs h-15 my-5 border-1 border-purple-300 p-5"
        />
        <input
          type="password"
          value={password}
          placeholder="enter the password"
          onChange={(e) => setPassword(e.target.value)}
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

export default SignUp;
