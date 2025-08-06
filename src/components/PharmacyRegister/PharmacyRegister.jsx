// // import React from 'react'
// import "./PharmacyRegister.css";
// import axios from "axios";
// import { useFormik } from "formik";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import { Blocks } from "react-loader-spinner";
// import pharmacyImage from "../../assets/images/pharmacyImage.png";
// import { Helmet } from "react-helmet";

// export default function PharmacyRegister() {
//   const [apiError, setApiError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   let navigate = useNavigate();

//   async function handelRegister(values) {
//     setLoading(true);
//     setApiError(null);
//     const updatedValues = {
//       ...values,
//       user_type: "pharmacist",
//     };
//     try {
//       const response = await axios.post(
//         "https://grackle-notable-hardly.ngrok-free.app/api/register/",
//         updatedValues
//       );
//       if (response.data.status === "User created") {
//         navigate("/login");
//       }
//     } catch (error) {
//       setApiError(error.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   let validationSchema = Yup.object({
//     full_name: Yup.string()
//       .required("Full Name is required")
//       .min(5, "Min length is 5")
//       .max(30, "Max length is 30"),
//     email: Yup.string()
//       .required("Email is required")
//       .email("Enter a valid E-mail"),
//     phone_number: Yup.string()
//       .required("Phone is required")
//       .matches(/^01[0-9]{9}$/, "Phone is not valid"),
//     password: Yup.string()
//       .required("Password is required")
//       .matches(/[A-Za-z\d]{6,12}/, "Password must be between 6-12 characters"),
//     national_id: Yup.string()
//       .required("National ID is required")
//       .matches(/^[0-9]{14}$/, "Your National ID must be 14 numbers"),
//     birthday: Yup.date()
//       .required("Birthday is required")
//       .max(new Date(), "Birthday can't be in the future"),
//     address: Yup.string()
//       .required("Address is required")
//       .min(10, "Min length is 10")
//       .max(50, "Max length is 50"),
//     pharmacy_name: Yup.string()
//       .required("Pharmacy Name is required")
//       .min(5, "Min length is 5")
//       .max(25, "Max length is 25"),
//     pharmacy_address: Yup.string()
//       .required("Pharmacy Address is required")
//       .min(5, "Min length is 5")
//       .max(50, "Max length is 50"),
//   });

