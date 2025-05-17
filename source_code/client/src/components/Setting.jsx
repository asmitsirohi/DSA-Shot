import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import NumberCounter from "number-counter";

const Setting = () => {
  document.title = "Setting";
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    authId: "",
    oldPassword: "",
    newPassword: "",
  });
  const [userProcess, setUserProcess] = useState(false);
  const [changePasswordProcess, setChangePasswordProcess] = useState(false);
  const [counter, setCounter] = useState({
    solved: -1,
  });

  const alert = useAlert();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get("/api/user/getUserData");

        if (response.data.status === "ok") {
          setUserData({
            name: response.data.result.name,
            email: response.data.result.email,
            authId: response.data.result.authId,
            oldPassword: "",
            newPassword: "",
          });
        } else {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getDocumentCount = async () => {
      try {
        const response = await axios.get("/api/user/documentCounter");

        if (response.data.status === "ok") {
          setCounter({
            solved: response.data.result,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserDetails();
    getDocumentCount();
  }, []);

  const inputEvent = (e) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };

  const submitUserDetails = async (e) => {
    e.preventDefault();

    setUserProcess(true);

    const { name } = userData;

    try {
      const response = await axios.post("/api/user/updateUser", {
        name,
      });

      if (response.data.status === "ok") {
        alert.success("Profile Updated");
      }
    } catch (error) {
      console.log(error);
    }

    setUserProcess(false);
  };

  const changePasswordForm = async (e) => {
    e.preventDefault();
    setChangePasswordProcess(true);

    const { oldPassword, newPassword } = userData;

    try {
      const response = await axios.post("/api/user/changePassword", {
        oldPassword,
        newPassword,
      });

      if (response.data.status === "ok") {
        alert.success("Password Changed");

        setUserData({ ...userData, newPassword: "", oldPassword: "" });
      } else {
        alert.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }

    setChangePasswordProcess(false);
  };

  return (
    <>
      <section className="bg-light pt-3 pb-2">
        <div className="container">
          <div className="row">
            <div className="col">
              <small className="text-secondary">Update</small>
              <h3>Setting</h3>
            </div>
            <div className="col">
              {/* <Link to="" className="float-end">
                Booksmarks
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      <section className="my-4">
        <div className="container">
          <form onSubmit={submitUserDetails}>
            <div className="row">
              <div className="col-sm-5">
                <div className="mb-3">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={inputEvent}
                    value={userData.name}
                    placeholder="Name"
                    name="name"
                  />
                </div>
              </div>
              <div className="col-sm-5">
                <div className="mb-3">
                  <label htmlFor="name">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={inputEvent}
                    value={userData.email}
                    placeholder="Email"
                    name="email"
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div className="mt-4 d-grid">
                  {userProcess ? (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {userData.authId === undefined && (
        <section className="my-4">
          <div className="container">
            <form onSubmit={changePasswordForm}>
              <div className="row">
                <div className="col-sm-5">
                  <div className="mb-3">
                    <label htmlFor="oldPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="oldPassword"
                      onChange={inputEvent}
                      value={userData.oldPassword}
                      placeholder="Current Password"
                      name="oldPassword"
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      onChange={inputEvent}
                      value={userData.newPassword}
                      placeholder="New Password"
                      name="newPassword"
                      required
                    />
                  </div>
                </div>

                <div className="col-sm-2 pt-2">
                  <div className="mt-4 d-grid">
                    {changePasswordProcess ? (
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled
                      >
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Changing...
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Change Password
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      )}

      <section className="my-4">
        <div className="container">
          <h1>Statistics</h1>
          <div className="row mt-4 gy-4 text-center custom_text">
            <div className="col-sm-4">
              <h1>
                {counter.solved !== -1 && (
                  <NumberCounter end={counter.solved} delay={3} />
                )}
              </h1>
              <h3>Solved Questions</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Setting;
