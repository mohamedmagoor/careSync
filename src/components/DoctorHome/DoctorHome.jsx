import React, { useState, useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { userContext } from "../UserContext/UserContext";
import { Blocks } from "react-loader-spinner";
import { Helmet } from "react-helmet";

export default function DoctorHome() {
  const { t } = useTranslation();
  const { userToken } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);
  const [apiError, setApiError] = useState(null);

  const validationSchema = Yup.object({
    patient_id: Yup.string()
      .length(14, t("patientIdLength", "Patient ID must be exactly 14 characters"))
      .required(t("patientIdRequired", "Patient ID is required")),
    medicine_name: Yup.string().required(t("medicineNameRequired", "Medicine name is required")),
    dosage: Yup.string().required(t("dosageRequired", "Dosage is required")),
    instructions: Yup.string().required(t("instructionsRequired", "Instructions are required")),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    setApiMessage(null);
    setApiError(null);

    try {
      const response = await axios.post(
        `https://grackle-notable-hardly.ngrok-free.app/api/patients/${values.patient_id}/prescriptions/`,
        {
          medicine_name: values.medicine_name,
          dosage: values.dosage,
          instructions: values.instructions,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 201) {
        setApiMessage(response.data.message);
      }

      resetForm({
        values: {
          patient_id: values.patient_id,
          medicine_name: "",
          dosage: "",
          instructions: "",
        },
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setApiError(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        setApiError("An error occurred. Please try again.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      patient_id: "",
      medicine_name: "",
      dosage: "",
      instructions: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiMessage(null);
      setApiError(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [apiMessage, apiError]);

  // Set document direction based on language
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div>
      <Helmet>
        <title>{t("addPrescriptionTitle", "Add Prescription")}</title>
        <meta name="description" content="easy care Add Prescription page" />
      </Helmet>
      <div className="addForm d-flex flex-column justify-content-center align-items-center text-center">
        <h1>{t("showHistoryTitle", "عرض سجل المرضى")}</h1>
        {apiMessage && (
          <div className="alert alert-success" role="alert">
            {apiMessage}
          </div>
        )}
        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}
        <div className="form text-start w-75">
          <form onSubmit={formik.handleSubmit}>
            {/* Patient ID */}
            <div className="form-group">
              <label htmlFor="patient_id">{t("patientIdLabel", "الرقم القومي للمريض:")}</label>
              <input
                type="text"
                id="patient_id"
                name="patient_id"
                value={formik.values.patient_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control"
                placeholder={t("patientIdPlaceholder", "أدخل الرقم القومي للمريض")}
              />
              {formik.touched.patient_id && formik.errors.patient_id ? (
                <div className="error">{formik.errors.patient_id}</div>
              ) : null}
            </div>

            {/* Medicine Name */}
            <div className="form-group">
              <label htmlFor="medicine_name">{t("medicineNameLabel", "اسم الدواء:")}</label>
              <input
                type="text"
                id="medicine_name"
                name="medicine_name"
                value={formik.values.medicine_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control"
                placeholder={t("medicineNamePlaceholder", "أدخل اسم الدواء")}
              />
              {formik.touched.medicine_name && formik.errors.medicine_name ? (
                <div className="error">{formik.errors.medicine_name}</div>
              ) : null}
            </div>

            {/* Dosage */}
            <div className="form-group">
              <label htmlFor="dosage">{t("dosageLabel", "الجرعة")}</label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={formik.values.dosage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control"
                placeholder={t("dosagePlaceholder", "أدخل الجرعة")}
              />
              {formik.touched.dosage && formik.errors.dosage ? (
                <div className="error">{formik.errors.dosage}</div>
              ) : null}
            </div>

            {/* Instructions */}
            <div className="form-group">
              <label htmlFor="instructions">{t("instructionsLabel", "التعليمات")}</label>
              <textarea
                id="instructions"
                name="instructions"
                value={formik.values.instructions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control"
                placeholder={t("instructionsPlaceholder", "أدخل التعليمات")}
              />
              {formik.touched.instructions && formik.errors.instructions ? (
                <div className="error">{formik.errors.instructions}</div>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary mt-3"
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
                t("addPrescriptionButton", "إضافة وصفة طبية")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
