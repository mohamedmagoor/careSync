import React, { useContext, useState } from "react";
import style from "./Login.module.css"; // Custom CSS for styling
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";
import { Blocks } from "react-loader-spinner";
import { Helmet } from "react-helmet";

export default function Login() {
  let navigate = useNavigate();
  let [apiError, setError] = useState("");
  let { setUserToken } = useContext(userContext);
  let { setUserType } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(formsData) {
    setIsLoading(true);
    await axios
      .post("https://grackle-notable-hardly.ngrok-free.app/api/login/", formsData)
      .then((response) => {
        setIsLoading(false);
        localStorage.setItem("userToken", response.data.access);
        localStorage.setItem("userType", response.data.user_type);
        setUserToken(response.data.access);
        setUserType(response.data.user_type);

        response.data.user_type === "pharmacist"
          ? navigate("/pharmacistHome")
          : response.data.user_type === "doctor"
          ? navigate("/doctorProfile")
          : navigate("/patientHome");
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response.data.message);
      });
  }
  let validationSchema = Yup.object({
    national_id: Yup.string()
      .matches(/^\d{14}$/, "National ID must be a number.")
      .required("National id is required"),
    password: Yup.string()
      .matches(
        /^[A-Za-z0-9]{6,20}/,
        "Please enter a password that is 9 to 20 characters long. The password can only contain letters (A-Z, a-z) and numbers (0-9)."
      )
      .required("Password is required")
      .min(9)
      .max(20),
  });

  let formik = useFormik({
    initialValues: {
      national_id: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Easy Care Login Page" />
      </Helmet>
      <div className={style.loginWrapper}>
        <div className={style.loginContainer}>
          <h2 className={`${style.loginTitle} fade-in`}>Login</h2>

          {/* Display API Error if any */}
          {apiError && (
            <p className={`text-danger text-center ${style.errorMsg}`}>
              {apiError}
            </p>
          )}

          <form className={style.loginForm} onSubmit={formik.handleSubmit}>
            <div className={`${style.formGroup} slide-in`}>
              <label htmlFor="nationalId">National ID</label>
              <input
                type="text"
                className={style.inputField}
                id="nationalId"
                name="national_id"
                value={formik.values.national_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your National ID"
              />
              {formik.errors.national_id && formik.touched.national_id ? (
                <div className="text-danger font-bold mt-2 p-2">
                  {formik.errors.national_id}
                </div>
              ) : (
                ""
              )}
            </div>

            <div className={`${style.formGroup} slide-in`}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={style.inputField}
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your Password"
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="text-danger font-bold mt-2 p-2">
                  {formik.errors.password}
                </div>
              ) : (
                ""
              )}
            </div>

            <div className={`${style.formActions} fade-in`}>
              {/* Forgot Password Link */}
              <NavLink
                to={"/forgotPassword"}
                className={style.forgotPasswordLink}
              >
                Forgot Password?
              </NavLink>

              {isLoading ? (
                <button
                  type="button"
                  className="btn myBtn fw-bold mt-3 px-4 py-2"
                >
                  <Blocks
                    height="28"
                    width="40"
                    color="white"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    visible={true}
                  />
                </button>
              ) : (
                <button
                  disabled={!(formik.isValid && formik.dirty)}
                  type="submit"
                  className="btn myBtn fw-bold mt-3 px-3 py-2"
                >
                  Login
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
