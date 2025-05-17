import React, { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";
import axios from "axios";
import { useAlert } from "react-alert";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { TableHead } from "@material-ui/core";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

const ManageQuestions = () => {
  const [pageLoader, setPageLoader] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [process, setProcess] = useState(false);
  const [editData, setEditData] = useState({
    editId: "",
    question: "",
    datastructureId: "",
    difficulty: "",
    link: "",
  });
  const [dataStructures, setDataStructures] = useState([]);

  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getQuestions = async () => {
    try {
      const response = await axios.get("/api/admin/managequestions");

      if (response.data.status === "error") {
        window.location.href = "/dashboard";
      } else {
        setQuestions([response.data.result]);
      }

      setPageLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getDataStructures = async () => {
      try {
        const response = await axios.get("/api/admin/addquestion");

        if (response.data.status === "error") {
          window.location.href = "/dashboard";
        } else {
          setDataStructures([response.data.result]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getQuestions();
    getDataStructures();
  }, []);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, questions[0]?.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const alert = useAlert();

  const deleteModalFunc = (id) => {
    setDeleteId(id);
    const myModal = new Modal(document.getElementById("deleteModal"));
    myModal.toggle();
  };

  const deleteQuestion = async () => {
    setProcess(true);

    try {
      const response = await axios.post("/api/admin/deletequestion", {
        id: deleteId,
      });

      if (response.data.status === "ok") {
        const updatedQuestions = questions[0].filter(
          (question) => question._id !== deleteId
        );

        setQuestions([updatedQuestions]);

        alert.success("Question Deleted.");
      }
    } catch (error) {
      alert.error("Something went wrong.");
    }

    setProcess(false);
  };

  const editModalFunc = (question) => {
    setEditData({
      editId: question._id,
      question: question.question,
      datastructureId: question.datastructure._id,
      difficulty: question.difficulty,
      link: question.link,
    });

    const myModal = new Modal(document.getElementById("editModal"));
    myModal.toggle();
  };

  const inputEvent = (e) => {
    const { name, value } = e.target;

    setEditData({ ...editData, [name]: value });
  };

  const editQuestionForm = async (e) => {
    e.preventDefault();

    setProcess(true);

    try {
      const response = await axios.post("/api/admin/editquestion", {
        editId: editData.editId,
        question: editData.question,
        datastructureId: editData.datastructureId,
        difficulty: editData.difficulty,
        link: editData.link,
      });

      if (response.data.status === "ok") {
        getQuestions();
        alert.success("Question Edited.");
      }
    } catch (error) {
      alert.error("Something went wrong");
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
                  <small className="text-secondary">Questions</small>
                  <h3>Manage Questions</h3>
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
              <TableContainer component={Paper} className="tableFont">
                <Table
                  className={classes.table}
                  // stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" align="center">
                        S.No
                      </TableCell>
                      <TableCell component="th" align="center">
                        Question
                      </TableCell>
                      <TableCell component="th" align="center">
                        DataStructure
                      </TableCell>
                      <TableCell component="th" align="center">
                        Difficulty
                      </TableCell>
                      <TableCell component="th" align="center">
                        Link
                      </TableCell>
                      <TableCell component="th" align="center">
                        Edit
                      </TableCell>
                      <TableCell component="th" align="center">
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? questions[0].slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : questions[0]
                    ).map((question, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          {question.question}
                        </TableCell>
                        <TableCell align="center">
                          {question.datastructure?.name}
                        </TableCell>
                        <TableCell align="center">
                          {question.difficulty}
                        </TableCell>
                        <TableCell align="center">{question.link}</TableCell>
                        <TableCell align="center">
                          <button
                            className="btn btn-outline-info btn-sm"
                            onClick={() => editModalFunc(question)}
                          >
                            Edit
                          </button>
                        </TableCell>
                        <TableCell align="center">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteModalFunc(question._id)}
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[
                          10,
                          20,
                          30,
                          { label: "All", value: -1 },
                        ]}
                        colSpan={8}
                        count={questions[0].length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: { "aria-label": "rows per page" },
                          native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
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
                Delete Question
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Do you want to delete this Question?
            </div>

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
                onClick={deleteQuestion}
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
                Edit Question
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={editQuestionForm}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="dataStructure" className="form-label">
                    Data Structure:
                  </label>
                  <select
                    className="form-select"
                    id="dataStructure"
                    name="dataStructure"
                    onChange={inputEvent}
                    value={editData.datastructureId}
                    required
                  >
                    <option defaultValue="">Select Data Structure</option>
                    {dataStructures.length > 0 &&
                      dataStructures[0].map((dataStructure) => (
                        <option
                          value={dataStructure._id}
                          key={dataStructure._id}
                        >
                          {dataStructure.name}
                        </option>
                      ))}
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
                    value={editData.question}
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
                    value={editData.difficulty}
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
                    rows="2"
                    placeholder="Enter link here..."
                    name="link"
                    onChange={inputEvent}
                    value={editData.link}
                    required
                  ></textarea>
                </div>
              </div>

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
                  onClick={editQuestionForm}
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

export default ManageQuestions;
