import { AuthProvider } from "./contexts/AuthContext";
import BookList from "./components/BookList";
import BookProfile from "./components/BookProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookProvider from "./contexts/BookContenxt";
function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<BookProfile />} />
          </Routes>
        </BrowserRouter>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
