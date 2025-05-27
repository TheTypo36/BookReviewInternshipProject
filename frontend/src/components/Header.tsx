import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { API_URLS } from "../config";
import { ToastContainer, toast } from "react-toastify";

import { useEffect, useState } from "react";

function Header() {
  const { userName, isAdmin, signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await axios
      .get(API_URLS.LOGOUT(), { withCredentials: true })
      .then((response) => {
        if (response.status == 200 || response.status == 202) {
          toast.success("signed out");

          signOut();
        }
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        toast.error("failed to signout");
      });
  };

  return (
    <div className="w-full h-10 flex flex-row justify-between items-center p-15 font-bold text-2xl text-white bg-red-500 fixed top-0 left-0 font-sans z-10">
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
      <h1 onClick={() => navigate("/")} className="hover:cursor-pointer">
        bookReview Fun
      </h1>
      <div>
        {isLoggedIn ? (
          <div className="flex flex-row justify-around">
            <div className="">{userName}</div>
            <div className="cursor-pointer mx-3" onClick={handleSignOut}>
              signOut
            </div>
            {isAdmin && (
              <div onClick={() => navigate("/add-book")}>AddBook</div>
            )}
          </div>
        ) : (
          <div className="flex flex-row">
            <div
              className="cursor-pointer m-2"
              onClick={() => navigate("/sign-in")}
            >
              signIn
            </div>
            <div
              className="cursor-pointer m-2"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
