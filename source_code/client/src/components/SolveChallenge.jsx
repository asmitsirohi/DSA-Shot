/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-monokai";
import Interweave from "interweave";

const SolveChallenge = (props) => {
  const DSId = props.match.params.DSId;
  const questionId = props.match.params.quesId;

  const [pageLoader, setPageLoader] = useState(true);
  const [process, setProcess] = useState(false);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    theme: "monokai",
    font: "18",
    language: "c_cpp",
    codeInput: "",
  });
  const [formProcess, setFormProcess] = useState(false);
  const [message, setMessage] = useState("");
  const [solutionId, setSolutionId] = useState("");
  const [caret, setCaret] = useState(false);
  const [specificQuestion, setSpecificQuestion] = useState({
    question: "",
    difficulty: "",
    link: "",
  });
  const [bookmarked, setBookmarked] = useState(false);
  const [codeOutput, setCodeOutput] = useState("");
  const [runinngCode, setRuninngCode] = useState(false);

  useEffect(() => {
    const getQuestion = async (req, res) => {
      try {
        const response = await axios.post(
          "/api/datastructure/specificQuestion",
          {
            quesId: questionId,
          }
        );

        if (response.data.status === "ok") {
          setSpecificQuestion({
            question: response.data.result.question,
            difficulty: response.data.result.difficulty,
            link: response.data.result.link,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const checkQuestion = async () => {
      try {
        const response = await axios.post(
          "/api/datastructure/checkSolveQuestion",
          {
            quesId: questionId,
            datastructureId: DSId,
          }
        );

        if (response.data.status === "ok") {
          setPageLoader(false);
          if (response.data.result) {
            setDone(true);
            setSolutionId(response.data.solutionId);
            if (response.data.answer !== undefined) {
              setFormData({ ...formData, code: response.data.answer });
            }
          }
        }
      } catch (error) {
        console.log(error);
        alert("Some error has occured, Please refresh the page.");
      }
    };

    const checkBookmark = async () => {
      try {
        const response = await axios.get("/api/user/getBookmarks");

        if (response.data.result[0].bookmarks.includes(questionId)) {
          setBookmarked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getQuestion();
    checkQuestion();
    checkBookmark();
  }, []);

  const history = useHistory();

  const markAsDone = async () => {
    setProcess(true);

    try {
      const response = await axios.post("/api/datastructure/solveQuestion", {
        question: questionId,
        datastructure: DSId,
      });

      if (response.data.status === "ok") {
        setProcess(false);
        setDone(true);
      }
    } catch (error) {
      alert("Some error has occured, Please refresh the page.");
    }
  };

  const inputEvent = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setFormProcess(true);

    const { code } = formData;

    try {
      const response = await axios.post("/api/datastructure/saveCode", {
        answer: code,
        solutionId,
        question: questionId,
        datastructure: DSId,
      });

      if (response.data.status === "ok") {
        setFormProcess(false);
        setMessage("Code Saved.");
        setDone(true);
      } else {
        setMessage("Error in saving code.");
      }
    } catch (error) {
      alert("Some error has occured, Please refresh the page.");
    }
  };

  const runCode = async () => {
    setRuninngCode(true);
    const { code, codeInput, language } = formData;
    let lang = "";

    if (language === "c_cpp") {
      lang = "cpp";
    } else if (language === "python") {
      lang = "py";
    } else {
      lang = language;
    }

    const data = JSON.stringify({
      code: code,
      language: lang,
      input: codeInput,
    });

    let config = {
      method: "post",
      url: "https://cors-anywhere-jaagrav.herokuapp.com/https://codexweb.netlify.app/.netlify/functions/enforceCode",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios(config);

      if (response.statusText === "OK") {
        setCodeOutput(response.data.output);
      }
    } catch (error) {
      setCodeOutput("Something went wrong, Please try again.");
      console.log(error);
    }

    setRuninngCode(false);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const markBookmark = async () => {
    try {
      const response = await axios.post("/api/user/addBookmark", {
        quesId: questionId,
      });

      if (response.data.status === "ok") {
        setBookmarked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeBookmark = async () => {
    try {
      const response = await axios.post("/api/user/removeBookmark", {
        quesId: questionId,
      });

      if (response.data.status === "ok") {
        setBookmarked(false);
      }
    } catch (error) {
      console.log(error);
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
                  <small className="text-secondary">Solve Challenge</small>
                  <h3>
                    {specificQuestion.question}{" "}
                    {bookmarked ? (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={removeBookmark}
                      >
                        <i className="fas fa-star text-warning"></i>
                      </span>
                    ) : (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={markBookmark}
                      >
                        <i className="far fa-star"></i>
                      </span>
                    )}
                  </h3>
                  <small className="card-subtitle text-success text-capitalize">
                    {specificQuestion.difficulty}
                  </small>
                  <div>
                    <button
                      className="btn card-link btn-color"
                      onClick={() => window.open(specificQuestion.link)}
                    >
                      View Question <i className="fas fa-external-link-alt"></i>
                    </button>
                    {process ? (
                      <button
                        className="btn card-link btn-color mt-lg-0 mt-2"
                        type="button"
                        disabled
                      >
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        &nbsp; Marking...
                      </button>
                    ) : (
                      <>
                        {done ? (
                          <button
                            className="btn card-link btn-success mt-lg-0 mt-2"
                            disabled
                          >
                            <i className="fas fa-check"></i> Done
                          </button>
                        ) : (
                          <button
                            className="btn card-link btn-color mt-lg-0 mt-2"
                            onClick={markAsDone}
                          >
                            Mark as Done
                          </button>
                        )}
                      </>
                    )}
                  </div>
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
              <h3 className="mb-3">Save Code Here</h3>

              <div className="row g-4">
                <div className="col my-3">
                  <select
                    className="form-select"
                    onChange={inputEvent}
                    name="theme"
                    value={formData.theme}
                  >
                    <option>Select Theme</option>
                    <option value="tomorrow">Light</option>
                    <option value="monokai">Dark</option>
                  </select>
                </div>
                <div className="col my-3">
                  <select
                    className="form-select"
                    onChange={inputEvent}
                    name="font"
                    value={formData.font}
                  >
                    <option>Change Font</option>
                    <option value="12">12</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                  </select>
                </div>
                <div className="col my-3">
                  <select
                    className="form-select"
                    onChange={inputEvent}
                    name="language"
                    value={formData.language}
                  >
                    <option>Change Language</option>
                    <option value="c_cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
                </div>
              </div>

              <form onSubmit={submitForm}>
                <div className="mb-3">
                  <AceEditor
                    placeholder="Code Here"
                    mode={formData.language}
                    theme={formData.theme}
                    name="code_editor"
                    onChange={(value) =>
                      setFormData({ ...formData, code: value })
                    }
                    fontSize={parseInt(formData.font)}
                    width="100%"
                    height="60vh"
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={formData.code}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 2,
                    }}
                  />
                </div>

                <div className="mb-3">
                  <p>
                    <Link
                      className="nav-link text-muted"
                      data-bs-toggle="collapse"
                      to="#collapseExample"
                      role="button"
                      onClick={() => setCaret(!caret)}
                    >
                      {caret ? (
                        <i className="fas fa-caret-down"></i>
                      ) : (
                        <i className="fas fa-caret-right"></i>
                      )}
                      &nbsp;Enter Inputs Here (If required)
                    </Link>
                  </p>
                  <div className="collapse" id="collapseExample">
                    <div className="card card-body">
                      <textarea
                        className="form-control"
                        placeholder="Enter Inputs here..."
                        rows="3"
                        name="codeInput"
                        onChange={inputEvent}
                        value={formData.codeInput}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {message.length > 0 ? (
                  <p className="text-center" style={{ color: "#8a307f" }}>
                    {message}
                  </p>
                ) : null}

                <div className="row mb-3">
                  <div className="col d-grid">
                    {runinngCode ? (
                      <button className="btn btn-info" type="button" disabled>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                        &nbsp;Running...
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={runCode}
                      >
                        Run
                      </button>
                    )}
                  </div>
                  <div className="col d-grid">
                    {formProcess ? (
                      <button
                        className="btn card-link btn-success"
                        type="button"
                        disabled
                      >
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        &nbsp; Saving...
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-success">
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </section>

          <section className="my-4">
            <div className="container">
              {codeOutput !== "" && (
                <div className="border rounded border-dark p-4">
                  <h4 className="fw-bold">Output: </h4>
                  <Interweave content={codeOutput} />
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default SolveChallenge;
