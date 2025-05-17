import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import PropagateLoader from "react-spinners/PropagateLoader";
import FadeLoader from "react-spinners/FadeLoader";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

const Booksmarks = () => {
  const [questions, setQuestions] = useState([]);
  const [pageLoader, setPageLoader] = useState(true);
  const [questionLoader, setQuestionLoader] = useState(true);
  const [solvedQuestions, setSolvedQuestions] = useState([]);

  const { userDetails } = useContext(GlobalContext);

  const history = useHistory();

  useEffect(() => {
    const getBookmarks = async () => {
      try {
        const response = await axios.get("/api/user/getBookmarkData");

        if (response.data.status === "ok") {
          setQuestions(response.data.result[0].bookmarks);
          setSolvedQuestions([response.data.solvedQues]);
          setPageLoader(false);
          setQuestionLoader(false);
        } else {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.log(error);
      }
    };

    getBookmarks();
  }, []);

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
                  <h3>Bookmark</h3>
                </div>
                <div className="col">
                  <button
                    onClick={() => history.goBack()}
                    className="float-end btn btn-color"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="my-4">
            <div className="container">
              <h3 className="mb-3">Available Bookmarks</h3>

              <div className="row ">
                <div className="col-sm-9">
                  {questionLoader ? (
                    <div className="pageLoader">
                      <FadeLoader
                        color={"#8a307f"}
                        loading={questionLoader}
                        height={15}
                        width={5}
                        radius={2}
                        margin={2}
                      />
                    </div>
                  ) : (
                    <>
                      {questions?.length > 0 ? (
                        questions.map((question, index) => {
                          return (
                            <div className="mb-4" key={index}>
                              <div className="card">
                                <div className="card-body">
                                  <h4 className="card-title">
                                    {question.question}
                                  </h4>
                                  <small className="card-subtitle text-success text-capitalize">
                                    {question.difficulty}
                                  </small>
                                  {userDetails.isAuthenticated ? (
                                    <div>
                                      <Link
                                        to={`/solvechallenge/${question.datastructure.name}/${question.datastructure._id}/${question._id}`}
                                        className="btn card-link btn-color"
                                      >
                                        Solve Challenge
                                      </Link>

                                      {solvedQuestions[0].length > 0
                                        ? solvedQuestions[0].map(
                                            (solvedQuestion, idx) => {
                                              return (
                                                <>
                                                  {solvedQuestion.question ===
                                                  question._id ? (
                                                    <button
                                                      className="btn card-link btn-success"
                                                      key={idx}
                                                      disabled
                                                    >
                                                      <i className="fas fa-check"></i>{" "}
                                                      Done
                                                    </button>
                                                  ) : null}
                                                </>
                                              );
                                            }
                                          )
                                        : null}
                                    </div>
                                  ) : (
                                    <div className="my-3">
                                      <i
                                        className="fas fa-lock"
                                        style={{
                                          fontSize: "30px",
                                          color: "#8a307f",
                                        }}
                                      ></i>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="bg-light my-4 text-center p-3 border rounded">
                          <h2 className="custom_text">No Bookmarks</h2>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="col-sm-3 d-none d-lg-block">
                  {/* <section>
                    <p className="text-muted">STATUS</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="solved"
                        onChange={handleStatus}
                        name="solved"
                      />
                      <label className="form-check-label" htmlFor="solved">
                        Solved
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="unsolved"
                        onChange={handleStatus}
                        name="unsolved"
                      />
                      <label className="form-check-label" htmlFor="unsolved">
                        Unsolved
                      </label>
                    </div>
                  </section>

                  <hr /> */}

                  {/* <section>
                    <p className="text-muted">DIFFICULTY</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="easy"
                        onChange={handleDifficulty}
                        name="easy"
                      />
                      <label className="form-check-label" htmlFor="easy">
                        Easy
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="medium"
                        onChange={handleDifficulty}
                        name="medium"
                      />
                      <label className="form-check-label" htmlFor="medium">
                        Medium
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="hard"
                        onChange={handleDifficulty}
                        name="hard"
                      />
                      <label className="form-check-label" htmlFor="hard">
                        Hard
                      </label>
                    </div>
                  </section> */}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Booksmarks;
