import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./PatientCatigoryDoctors.module.css";
import { DNA } from "react-loader-spinner";
import {
  FaUser,
  FaStethoscope,
  FaPhone,
  FaEnvelope,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Helmet } from "react-helmet";

export default function PatientCatigoryDoctors() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({}); // State to track expanded cards

  const getCategory = () => {
    axios
      .get(
        "https://grackle-notable-hardly.ngrok-free.app/api/doctors-categories/",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then((response) => {
        setCategory(response.data);
        setLoading(false); // Data fetched successfully
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false); // Stop loading even in case of error
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const toggleCard = (index) => {
    setExpandedCards((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the state of the card
    }));
  };

  return (
    <>
      <Helmet>
        <title>Doctor'sCategory</title>
        <meta name="description" content="easy care Doctor's Category page" />
      </Helmet>
      <hr />
      <div className="text-black d-flex flex-column justify-content-center align-items-center p-4 mx-3 mt-5">
        <h2 className={style.catDoc}>Our Categories</h2>
        <p className={style.catDoc}>
          You Can Choose Your Favorite Doctor and Your Nearest Pharmacy From Our
          Categories
        </p>
      </div>
      {loading ? (
        <div className="loading">
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      ) : (
        <div className="cardDoc d-flex justify-content-center">
          <div className="container">
            <div className="row">
              {category.map((categoryDoc, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-sm-12 my-3">
                  <div
                    className={`${style.DocCatCard} rounded-1 py-4`}
                    onClick={() => toggleCard(index)}
                    style={{
                      cursor: "pointer",
                      transition: "box-shadow 0.3s ease",
                      boxShadow: expandedCards[index]
                        ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                        : "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="text-blackd-flex align-items-start">
                      <FaUser className={`${style.profileIcon} mx-1`} />
                      <p>
                        <strong>Doctor: </strong>
                        {categoryDoc.full_name || "N/A"}
                      </p>
                    </div>
                    <div className="text-black d-flex align-items-start">
                      <FaStethoscope className={`${style.profileIcon} mx-1`} />
                      <p>
                        <strong>Specialization: </strong>
                        {categoryDoc.specialization || "N/A"}
                      </p>
                    </div>
                    {expandedCards[index] && ( // Show additional info if expanded
                      <>
                        <div className="d-flex align-items-start">
                          <FaEnvelope className={`${style.profileIcon} mx-1`} />
                          <p>
                            <strong>Email: </strong>{" "}
                            {categoryDoc.email || "N/A"}
                          </p>
                        </div>
                        <div className="d-flex align-items-start">
                          <FaPhone className={`${style.profileIcon} mx-1`} />
                          <p>
                            <strong>Clinic Number: </strong>{" "}
                            {categoryDoc.phone_number || "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <FaHeart className={style.loveIcon} />
                      {expandedCards[index] ? (
                        <FaChevronUp className={style.chevronIcon} />
                      ) : (
                        <FaChevronDown className={style.chevronIcon} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
