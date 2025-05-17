import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import axios from "axios";
import { GlobalContext } from "../context/GlobalState";

const Navbar = () => {
  const { userDetails, setUserDetails, adminConsole, setAdminConsole } =
    useContext(GlobalContext);

  const logout = async () => {
    try {
      const response = await axios.get("/api/user/logout");

      if (response.data.status === "ok") {
        setUserDetails({
          isAuthenticated: false,
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark custom_color_navbar p-3 fixed-top">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="#">
            DSAShot
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {!adminConsole ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/admin/dashboard"
                  >
                    Home
                  </NavLink>
                </li>
                {userDetails?.role === "admin" && (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Users
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-dark">
                      <li>
                        <Link className="dropdown-item" to="/admin/roles">
                          Roles
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Data Structures
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin/adddatastructure"
                      >
                        Add Data Structures
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin/managedatastructure"
                      >
                        Manage Data Structures
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Questions
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link className="dropdown-item" to="/admin/addquestions">
                        Add Questions
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin/managequestions"
                      >
                        Manage Questions
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/dashboard"
                  >
                    Home
                  </NavLink>
                </li>
                {/* <li className="nav-item">
                  <NavLink className="nav-link" to="/about">
                    About
                  </NavLink>
                </li> */}
              </ul>
            )}

            {userDetails.isAuthenticated ? (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {userDetails?.role === "admin" ||
                userDetails?.role === "coadmin" ? (
                  <>
                    {adminConsole ? (
                      <Link
                        to="/admin/dashboard"
                        className="btn btn-color me-4"
                        onClick={() => setAdminConsole(false)}
                      >
                        Admin Console
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="btn btn-color me-4"
                        onClick={() => setAdminConsole(true)}
                      >
                        User Console
                      </Link>
                    )}
                  </>
                ) : null}

                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle active"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {userDetails.name}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link className="dropdown-item" to="/setting">
                        <i className="fas fa-user-cog"></i> Setting
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#" onClick={logout}>
                        <i className="fas fa-power-off"></i> Logout
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item mb-3 mb-lg-0 d-grid">
                  <button
                    className="btn btn-color"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item ms-lg-2 me-sm-2  d-grid">
                  <button
                    className="btn btn-color"
                    data-bs-toggle="modal"
                    data-bs-target="#signupModal"
                  >
                    Signup
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <Signup />
      <Login />
    </>
  );
};

export default Navbar;
