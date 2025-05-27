import { useContext, createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// 1. Define the shape of the user data passed during sign-in
export interface UserData {
  name: string;
  email: string;
  id: number;
  role: string; // e.g., "ADMIN", "USER"
}

// 2. Define the shape of the AuthContext value
interface AuthContextType {
  userName: string | null;
  token: string;
  userId: number | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  signIn: (userData: UserData, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// 3. Create the AuthContext with a default null value
const AuthContext = createContext<AuthContextType | null>(null);

// 4. AuthProvider Component
interface AuthProviderProps {
  children: ReactNode; // Type for children prop
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State to hold user information
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Added userEmail state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState("");

  // Effect to load user data from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedId = localStorage.getItem("id");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email"); // Retrieve email from localStorage

    // Check if all necessary items are present in localStorage
    if (
      storedToken &&
      storedUsername &&
      storedId &&
      storedRole &&
      storedEmail
    ) {
      setToken(storedToken);
      setUserName(storedUsername);
      setUserId(parseInt(storedId, 10)); // Parse ID back to a number
      setUserRole(storedRole);
      setUserEmail(storedEmail); // Set email state

      setIsLoggedIn(true); // Set logged in status
      setIsAdmin(storedRole === "ADMIN"); // Set admin status based on stored role
    } else {
      // Clear any inconsistent state if localStorage items are missing
      // This ensures a clean state if only some items are present or corrupted
      setToken("");
      setUserName(null);
      setUserId(null);
      setUserRole(null);
      setUserEmail(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      // Also clear localStorage to prevent partial data issues on next load
      localStorage.clear();
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Function to handle user sign-in
  const signIn = async (
    { name, id, role, email }: UserData,
    newToken: string
  ) => {
    console.log("auth signIn", name, id, role, email, newToken);

    // Update all relevant states directly with the new values
    setUserName(name);
    setUserId(id);
    setUserRole(role);
    setUserEmail(email); // Corrected: Use the 'email' parameter
    setToken(newToken);

    // Store data in localStorage (localStorage only stores strings)
    localStorage.setItem("username", name);
    localStorage.setItem("id", id.toString()); // Convert ID to string for storage
    localStorage.setItem("role", role);
    localStorage.setItem("token", newToken);
    localStorage.setItem("email", email);
    // No need to store isLoggedIn in localStorage, derive it from token/username presence

    // Set isLoggedIn and isAdmin based on the *current* parameters passed to signIn
    setIsLoggedIn(true);
    setIsAdmin(role === "ADMIN"); // Corrected: Use the 'role' parameter directly
  };

  // Function to handle user sign-out
  const signOut = async () => {
    // Clear all states
    setUserName(null);
    setUserId(null);
    setUserRole(null);
    setUserEmail(null);
    setToken("");

    // Remove data from localStorage
    localStorage.clear(); // Clears all items to ensure complete logout

    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  // The value provided by the context
  const contextValue: AuthContextType = {
    userName,
    userId,
    isLoggedIn,
    isAdmin,
    signIn,
    signOut,
    token,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// 5. Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    // This error will be thrown if useAuth is called outside of an AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
