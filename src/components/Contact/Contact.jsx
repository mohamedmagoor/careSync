import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import style from "./Contact.module.css";
import { Blocks } from "react-loader-spinner";
import { userContext } from "../UserContext/UserContext";
import { Helmet } from "react-helmet";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    national_id: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useContext(userContext);
  const [apiMessage, setApiMessage] = useState(null);
  const [apiError, setApiError] = useState(null); // Added for error message handling

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://grackle-notable-hardly.ngrok-free.app/api/contact-us/",
        formData,
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
    } catch (error) {
      console.error("Error submitting form:", error);
      setApiError("Error submitting form.");
    } finally {
      setFormData({
        name: "",
        national_id: "",
        message: "",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiMessage(null);
      setApiError(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [apiMessage, apiError]);

  return (
    <>
      <Helmet>
        <title>Contact Us</title>
        <meta name="description" content="easy care Contact Us page" />
      </Helmet>
      <div className={style.contactFormContainer}>
        <h2>Contact Us</h2>
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
        <form className={style.contactForm} onSubmit={handleSubmit}>
          <div className={style.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="national_id">National ID</label>
            <input
              type="text"
              id="national_id"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className={style.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <Blocks
                height="28"
                width="40"
                color="white"
                ariaLabel="blocks-loading"
                visible={true}
              />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
