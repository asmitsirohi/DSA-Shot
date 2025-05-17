import axios from "axios";
import React, { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";

const Roles = () => {
  const [pageLoader, setPageLoader] = useState(true);
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [deleteProcess, setDeleteProcess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get("/api/admin/roles");

        if (response.data.status === "error") {
          window.location.href = "/dashboard";
        } else {
          setUsers([response.data.result]);
        }

        setPageLoader(false);
      } catch (error) {
        window.location.href = "/dashboard";
      }
    };

    authenticateUser();
  }, []);

  const changeRole = async (e) => {
    const { value } = e.target;

    let data = value.split("?");

    try {
      const response = await axios.post("/api/admin/roles", {
        userId: data[1],
        roleName: data[0],
      });

      if (response.data.status === "error") {
        alert("Something went wrong, Please try after sometime.");
      }
    } catch (error) {
      alert("Some error has occured, Please refresh the page.");
    }
  };

  const deleteModalFunc = (id) => {
    setMessage("");
    setDeleteId(id);
    const myModal = new Modal(document.getElementById("deleteModal"));
    myModal.toggle();
  };

  const deleteUser = async () => {
    setDeleteProcess(true);

    try {
      const response = await axios.post("/api/admin/deleteuser", {
        id: deleteId,
      });

      if (response.data.status === "ok") {
        setMessage("Record Deleted");
        const updatedUsers = users[0].filter((user) => {
          return user._id !== deleteId;
        });

        setUsers([updatedUsers]);
        setDeleteId("");
      } else {
        setMessage("Nothing to delete");
      }

      setDeleteProcess(false);
    } catch (error) {
      alert("Some error has occured, Please try again.");
    }
  };

  return (
    <>
      {pageLoader ? (
        <div className="pageLoader">
          <PropagateLoader color={"#8a307f"} loading={pageLoader} size={15} />
        </div>
      ) : (
        <>
          <section className="bg-light pt-3 pb-2">
            <div className="container">
              <div className="row">
                <div className="col">
                  <small className="text-secondary">User</small>
                  <h3>Assign Roles</h3>
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
              <table className="table table-light table-striped">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Login Method</th>
                    <th scope="col">Roles</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {users[0].length > 0 ? (
                    users[0].map((user, index) => {
                      return (
                        <tr key={user._id}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.name}</td>
                          <td>{user.loginMethod}</td>
                          <td>
                            {user.role === "admin" ? (
                              user.role === "coadmin" ? (
                                <select
                                  className="form-select"
                                  name={`role${user._id}`}
                                  onChange={changeRole}
                                >
                                  <option value={`admin?${user._id}`}>
                                    Admin
                                  </option>
                                  <option
                                    defaultValue={`coadmin?${user._id}`}
                                    selected
                                  >
                                    Co-admin
                                  </option>
                                  <option value={`user?${user._id}`}>
                                    User
                                  </option>
                                </select>
                              ) : (
                                <select
                                  className="form-select"
                                  name={`role${user._id}`}
                                  onChange={changeRole}
                                >
                                  <option
                                    defaultValue={`admin?${user._id}`}
                                    selected
                                  >
                                    Admin
                                  </option>
                                  <option value={`coadmin?${user._id}`}>
                                    Co-admin
                                  </option>
                                  <option value={`user?${user._id}`}>
                                    User
                                  </option>
                                </select>
                              )
                            ) : user.role === "coadmin" ? (
                              <select
                                className="form-select"
                                name={`role${user._id}`}
                                onChange={changeRole}
                              >
                                <option value={`admin?${user._id}`}>
                                  Admin
                                </option>
                                <option
                                  defaultValue={`coadmin?${user._id}`}
                                  selected
                                >
                                  Co-admin
                                </option>
                                <option value={`user?${user._id}`}>User</option>
                              </select>
                            ) : (
                              <select
                                className="form-select"
                                name={`role${user._id}`}
                                onChange={changeRole}
                              >
                                <option value={`admin?${user._id}`}>
                                  Admin
                                </option>
                                <option value={`coadmin?${user._id}`}>
                                  Co-admin
                                </option>
                                <option
                                  defaultValue={`user?${user._id}`}
                                  selected
                                >
                                  User
                                </option>
                              </select>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteModalFunc(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <h4 className="text-center my-3">No Data to show</h4>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Delete Modal */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger" id="deleteModalLabel">
                Delete User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Do you want to delete this User?</div>

            {message.length > 0 ? (
              <p className="custom_text text-center">{message}</p>
            ) : null}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                No
              </button>
              {deleteProcess ? (
                <button className="btn btn-success" type="button" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  &nbsp;Deleteing...
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={deleteUser}
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Roles;
