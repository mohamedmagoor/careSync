import React, { useState, useEffect } from "react";
import axios from "axios";
import { DNA } from "react-loader-spinner";
import {
  FaUser,
  FaAddressBook,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
  FaHeart,
  FaCaretDown,
  FaCaretUp,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";

export default function PatientCatigoryPharmacies() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  const getCategory = () => {
    axios
      .get(
        "https://grackle-notable-hardly.ngrok-free.app/api/pharmacists-categories/",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then((response) => {
        setCategory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const toggleCardExpansion = (index) => {
    setExpandedCardIndex(index === expandedCardIndex ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Pharmacies'sCategory</title>
        <meta
          name="description"
          content="easy care Pharmacies's Category page"
        />
      </Helmet>
      <hr />
      <div className="text-center p-4">
        <h2 className="catDoc text-black">Our Categories</h2>
        <p className="catDoc text-black">
          You Can Choose Your Favorite Pharmacist and Nearest Pharmacy From Our
          Categories
        </p>
      </div>

      {loading ? (
        <div className="loading d-flex justify-content-center align-items-center">
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
        <div className="container">
          <div className="row">
            {category.map((categoryPharm, index) => (
              <div key={index} className="col-lg-4 col-md-6 my-3">
                <div
                  className={`card shadow-sm ${
                    expandedCardIndex === index ? "expanded-card" : ""
                  }`}
                  onClick={() => toggleCardExpansion(index)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <FaUser className="profile-icon mx-2" />
                      <h5 className="card-title mb-0">
                        {categoryPharm.full_name || "Pharmacist N/A"}
                      </h5>
                    </div>

                    <div className="d-flex align-items-center mt-2">
                      <FaStethoscope className="profile-icon mx-2" />
                      <p className="card-text">
                        <strong>Pharmacy: </strong>{" "}
                        {categoryPharm.pharmacy_name || "N/A"}
                      </p>
                    </div>

                    {expandedCardIndex === index && (
                      <>
                        <div className="d-flex align-items-center">
                          <FaAddressBook className="profile-icon mx-2" />
                          <p className="card-text">
                            <strong>Address: </strong>{" "}
                            {categoryPharm.pharmacy_address || "N/A"}
                          </p>
                        </div>

                        <div className="d-flex align-items-center">
                          <FaPhone className="profile-icon mx-2" />
                          <p className="card-text">
                            <strong>Phone: </strong>{" "}
                            {categoryPharm.phone_number || "N/A"}
                          </p>
                        </div>

                        <div className="d-flex align-items-center">
                          <FaEnvelope className="profile-icon mx-2" />
                          <p className="card-text">
                            <strong>Email: </strong>{" "}
                            {categoryPharm.email || "N/A"}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <FaHeart className="love" />
                      {expandedCardIndex === index ? (
                        <FaCaretUp className="toggle-icon" />
                      ) : (
                        <FaCaretDown className="toggle-icon" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
