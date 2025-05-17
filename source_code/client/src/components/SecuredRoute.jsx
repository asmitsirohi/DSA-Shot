import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

const SecuredRoute = (props) => {
  const { userDetails } = useContext(GlobalContext);

  return userDetails.isAuthenticated ? (
    <>
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/dashboard" />
  );
};

export default SecuredRoute;
