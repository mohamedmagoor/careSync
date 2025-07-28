import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./Otp.module.css";
import Loading from "../Loading/Loading";
import { Blocks } from "react-loader-spinner";
import { Helmet } from "react-helmet";

export default function Otp() {
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const location = useLocation();
  const email = location.state?.email;
  let navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
  }, []);

  const otpFormik = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: async (values) => {
      setIsButtonLoading(true);
      try {
        const response = await axios.post(
          "https://grackle-notable-hardly.ngrok-free.app/api/verify-otp/",
          {
            email,
            otp: values.otp,
          }
        );
        if (response.data.status === "OTP verified successfully.") {
          setIsOtpVerified(true);
          setApiMessage("OTP verified successfully.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An error occurred. Please try again.";
        setApiMessage(errorMessage);
      } finally {
        setIsButtonLoading(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      new_password: "",
    },
    onSubmit: async (values) => {
      setIsButtonLoading(true);
      try {
        const response = await axios.post(
          "https://grackle-notable-hardly.ngrok-free.app/api/set-new-password/",
          {
            email,
            otp: otpFormik.values.otp,
            new_password: values.new_password,
          }
        );
        if (response.data.status === "Password updated successfully.") {
          setApiMessage("Your password has been updated successfully.");
          navigate("/login");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An error occurred. Please try again.";
        setApiMessage(errorMessage);
      } finally {
        setIsButtonLoading(false);
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>OTP</title>
        <meta name="description" content="easy care otp page" />
      </Helmet>
      {isPageLoading ? (
        <Loading />
      ) : (
        <div className={style.wrapp}>
          <div className={style.otpWrapper}>
            <h2 className={`${style.title} `}> OTP Verification</h2>

            {/* Display the API message or error here */}
            {apiMessage && (
              <p
                className={style.apiMessage}
                style={{
                  color: apiMessage.includes("successfully") ? "green" : "red",
                }}
              >
                {apiMessage}
              </p>
            )}

            {/* OTP Form */}
            {!isOtpVerified ? (
              <form onSubmit={otpFormik.handleSubmit} className={style.form}>
                <div className={style.formGroup}>
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className={style.inputField}
                    value={otpFormik.values.otp}
                    onChange={otpFormik.handleChange}
                    placeholder="Enter the 6-digits OTP"
                    required
                  />
                </div>
                <button type="submit" className={style.submitBtn}>
                  {isButtonLoading ? (
                    <Blocks
                      height="28"
                      width="100"
                      color="white"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      visible={true}
                    />
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
            ) : (
              // New Password Form
              <form
                onSubmit={passwordFormik.handleSubmit}
                className={style.form}
              >
                <div className={style.formGroup}>
                  <label htmlFor="new_password">New Password</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    className={style.inputField}
                    value={passwordFormik.values.new_password}
                    onChange={passwordFormik.handleChange}
                    placeholder="Enter your new password"
                    required
                  />
                </div>
                <button type="submit" className={style.submitBtn}>
                  {isButtonLoading ? (
                    <Blocks
                      height="28"
                      width="100"
                      color="white"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      visible={true}
                    />
                  ) : (
                    "Set New Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
