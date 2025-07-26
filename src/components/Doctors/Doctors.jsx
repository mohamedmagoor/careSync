import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Blocks } from "react-loader-spinner";
import "./Doctors.css";
import { Helmet } from "react-helmet";

const DoctorRegister = () => {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  async function submitRegister(values) {
    setLoading(true);
    const updatedValues = {
      ...values,
      user_type: "doctor",
    };

    try {
      const { data } = await axios.post(
        `https://grackle-notable-hardly.ngrok-free.app/api/register/`,
        updatedValues
      );

      if (data.status === "User created") {
        setLoading(false);
        navigate("/Login");
      }
    } catch (error) {
      setLoading(false);
      setApiError(error.response.data.message);
    }
  }

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      national_id: "",
      phone_number: "",
      password: "",
      gender: "",
      birthday: "",
      address: "",
      hospital: "",
      clinic: "",
      specialization: "",
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      national_id: Yup.string()
        .length(14, "National ID must be exactly 14 digits")
        .matches(/^\d+$/, "National ID must be numeric")
        .required("National ID is required"),
      phone_number: Yup.string().required("Phone Number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      gender: Yup.string().required("Gender is required"),
      birthday: Yup.date()
        .max(
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          "You must be at least 1 year old"
        )
        .required("Birthday is required")
        .nullable(),
      address: Yup.string().required("Address is required"),
      hospital: Yup.string().required("Hospital is required"),
      clinic: Yup.string().required("Clinic is required"),
      specialization: Yup.string().required("Specialization is required"),
    }),
    onSubmit: submitRegister,
  });

  return (
    <>
      <Helmet>
        <title>Doctor Registration - EasyCare</title>
        <meta name="description" content="Register as a doctor on EasyCare" />
      </Helmet>
      <div className="doctorRegisterWrapper">
        <div className="doctorRegisterContainer">
          <h2 className="doctorRegisterTitle">Doctor Registration</h2>
          <form className="doctorRegisterForm" onSubmit={formik.handleSubmit}>
            {/* Full Name */}
            <div className="formGroup">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="formControl"
                value={formik.values.full_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your full name"
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <div className="errorMessage">{formik.errors.full_name}</div>
              )}
            </div>
            {/* Email */}
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="formControl"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="errorMessage">{formik.errors.email}</div>
              )}
            </div>
            {/* National ID */}
            <div className="formGroup">
              <label htmlFor="national_id">National ID</label>
              <input
                type="text"
                id="national_id"
                name="national_id"
                className="formControl"
                value={formik.values.national_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your national ID"
              />
              {formik.touched.national_id && formik.errors.national_id && (
                <div className="errorMessage">{formik.errors.national_id}</div>
              )}
            </div>
            {/* Phone Number */}
            <div className="formGroup">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                className="formControl"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your phone number"
              />
              {formik.touched.phone_number && formik.errors.phone_number && (
                <div className="errorMessage">{formik.errors.phone_number}</div>
              )}
            </div>
            {/* Password */}
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="formControl"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Create a password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="errorMessage">{formik.errors.password}</div>
              )}
            </div>
            {/* Gender */}
            <div className="formGroup">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className="formSelect"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <div className="errorMessage">{formik.errors.gender}</div>
              )}
            </div>
            {/* Birthday */}
            <div className="formGroup">
              <label htmlFor="birthday">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                className="formControl"
                value={formik.values.birthday}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.birthday && formik.errors.birthday && (
                <div className="errorMessage">{formik.errors.birthday}</div>
              )}
            </div>
            {/* Address */}
            <div className="formGroup">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="formControl"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your address"
              />
              {formik.touched.address && formik.errors.address && (
                <div className="errorMessage">{formik.errors.address}</div>
              )}
            </div>
            {/* Hospital */}
            <div className="formGroup">
              <label htmlFor="hospital">Hospital</label>
              <input
                type="text"
                id="hospital"
                name="hospital"
                className="formControl"
                value={formik.values.hospital}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your hospital name"
              />
              {formik.touched.hospital && formik.errors.hospital && (
                <div className="errorMessage">{formik.errors.hospital}</div>
              )}
            </div>
            {/* Clinic */}
            <div className="formGroup">
              <label htmlFor="clinic">Clinic</label>
              <input
                type="text"
                id="clinic"
                name="clinic"
                className="formControl"
                value={formik.values.clinic}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your clinic name"
              />
              {formik.touched.clinic && formik.errors.clinic && (
                <div className="errorMessage">{formik.errors.clinic}</div>
              )}
            </div>
            {/* Specialization */}
            <div className="formGroup">
              <label htmlFor="specialization">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                className="formControl"
                value={formik.values.specialization}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your specialization"
              />
              {formik.touched.specialization && formik.errors.specialization && (
                <div className="errorMessage">{formik.errors.specialization}</div>
              )}
            </div>
            {/* Submit Button */}
            <button
              className="submitButton"
              type="submit"
              disabled={loading}
            >
              {loading ? (
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
                "Register"
              )}
            </button>
            {/* API Error */}
            {apiError && <div className="errorMessage" style={{ gridColumn: '1 / -1' }}>{apiError}</div>}
          </form>
        </div>
      </div>
    </>
  );
};

export default DoctorRegister;
