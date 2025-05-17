import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const [userDetails, setUserDetails] = useState({
    isAuthenticated: false,
    name: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [adminConsole, setAdminConsole] = useState(
    window.location.pathname.includes("admin") ? false : true
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`/api/user/checkAuth`);

        if (response.data.status === "ok") {
          setUserDetails({
            isAuthenticated: true,
            name: response.data.result.name,
            role: response.data.result.role,
          });
        } else {
          setUserDetails({ isAuthenticated: false });
        }
        setLoading(true);
      } catch (error) {
        setUserDetails({ isAuthenticated: false });
        setLoading(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      {loading && (
        <GlobalContext.Provider
          value={{
            userDetails,
            setUserDetails,
            adminConsole,
            setAdminConsole,
          }}
        >
          {props.children}
        </GlobalContext.Provider>
      )}
    </>
  );
};
