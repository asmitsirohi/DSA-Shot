import axios from "axios";
import React, { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const AddQuestions = () => {
  const [pageLoader, setPageLoader] = useState(true);
  const [dataStructures, setDataStructures] = useState([]);
  const [formData, setFormData] = useState({
    dataStructure: "",
    question: "",
    difficulty: "",
    link: "",
  });
  const [processBtn, setProcessBtn] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get("/api/admin/addquestion");

        if (response.data.status === "error") {
          window.location.href = "/dashboard";
        } else {
          setDataStructures([response.data.result]);
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

    const { dataStructure, question, difficulty, link } = formData;

    setProcessBtn(true);

    try {
      const response = await axios.post("/api/admin/addquestion", {
        dataStructure,
        question,
        difficulty,
        link,
      });

      if (response.data.status === "ok") {
        setMessage("Record Inserted");
        setFormData({ ...formData, question: "", link: "" });
      } else if (response.data.status === "already_exists") {
        setMessage("Question Already exists.");
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
                  <small className="text-secondary">Questions</small>
                  <h3>Add Questions</h3>
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
                  <label htmlFor="dataStructure" className="form-label">
                    Data Structure:
                  </label>
                  <select
                    className="form-select"
                    id="dataStructure"
                    name="dataStructure"
                    onChange={inputEvent}
                    value={formData.dataStructure}
                    required
                  >
                    <option value="">Select Data Structure</option>
                    {dataStructures.length > 0 &&
                      dataStructures[0].map((dataStructure) => {
                        return (
                          <option
                            value={dataStructure._id}
                            key={dataStructure._id}
                          >
                            {dataStructure.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="question" className="form-label">
                    Question:
                  </label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="2"
                    placeholder="Enter question here..."
                    name="question"
                    onChange={inputEvent}
                    value={formData.question}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="difficulty" className="form-label">
                    Difficulty:
                  </label>
                  <select
                    className="form-select"
                    id="difficulty"
                    name="difficulty"
                    onChange={inputEvent}
                    value={formData.difficulty}
                    required
                  >
                    <option value="">Select Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="link" className="form-label">
                    Link:
                  </label>
                  <textarea
                    className="form-control"
                    id="link"
                    rows="1"
                    placeholder="Enter link here..."
                    name="link"
                    onChange={inputEvent}
                    value={formData.link}
                    required
                  ></textarea>
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
                      Add Question
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

export default AddQuestions;
