import { useContext, createContext, useState, useEffect } from "react";
import type { ReactNode } from "react"; // This is the required change

// 1. Define the shape of the user data passed during sign-in
interface UserData {
  name: string;
  id: number;
  role: string; // e.g., "admin", "user", "guest"
  token: string; // The authentication token
}

// 2. Define the shape of the AuthContext value
interface AuthContextType {
  userName: string | null;
  userId: number | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  signIn: (userData: UserData) => Promise<void>;
  signOut: () => Promise<void>;
}

// 3. Create the AuthContext with a default null value
// We'll use a non-null assertion (!) when consuming it, or check for null
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

  // Derived states for convenience
  const isLoggedIn = !!userName && !!userId; // True if userName and userId are present
  const isAdmin = userRole === "admin"; // True if role is "admin"

  // Effect to load user data from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedId = localStorage.getItem("id");
    const storedRole = localStorage.getItem("role");

    if (token && storedUsername && storedId && storedRole) {
      setUserName(storedUsername);
      setUserId(parseInt(storedId, 10)); // Parse ID back to a number
      setUserRole(storedRole);
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Function to handle user sign-in
  const signIn = async ({ name, id, role, token }: UserData) => {
    // Update state
    setUserName(name);
    setUserId(id);
    setUserRole(role);

    // Store data in localStorage (localStorage only stores strings)
    localStorage.setItem("username", name);
    localStorage.setItem("id", id.toString()); // Convert ID to string for storage
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
  };

  // Function to handle user sign-out
  const signOut = async () => {
    // Clear state
    setUserName(null);
    setUserId(null);
    setUserRole(null);

    // Remove data from localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  // The value provided by the context
  const contextValue: AuthContextType = {
    userName,
    userId,
    isLoggedIn,
    isAdmin,
    signIn,
    signOut,
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
