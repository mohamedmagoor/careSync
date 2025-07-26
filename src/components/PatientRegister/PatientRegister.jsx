import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { Blocks } from "react-loader-spinner";
import "./PatientRegister.css";

export default function PatientRegister() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submitRegister(values) {
    setIsLoading(true);
    const updatedValues = {
      ...values,
      user_type: "patient",
    };

    try {
      const { data } = await axios.post(
        `https://grackle-notable-hardly.ngrok-free.app/api/register/`,
        updatedValues
      );

      if (data.status === "User created") {
        setIsLoading(false);
        toast.success("Successfully Registered!");
        navigate("/Login");
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data.message);
    }
  }

  let validationSchema = Yup.object({
    full_name: Yup.string()
      .matches(
        /^[a-zA-Z]{3,}(?: [a-zA-Z]+){1,3}$/,
        "Name should include a first name with at least 3 letters and at least one additional name. You may include up to three additional names. Only alphabetic characters and spaces are allowed."
      )
      .required("Name is required"),
    email: Yup.string()
      .email("Email pattern is invalid")
      .required("Email is required"),
    national_id: Yup.string()
      .matches(/^\d{14}$/, "National ID must be a number.")
      .required("National id is required"),
    phone_number: Yup.string()
      .matches(
        /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/.0-9]*$/,
        "Phone is invalid"
      )
      .required("Phone is required"),
    password: Yup.string()
      .matches(
        /^[A-Za-z0-9]{9,20}/,
        "Please enter a password that is 9 to 20 characters long. The password can only contain letters (A-Z, a-z) and numbers (0-9)."
      )
      .required("Password is required")
      .min(9)
      .max(20),
    gender: Yup.string()
      .oneOf(["male", "female"], "Please choose one")
      .required("Please choose one"),
    birthday: Yup.date().required("Please enter your date of birth"),
    address: Yup.string()
      .matches(
        /^[a-zA-Z0-9\s,.'-]{5,100}$/,
        "Please enter a valid address. It should be between 5 and 100 characters long (e.g., 123 Main St., Apt 4B)"
      )
      .required("Address is required"),
    diabetes: Yup.boolean().required("Please choose one"),
    heart_disease: Yup.boolean().required("Please choose one"),
    allergies: Yup.string()
      .matches(
        /^[a-zA-Z\s,]{3,100}$/,
        "Please enter any allergies, separated by commas (e.g., peanuts, shellfish)."
      )
      .required("Allergies is required"),
    other_diseases: Yup.string()
      .matches(
        /^[a-zA-Z\s,]{3,100}$/,
        "Please enter any other diseases, separated by commas (e.g., seasonal flu, asthma)."
      )
      .required("other_diseases is required"),
  });

  let formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      national_id: "",
      phone_number: "",
      password: "",
      gender: "",
      birthday: "",
      address: "",
      diabetes: false,
      heart_disease: false,
      allergies: "",
      other_diseases: "",
    },
    validationSchema,
    onSubmit: submitRegister,
  });

  return (
    <>
      <Helmet>
        <title>Patient Registration - EasyCare</title>
        <meta name="description" content="Register as a patient on EasyCare" />
      </Helmet>
      <div className="patientRegisterWrapper">
        <div className="patientRegisterContainer">
          <h2 className="patientRegisterTitle">Patient Registration</h2>
          <form className="patientRegisterForm" onSubmit={formik.handleSubmit}>
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
                <option value="male">Male</option>
                <option value="female">Female</option>
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
            {/* Diabetes */}
            <div className="formGroup">
              <label>Diabetes</label>
              <div className="formCheck">
                <input
                  type="checkbox"
                  id="diabetes"
                  name="diabetes"
                  checked={formik.values.diabetes}
                  onChange={formik.handleChange}
                />
                <label htmlFor="diabetes">I have diabetes</label>
              </div>
              {formik.touched.diabetes && formik.errors.diabetes && (
                <div className="errorMessage">{formik.errors.diabetes}</div>
              )}
            </div>
            {/* Heart Disease */}
            <div className="formGroup">
              <label>Heart Disease</label>
              <div className="formCheck">
                <input
                  type="checkbox"
                  id="heart_disease"
                  name="heart_disease"
                  checked={formik.values.heart_disease}
                  onChange={formik.handleChange}
                />
                <label htmlFor="heart_disease">I have heart disease</label>
              </div>
              {formik.touched.heart_disease && formik.errors.heart_disease && (
                <div className="errorMessage">{formik.errors.heart_disease}</div>
              )}
            </div>
            {/* Allergies */}
            <div className="formGroup">
              <label htmlFor="allergies">Allergies</label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                className="formControl"
                value={formik.values.allergies}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="List your allergies (comma separated)"
              />
              {formik.touched.allergies && formik.errors.allergies && (
                <div className="errorMessage">{formik.errors.allergies}</div>
              )}
            </div>
            {/* Other Diseases */}
            <div className="formGroup">
              <label htmlFor="other_diseases">Other Diseases</label>
              <input
                type="text"
                id="other_diseases"
                name="other_diseases"
                className="formControl"
                value={formik.values.other_diseases}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="List other diseases (comma separated)"
              />
              {formik.touched.other_diseases && formik.errors.other_diseases && (
                <div className="errorMessage">{formik.errors.other_diseases}</div>
              )}
            </div>
            {/* Submit Button */}
            <button
              className="submitButton"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
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
            {error && <div className="errorMessage" style={{ gridColumn: '1 / -1' }}>{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
