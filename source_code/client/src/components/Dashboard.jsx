import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DataStructure from "./DataStructure";
import { GlobalContext } from "../context/GlobalState";

const Dashboard = () => {
  const { userDetails } = useContext(GlobalContext);

  return (
    <>
      <section className="bg-light pt-3 pb-2">
        <div className="container">
          <div className="row">
            <div className="col">
              <small className="text-secondary">Practice</small>
              <h3>Dashboard</h3>
            </div>
            <div className="col">
              {userDetails.isAuthenticated && (
                <Link to="/bookmarks" className="float-end">
                  Booksmarks
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="my-4">
        <div className="container">
          <h3 className="mb-3">Data Structures Available For Practice</h3>

          <DataStructure />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
