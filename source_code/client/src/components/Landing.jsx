import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./css/Landing.css";
import programming from "../images/programming.svg";
import Signup from "./Signup";
import Login from "./Login";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

const Landing = () => {
  let [pageLoader, setPageLoader] = useState(true);

  useEffect(() => {
    const checkGuest = async () => {
      try {
        const response = await axios.get("/api/landingPage");

        if (response.data.status === "ok") {
          window.location.href = "/dashboard";
        } else {
          setPageLoader(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkGuest();
  }, []);

  return (
    <>
      {pageLoader ? (
        <div className="landingPageLoader">
          <HashLoader color={"#8a307f"} loading={pageLoader} size={80} />
        </div>
      ) : (
        <>
          <nav className="navbar navbar-expand-lg navbar-dark custom_color_navbar py-4 fixed-top">
            <div className="container">
              <NavLink className="navbar-brand nav_logo fw-bold" to="/">
                DSAShot
              </NavLink>

              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <button
                    className="btn btn-color"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item ms-lg-2 me-sm-2 mt-lg-0 mt-3">
                  <button
                    className="btn btn-color"
                    data-bs-toggle="modal"
                    data-bs-target="#signupModal"
                  >
                    Signup
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <section className="p-5 p-lg-0 pt-lg-5 text-sm-start mainSection">
            <div className="container my-5">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="text-center fw-bold">
                    SureShot&nbsp;
                    <span className="fw-bold custom_text">
                      Data Structure and Algorithm
                    </span>
                    &nbsp;Questions
                  </h1>

                  <div className="row my-5">
                    <div className="col-sm">
                      <h3 className="fw-bold">Special Thanks</h3>
                      <p className="lead">
                        Most Important and Amazing DSA Question by
                        <span className="fw-bold custom_text">
                          {" "}
                          Love Babbar
                        </span>
                      </p>
                    </div>
                    <div className="col-sm">
                      <h3 className="fw-bold">Join Community</h3>
                      <p className="lead">
                        Join our community, practice coding skills and learn
                        <span className="fw-bold custom_text">
                          Data Structures and Algorithms.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <img
                  src={programming}
                  alt="code_image"
                  className="img-fluid w-100 d-none d-sm-block"
                />
              </div>
            </div>
          </section>

          <footer className="p-2 custom_color_navbar text-white text-center position-relative">
            <div className="container">
              <p className="lead">
                Copyright &copy; {new Date().getFullYear()} DSAShot | Privacy
                Policy
              </p>
            </div>
          </footer>

          <Signup />
          <Login />
        </>
      )}
    </>
  );
};

export default Landing;
