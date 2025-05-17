import axios from "axios";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";

const About = () => {
  let [pageLoader, setPageLoader] = useState(true);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get("/api/dashboard");

        if (response.data.status === "ok") {
        }
        setPageLoader(false);
      } catch (error) {
        window.location.href = "/";
      }
    };

    authenticateUser();
  }, []);

  return (
    <>
      {pageLoader ? (
        <div className="pageLoader">
          <PropagateLoader color={"#8a307f"} loading={pageLoader} size={15} />
        </div>
      ) : (
        <h1>Hello from about</h1>
      )}
    </>
  );
};

export default About;
