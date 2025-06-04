import { AuthProvider } from "./contexts/AuthContext";
import BookList from "./components/BookList";
import BookProfile from "./components/BookProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookProvider from "./contexts/BookContenxt";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AddBook from "./components/AddBook";
import ReadList from "./components/ReadList";
function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<BookProfile />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/read-list" element={<ReadList />} />
          </Routes>
        </BrowserRouter>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
