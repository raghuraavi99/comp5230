import { createContext } from "react";

export const AuthContext = createContext({
  displayName: "",
  token: "",
  setToken: (arg) => {},
  setDisplayName: (arg) => {},
});
