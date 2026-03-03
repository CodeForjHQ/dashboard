import React, { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    name: clerkUser.fullName || clerkUser.username || "",
    role: (clerkUser.publicMetadata?.role as string) || "Developer",
    avatar: clerkUser.imageUrl
  } : null;

  const login = async (_email: string, _password: string) => {
    // Logic moved to Login component using Clerk's useSignIn
  };

  const signup = async (_name: string, _email: string, _password: string) => {
    // Logic moved to Signup component using Clerk's useSignUp
  };

  const updateUser = (_updatedData: Partial<User>) => {
    // Clerk handles user updates differently (via clerkUser.update)
    console.log("updateUser called, but Clerk handles this differently");
  };

  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!clerkUser,
      isLoading: !isLoaded,
      login,
      signup,
      updateUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
