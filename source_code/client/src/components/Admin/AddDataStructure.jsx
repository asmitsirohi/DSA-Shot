import axios from "axios";
import React, { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const AddDataStructure = () => {
  const [pageLoader, setPageLoader] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [processBtn, setProcessBtn] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get("/api/admin/adddatastructure");

        if (response.data.status === "error") {
          window.location.href = "/dashboard";
        }

        setPageLoader(false);
      } catch (error) {
        console.log(error);
        alert("Some error has occured, Please refresh the page.");
      }
    };

    authenticateUser();
  }, []);

  const inputEvent = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const { name } = formData;

    setProcessBtn(true);

    try {
      const response = await axios.post("/api/admin/adddatastructure", {
        name,
      });

      if (response.data.status === "ok") {
        setMessage("Record Inserted");
        setFormData({ ...formData, name: "" });
      } else {
        setMessage("Something Went Wrong.");
      }

      setProcessBtn(false);
    } catch (error) {
      console.log(error);
      alert("Some error has occured, Please refresh the page.");
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
                  <small className="text-secondary">Data Structure</small>
                  <h3>Add Data Structure</h3>
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
              <form onSubmit={submitForm}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Data Structure:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    required
                    onChange={inputEvent}
                    value={formData.name}
                    placeholder="Data Structure Name"
                  />
                </div>

                {message.length > 0 ? (
                  <p className="text-center" style={{ color: "#8a307f" }}>
                    {message}
                  </p>
                ) : null}

                <div className="d-grid">
                  {processBtn ? (
                    <button
                      className="btn btn-anotherColor"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                      &nbsp;Processing...
                    </button>
                  ) : (
                    <button
                      className="btn btn-anotherColor fw-bold"
                      type="submit"
                    >
                      Add Data Strucuture
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AddDataStructure;
