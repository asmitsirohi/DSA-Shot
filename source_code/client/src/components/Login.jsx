import React, { useState } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    reCaptcha: "",
  });
  const [message, setMessage] = useState("");
  const [processSpinner, setProcessSpinner] = useState(true);

  const inputEvent = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const onChange = (value) => {
    setFormData({ ...formData, reCaptcha: value });
  };

  let captcha;

  const setCaptchaRef = (ref) => {
    if (ref) {
      return (captcha = ref);
    }
  };

  const resetCaptcha = () => {
    captcha.reset();
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setProcessSpinner(false);

    try {
      const { email, password, reCaptcha } = formData;

      const response = await axios.post("/api/user/login", {
        email,
        password,
        reCaptcha,
      });

      if (response.data.status === "ok") {
        window.location.href = "/dashboard";
      } else {
        if (response.data.error === "invalid") {
          setMessage("User not found.");
        } else if (response.data.error === "invalid_captcha") {
          setMessage("Please, Check Captcha.");
        } else {
          setMessage("Something went wrong, Please try after sometime.");
        }
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong, Please try after sometime.");
    }

    resetCaptcha();
    setProcessSpinner(true);
  };

  const connectStyle = {
    fontSize: "50px",
    color: "#8a307f",
  };
  return (
    <>
      <div
        className="modal fade"
        id="loginModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Login
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={submitForm}>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    onChange={inputEvent}
                    value={formData.email}
                    required
                  />
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    onChange={inputEvent}
                    value={formData.password}
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <ReCAPTCHA
                    ref={(r) => setCaptchaRef(r)}
                    sitekey="6LetgUUcAAAAANJ98n3giYLLvEhZFs-vbq7o3PPe"
                    onChange={onChange}
                    theme="light"
                  />
                </div>
              </div>

              {message.length > 0 ? (
                <p className="text-center" style={{ color: "#8a307f" }}>
                  {message}
                </p>
              ) : null}

              <div className="modal-body row">
                <div className="col d-grid">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
                <div className="col d-grid">
                  {processSpinner ? (
                    <button type="submit" className="btn btn-outline-primary">
                      Login
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </button>
                  )}
                </div>
              </div>
            </form>
            <div className="model-body row text-center mt-2">
              <div className="col">
                <hr />
              </div>
              <div className="col">or Connect with</div>
              <div className="col">
                <hr />
              </div>
            </div>
            <div className="model-body row text-center my-3">
              <div className="col">
                <a href="/auth/facebook">
                  <i className="fab fa-facebook" style={connectStyle}></i>
                </a>
              </div>
              <div className="col">
                <a href="/auth/google">
                  <i className="fab fa-google" style={connectStyle}></i>
                </a>
              </div>
              <div className="col">
                <a href="/auth/github">
                  <i className="fab fa-github" style={connectStyle}></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
