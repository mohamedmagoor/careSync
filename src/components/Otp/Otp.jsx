import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
import { Helmet } from "react-helmet";
import { userContext } from "../UserContext/UserContext";
import style from "./Otp.module.css";

export default function Otp() {
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserToken } = useContext(userContext);

  const email = location.state?.email;

  const otpFormik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "OTP must be exactly 6 characters")
        .matches(/^\d+$/, "OTP must contain only numbers")
        .required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setIsButtonLoading(true);
      setApiMessage(null);

      try {
        const response = await axios.post(
          "https://grackle-notable-hardly.ngrok-free.app/api/verify-otp/",
          {
            email: email,
            otp: values.otp,
          }
        );

        if (response.status === 200) {
          setIsOtpVerified(true);
          setApiMessage("OTP verified successfully! Please set your new password.");
        }
      } catch (error) {
        console.error("Error:", error);
        setApiMessage("Invalid OTP. Please try again.");
      } finally {
        setIsButtonLoading(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      new_password: "",
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("New password is required"),
    }),
    onSubmit: async (values) => {
      setIsButtonLoading(true);
      setApiMessage(null);

      try {
        const response = await axios.post(
          "https://grackle-notable-hardly.ngrok-free.app/api/reset-password/",
          {
            email: email,
            new_password: values.new_password,
          }
        );

        if (response.status === 200) {
          setApiMessage("Password reset successfully! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error);
        setApiMessage("Error resetting password. Please try again.");
      } finally {
        setIsButtonLoading(false);
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>OTP Verification - EasyCare</title>
        <meta name="description" content="Verify your OTP and reset password" />
      </Helmet>
      
      <div className={style.otpWrapper}>
        <div className={style.otpContainer}>
          <h2 className={style.title}>
            {!isOtpVerified ? "OTP Verification" : "Set New Password"}
          </h2>

          {apiMessage && (
            <div className={style.apiMessage}>
              {apiMessage}
            </div>
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
                  onBlur={otpFormik.handleBlur}
                  placeholder="Enter the 6-digit OTP"
                  maxLength="6"
                  required
                />
                {otpFormik.touched.otp && otpFormik.errors.otp && (
                  <div className="text-danger" style={{ color: 'var(--error-600)', fontSize: '0.875rem', marginTop: 'var(--spacing-xs)' }}>
                    {otpFormik.errors.otp}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className={style.submitBtn}
                disabled={isButtonLoading}
              >
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
            <form onSubmit={passwordFormik.handleSubmit} className={style.form}>
              <div className={style.formGroup}>
                <label htmlFor="new_password">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  className={style.inputField}
                  value={passwordFormik.values.new_password}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  placeholder="Enter your new password"
                  required
                />
                {passwordFormik.touched.new_password && passwordFormik.errors.new_password && (
                  <div className="text-danger" style={{ color: 'var(--error-600)', fontSize: '0.875rem', marginTop: 'var(--spacing-xs)' }}>
                    {passwordFormik.errors.new_password}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className={style.submitBtn}
                disabled={isButtonLoading}
              >
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
    </>
  );
}