//   let formik = useFormik({
//     initialValues: {
//       full_name: "",
//       email: "",
//       password: "",
//       phone_number: "",
//       national_id: "",
//       gender: "",
//       birthday: "",
//       address: "",
//       pharmacy_name: "",
//       pharmacy_address: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: handelRegister,
//   });
//   return (
//     <>
//       <Helmet>
//         <title>Pharmacy Registration - EasyCare</title>
//         <meta name="description" content="Register as a pharmacy on EasyCare" />
//       </Helmet>
//       <div className="pharmacyRegisterWrapper">
//         <div className="pharmacyRegisterContainer">
//           <h2 className="pharmacyRegisterTitle">Pharmacy Registration</h2>
//           <form className="pharmacyRegisterForm" onSubmit={formik.handleSubmit}>
//             {/* Full Name */}
//             <div className="formGroup">
//               <label htmlFor="full_name">Full Name</label>
//               <input
//                 type="text"
//                 id="full_name"
//                 name="full_name"
//                 className="formControl"
//                 value={formik.values.full_name}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter your full name"
//               />
//               {formik.touched.full_name && formik.errors.full_name && (
//                 <div className="errorMessage">{formik.errors.full_name}</div>
//               )}
//             </div>
//             {/* Email */}
//             <div className="formGroup">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 className="formControl"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter your email"
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <div className="errorMessage">{formik.errors.email}</div>
//               )}
//             </div>
//             {/* Password */}
//             <div className="formGroup">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 className="formControl"
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Create a password"
//               />
//               {formik.touched.password && formik.errors.password && (
//                 <div className="errorMessage">{formik.errors.password}</div>
//               )}
//             </div>
//             {/* National ID */}
//             <div className="formGroup">
//               <label htmlFor="national_id">National ID</label>
//               <input
//                 type="text"
//                 id="national_id"
//                 name="national_id"
//                 className="formControl"
//                 value={formik.values.national_id}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter your national ID"
//               />
//               {formik.touched.national_id && formik.errors.national_id && (
//                 <div className="errorMessage">{formik.errors.national_id}</div>
//               )}
//             </div>
//             {/* Phone Number */}
//             <div className="formGroup">
//               <label htmlFor="phone_number">Phone Number</label>
//               <input
//                 type="text"
//                 id="phone_number"
//                 name="phone_number"
//                 className="formControl"
//                 value={formik.values.phone_number}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter your phone number"
//               />
//               {formik.touched.phone_number && formik.errors.phone_number && (
//                 <div className="errorMessage">{formik.errors.phone_number}</div>
//               )}
//             </div>
//             {/* Gender */}
//             <div className="formGroup">
//               <label htmlFor="gender">Gender</label>
//               <select
//                 id="gender"
//                 name="gender"
//                 className="formSelect"
//                 value={formik.values.gender}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//               >
//                 <option value="">Select gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//               {formik.touched.gender && formik.errors.gender && (
//                 <div className="errorMessage">{formik.errors.gender}</div>
//               )}
//             </div>
//             {/* Birthday */}
//             <div className="formGroup">
//               <label htmlFor="birthday">Birthday</label>
//               <input
//                 type="date"
//                 id="birthday"
//                 name="birthday"
//                 className="formControl"
//                 value={formik.values.birthday}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//               />
//               {formik.touched.birthday && formik.errors.birthday && (
//                 <div className="errorMessage">{formik.errors.birthday}</div>
//               )}
//             </div>
//             {/* Address */}
//             <div className="formGroup">
//               <label htmlFor="address">Address</label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 className="formControl"
//                 value={formik.values.address}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter your address"
//               />
//               {formik.touched.address && formik.errors.address && (
//                 <div className="errorMessage">{formik.errors.address}</div>
//               )}
//             </div>
//             {/* Pharmacy Name */}
//             <div className="formGroup">
//               <label htmlFor="pharmacy_name">Pharmacy Name</label>
//               <input
//                 type="text"
//                 id="pharmacy_name"
//                 name="pharmacy_name"
//                 className="formControl"
//                 value={formik.values.pharmacy_name}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter your pharmacy name"
//               />
//               {formik.touched.pharmacy_name && formik.errors.pharmacy_name && (
//                 <div className="errorMessage">{formik.errors.pharmacy_name}</div>
//               )}
//             </div>
//             {/* Pharmacy Address */}
//             <div className="formGroup">
//               <label htmlFor="pharmacy_address">Pharmacy Address</label>
//               <input
//                 type="text"
//                 id="pharmacy_address"
//                 name="pharmacy_address"
//                 className="formControl"
//                 value={formik.values.pharmacy_address}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 placeholder="Enter your pharmacy address"
//               />
//               {formik.touched.pharmacy_address && formik.errors.pharmacy_address && (
//                 <div className="errorMessage">{formik.errors.pharmacy_address}</div>
//               )}
//             </div>
//             {/* Submit Button */}
//             <button
//               className="submitButton"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Blocks
//                   height="28"
//                   width="100"
//                   color="white"
//                   ariaLabel="blocks-loading"
//                   wrapperStyle={{}}
//                   wrapperClass="blocks-wrapper"
//                   visible={true}
//                 />
//               ) : (
//                 "Register"
//               )}
//             </button>
//             {/* API Error */}
//             {apiError && <div className="errorMessage" style={{ gridColumn: '1 / -1' }}>{apiError}</div>}
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

import "./PharmacyRegister.css";
import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Blocks } from "react-loader-spinner";
import pharmacyImage from "../../assets/images/pharmacyImage.png";
import { Helmet } from "react-helmet";

