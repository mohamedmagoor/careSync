import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Blocks } from "react-loader-spinner";
import { Helmet } from "react-helmet";
import style from "./ForgetPassword.module.css";

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiMessage(null);

      try {
        const response = await axios.post(
          "https://grackle-notable-hardly.ngrok-free.app/api/forgot-password/",
          values
        );

        if (response.status === 200) {
          setApiMessage("OTP has been sent to your email address.");
        }
      } catch (error) {
        console.error("Error:", error);
        setApiMessage("Error sending OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Forgot Password - EasyCare</title>
        <meta name="description" content="Reset your EasyCare password" />
      </Helmet>
      
      <div className={style.forgetPasswordWrapper}>
        <div className={style.forgetPasswordContainer}>
          <h2 className={style.title}>Forgot Password</h2>
          
          <p className={style.instructions}>
            Enter your email address and we'll send you a one-time password (OTP) to reset your password.
          </p>

          {apiMessage && (
            <div className={style.apiMessage}>
              {apiMessage}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className={style.form}>
            <div className={style.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={style.inputField}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email address"
                required
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger" style={{ color: 'var(--error-600)', fontSize: '0.875rem', marginTop: 'var(--spacing-xs)' }}>
                  {formik.errors.email}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className={style.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <Blocks
                  height="28"
                  width="40"
                  color="white"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  visible={true}
                />
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
