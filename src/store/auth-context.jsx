import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    const expirationTime = new Date(new Date().getTime() + 5 * 60 * 1000);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime.toISOString());
  };
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
    localStorage.removeItem("expirationTime");
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