export default function PharmacyRegister() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [faceIdImage, setFaceIdImage] = useState(null);
  const [backIdImage, setBackIdImage] = useState(null);
  let navigate = useNavigate();

  async function handelRegister(values) {
    setLoading(true);
    setApiError(null);

    // Use FormData for file upload
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("user_type", "pharmacist");
    if (faceIdImage) formData.append("face_id_image", faceIdImage);
    if (backIdImage) formData.append("back_id_image", backIdImage);

    try {
      const response = await axios.post(
        "https://grackle-notable-hardly.ngrok-free.app/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === "User created") {
        navigate("/login");
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  let validationSchema = Yup.object({
    full_name: Yup.string()
      .required("Full Name is required")
      .min(5, "Min length is 5")
      .max(30, "Max length is 30"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid E-mail"),
    phone_number: Yup.string()
      .required("Phone is required")
      .matches(/^01[0-9]{9}$/, "Phone is not valid"),
    password: Yup.string()
      .required("Password is required")
      .matches(/[A-Za-z\d]{6,12}/, "Password must be between 6-12 characters"),
    national_id: Yup.string()
      .required("National ID is required")
      .matches(/^[0-9]{14}$/, "Your National ID must be 14 numbers"),
    birthday: Yup.date()
      .required("Birthday is required")
      .max(new Date(), "Birthday can't be in the future"),
    address: Yup.string()
      .required("Address is required")
      .min(10, "Min length is 10")
      .max(50, "Max length is 50"),
    pharmacy_name: Yup.string()
      .required("Pharmacy Name is required")
      .min(5, "Min length is 5")
      .max(25, "Max length is 25"),
    pharmacy_address: Yup.string()
      .required("Pharmacy Address is required")
      .min(5, "Min length is 5")
      .max(50, "Max length is 50"),
    // Optionally add file validation here
  });

  let formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      phone_number: "",
      national_id: "",
      gender: "",
      birthday: "",
      address: "",
      pharmacy_name: "",
      pharmacy_address: "",
    },
    validationSchema: validationSchema,
    onSubmit: handelRegister,
  });

  return (
    <>
      <Helmet>
        <title>Pharmacy Registration - EasyCare</title>
        <meta name="description" content="Register as a pharmacy on EasyCare" />
      </Helmet>
      <div className="pharmacyRegisterWrapper">
        <div className="pharmacyRegisterContainer">
          <h2 className="pharmacyRegisterTitle">Pharmacy Registration</h2>
          <form className="pharmacyRegisterForm" onSubmit={formik.handleSubmit}>
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
            {/* Pharmacy Name */}
            <div className="formGroup">
              <label htmlFor="pharmacy_name">Pharmacy Name</label>
              <input
                type="text"
                id="pharmacy_name"
                name="pharmacy_name"
                className="formControl"
                value={formik.values.pharmacy_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your pharmacy name"
              />
              {formik.touched.pharmacy_name && formik.errors.pharmacy_name && (
                <div className="errorMessage">{formik.errors.pharmacy_name}</div>
              )}
            </div>
            {/* Pharmacy Address */}
            <div className="formGroup">
              <label htmlFor="pharmacy_address">Pharmacy Address</label>
              <input
                type="text"
                id="pharmacy_address"
                name="pharmacy_address"
                className="formControl"
                value={formik.values.pharmacy_address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your pharmacy address"
              />
              {formik.touched.pharmacy_address && formik.errors.pharmacy_address && (
                <div className="errorMessage">{formik.errors.pharmacy_address}</div>
              )}
            </div>
            {/* Face ID Image */}
            <div className="formGroup">
              <label htmlFor="face_id_image">Face ID Image</label>
              <input
                type="file"
                id="face_id_image"
                name="face_id_image"
                accept="image/*"
                className="formControl"
                onChange={e => setFaceIdImage(e.currentTarget.files[0])}
              />
            </div>
            {/* Back ID Image */}
            <div className="formGroup">
              <label htmlFor="back_id_image">Back ID Image</label>
              <input
                type="file"
                id="back_id_image"
                name="back_id_image"
                accept="image/*"
                className="formControl"
                onChange={e => setBackIdImage(e.currentTarget.files[0])}
              />
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
}