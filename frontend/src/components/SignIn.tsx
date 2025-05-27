import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { API_URLS } from "../config";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(
        API_URLS.LOGIN(),
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((reponse) => {
        if (reponse.status == 200 || reponse.status == 202) {
          toast.success("signed in");
          navigate("/");
        }
        console.log(reponse.data);
        signIn(reponse.data.loggedInUser, reponse.data.accessToken);
      })
      .catch((err) => {
        console.log(err);
        toast.error("failed to sign in");
      });
  };
  return (
    <div className="mt-60 w-100 mx-auto p-5 min-xl rounded-xl text-xl shadow-xl ">
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
        SignIn
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col p-10">
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
          className="h-12 w-20 bg-green-300 mx-auto rounded-md text-white m-2 p-2 pb-5"
        >
          signIn
        </button>
      </form>
    </div>
  );
}

export default SignIn;
