import axios from "axios";
import React, { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";
import { useAlert } from "react-alert";

const ManageDataStructure = () => {
  const [pageLoader, setPageLoader] = useState(true);
  const [dataStructures, setDataStructures] = useState([]);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [editData, setEditData] = useState({
    editId: "",
    datastructure: "",
  });
  const [process, setProcess] = useState(false);

  const alert = useAlert();

  const getDataStructures = async () => {
    try {
      const response = await axios.get("/api/admin/managedatastructure");

      if (response.data.status === "error") {
        window.location.href = "/dashboard";
      } else {
        setDataStructures([response.data.result]);
      }

      setPageLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataStructures();
  }, []);

  const deleteModalFunc = (id) => {
    setMessage("");
    setDeleteId(id);
    const myModal = new Modal(document.getElementById("deleteModal"));
    myModal.toggle();
  };

  const deleteDataStructure = async () => {
    setProcess(true);

    try {
      const response = await axios.post("/api/admin/deletedatastructure", {
        id: deleteId,
      });

      if (response.data.status === "ok") {
        const updatedDataStructures = dataStructures[0].filter(
          (dataStructure) => {
            return dataStructure._id !== deleteId;
          }
        );

        setDataStructures([updatedDataStructures]);
        setDeleteId("");
        alert.success("Data Structure Deleted.");
      }
    } catch (error) {
      alert.error("Something went wrong.");
    }

    setProcess(false);
  };

  const editModalFunc = (dataStructure) => {
    setEditData({
      editId: dataStructure._id,
      datastructure: dataStructure.name,
    });

    const myModal = new Modal(document.getElementById("editModal"));
    myModal.toggle();
  };

  const inputEvent = (e) => {
    const { name, value } = e.target;

    setEditData({ ...editData, [name]: value });
  };

  const editDataStructure = async (e) => {
    e.preventDefault();

    setProcess(true);

    try {
      const response = await axios.post("/api/admin/editdatastructure", {
        id: editData.editId,
        dataStructure: editData.datastructure,
      });

      if (response.data.status === "ok") {
        getDataStructures();

        alert.success("Data Strucuture Updated.");
      }
    } catch (error) {
      alert.error("Something went wrong.");
    }

    setProcess(false);
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
                  <small className="text-secondary">Data Structure</small>
                  <h3>Manage Data Structures</h3>
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
            {process && (
              <div className="text-center my-3" style={{ color: "#8a307f" }}>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="container">
              <table className="table table-light table-striped">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {dataStructures.length > 0 ? (
                    dataStructures[0].map((dataStructure, index) => {
                      return (
                        <tr key={dataStructure._id}>
                          <th scope="row">{index + 1}</th>
                          <td>{dataStructure.name}</td>
                          <td>
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => editModalFunc(dataStructure)}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteModalFunc(dataStructure._id)}
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
                Delete Data Structure
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Do you want to delete this Data Structure?
            </div>

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
              <button
                type="button"
                className="btn btn-success"
                onClick={deleteDataStructure}
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}

      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger" id="editModalLabel">
                Edit Data Structure
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={editDataStructure}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Data Structure:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="datastructure"
                    required
                    onChange={inputEvent}
                    value={editData.datastructure}
                    placeholder="Data Structure Name"
                  />
                </div>
              </div>

              {message.length > 0 ? (
                <p className="custom_text text-center">{message}</p>
              ) : null}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={editDataStructure}
                  data-bs-dismiss="modal"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageDataStructure;
