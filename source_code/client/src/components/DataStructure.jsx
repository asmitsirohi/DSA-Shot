import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import { GlobalContext } from "../context/GlobalState";

const DataStructure = () => {
  const [dataStructureLoader, setDataStructureLoader] = useState(true);
  const [dataStructures, setDataStructures] = useState([]);
  const [trackProgress, setTrackProgress] = useState();
  const { userDetails } = useContext(GlobalContext);

  useEffect(() => {
    const getDataStructure = async () => {
      try {
        const response = await axios.get("/api/datastructure/datastructures");

        if (response.data.status === "error") {
          alert("Some error has occured, Please refresh the page.");
        } else {
          setDataStructures([response.data.result]);
          setDataStructureLoader(false);
        }
      } catch (error) {
        alert("Some error has occured, Please refresh the page.");
      }
    };

    const trackProgress = async () => {
      try {
        const response = await axios.get("/api/trackProgress");
        if (response.data.status === "ok") {
          setTrackProgress(response.data.progress);
        }
        getDataStructure();
      } catch (error) {
        alert("Some error has occured, Please refresh the page.");
      }
    };

    trackProgress();
  }, []);

  return (
    <>
      {dataStructureLoader ? (
        <div className="pageLoader">
          <FadeLoader
            color={"#8a307f"}
            loading={dataStructureLoader}
            height={15}
            width={5}
            radius={2}
            margin={2}
          />
        </div>
      ) : (
        <div className="row g-4">
          {dataStructures.length > 0 &&
            dataStructures[0].map((dataStructure, index) => {
              const uniqueName = dataStructure.name;

              return (
                <div className="col-sm-4" key={dataStructure._id}>
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title text-center fw-bold">
                        {dataStructure.name}
                      </h3>

                      {userDetails.isAuthenticated ? (
                        <div className="progress my-4">
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated progress_color"
                            role="progressbar"
                            style={{ width: `${trackProgress[uniqueName]}%` }}
                            aria-valuenow="10"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {trackProgress[uniqueName] === "NaN"
                              ? 0
                              : trackProgress[uniqueName]}
                            %
                          </div>
                        </div>
                      ) : (
                        <div className="text-center my-3">
                          <i
                            className="fas fa-lock"
                            style={{ fontSize: "30px", color: "#8a307f" }}
                          ></i>
                        </div>
                      )}

                      <div className="d-grid">
                        <Link
                          to={`/questions/${dataStructure.name}/${dataStructure._id}`}
                          className="btn btn-color"
                        >
                          {userDetails.isAuthenticated ? (
                            <span>Solve</span>
                          ) : (
                            <span>View</span>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default DataStructure;
