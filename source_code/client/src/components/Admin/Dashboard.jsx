import axios from "axios";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
import NumberCounter from "number-counter";

const Dashboard = () => {
  const [pageLoader, setPageLoader] = useState(true);
  const [counter, setCounter] = useState({
    users: "",
    dataStructures: "",
    questions: "",
  });

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard");

        if (response.data.status === "error") {
          window.location.href = "/dashboard";
        } else {
          setCounter({
            users: response.data.usersCount,
            dataStructures: response.data.dataStructuresCount,
            questions: response.data.questionsCount,
          });
        }
        setPageLoader(false);
      } catch (error) {
        console.log(error);
      }
    };

    authenticateUser();
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
                  <small className="text-secondary">DSA-Shot</small>
                  <h3>Dashboard</h3>
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
              <div className="row gy-4 text-center custom_text">
                <div className="col-sm-4">
                  <h1>
                    <NumberCounter end={counter.users} delay={3} />
                  </h1>
                  <h3>Users</h3>
                </div>
                <div className="col-sm-4">
                  <h1>
                    <NumberCounter end={counter.dataStructures} delay={3} />
                  </h1>
                  <h3>Data Structures</h3>
                </div>
                <div className="col-sm-4">
                  <h1>
                    <NumberCounter end={counter.questions} delay={3} />
                  </h1>
                  <h3>Questions</h3>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Dashboard;
