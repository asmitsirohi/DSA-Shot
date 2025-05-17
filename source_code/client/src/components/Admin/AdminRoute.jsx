import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

const AdminRoute = (props) => {
  const { userDetails } = useContext(GlobalContext);

  return (userDetails.isAuthenticated && userDetails.role === "admin") ||
    userDetails.role === "coadmin" ? (
    <>
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/dashboard" />
  );
};

export default AdminRoute;
