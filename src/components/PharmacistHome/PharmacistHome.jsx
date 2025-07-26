import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Helmet } from "react-helmet";
import Loading from "../Loading/Loading";
import { Blocks } from "react-loader-spinner";
import { userContext } from "../UserContext/UserContext";

export default function PharmacistHome() {
  const [medicineList, setMedicineList] = useState("");
  const [pharmacistProfile, setPharmacistProfile] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [isPageLoading, setIsPageLoading] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { userToken, setUserToken } = useContext(userContext);

  async function getPharmacistProfile() {
    setIsPageLoading(true);
    try {
      const response = await axios.get(
        "https://grackle-notable-hardly.ngrok-free.app/api/profile/",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.status === 200) {
        setIsPageLoading(false);
        setPharmacistProfile(response.data);
      }
    } catch (error) {
      setIsPageLoading(false);
      toast.error("Error Happend!.");
    }
  }

  async function getMedicineList(id) {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://grackle-notable-hardly.ngrok-free.app/api/search-patient/${id}/`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        setMedicineList(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
      toast.error("Error Happend!");
    }
  }

  useEffect(() => {
    getPharmacistProfile();
  }, []);

  return (
    <>
      <Helmet>
        <title>Pharmacist Home</title>
        <meta name="description" content="easy care Pharmacist Home" />
      </Helmet>
      {isPageLoading ? (
        <Loading />
      ) : (
        <div className="container my-5 py-5 text-center">
          <div className=" pharmacistHomeContainer pb-5">
            <div className="pharmacy-info py-3">
              <h1 className="display-3-md mx-2">
                {pharmacistProfile.pharmacy_name}
              </h1>
              <div className="d-flex flex-wrap text-start justify-content-between align-items-center mx-2">
                <p className="bold">
                  Address : {pharmacistProfile?.pharmacy_address}
                </p>
                <p className="bold">Email : {pharmacistProfile?.email}</p>
                <p className="bold">
                  Phone : {pharmacistProfile?.phone_number}
                </p>
                <p className="bold">{pharmacistProfile?.full_name}</p>
              </div>
            </div>

            <div className="row justify-content-center mt-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nationalId" className="form-label mt-4 h2">
                    Enter Patient's National ID
                  </label>
                  <input
                    type="search"
                    className="form-control "
                    id="nationalId"
                    placeholder="National ID"
                    onChange={(e) => setInputValue(e.target.value)}
                    required
                  />
                </div>
                {isLoading ? (
                  <button
                    type="button"
                    className="btn myBtn fw-bold mt-3 px-4 py-2"
                  >
                    <Blocks
                      height="28"
                      width="200"
                      color="white"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      visible={true}
                    />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary py-2 px-4"
                    onClick={() => {
                      getMedicineList(inputValue);
                    }}
                  >
                    Get Prescribed Medicines
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="my-5 prescriptionList">
            <h3 className="bold h2">Prescribed Medicines</h3>
            <div
              className="accordion accordion-flush shadow-lg"
              id="accordionFlushExample"
            >
              {" "}
              {medicineList ? (
                <>
                  {medicineList.prescriptions.map((item, index) => {
                    return (
                      <>
                        <div className="accordion-item" key={index}>
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed text-primary fw-bold"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#flush-collapse${index}`}
                              aria-expanded="false"
                              aria-controls={`flush-collapse${index}`}
                            >
                              Prescription Details
                            </button>
                          </h2>
                          <div className="d-flex flex-wrap justify-content-between align-items-center text-start px-3 py-2">
                            <p className="mb-0">
                              <strong>Date: </strong> {item.created_at}
                            </p>
                            <p className="mb-0">
                              <strong>Doctor: </strong> {item.doctor}
                            </p>
                          </div>
                          <div
                            id={`flush-collapse${index}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body ">
                              <div className="d-flex flex-wrap justify-content-between align-items-center text-start">
                                <p>
                                  <strong>Medicine Name: </strong>{" "}
                                  {item.medicine_name}
                                </p>
                                <p>
                                  <strong>Dosage: </strong> {item.dosage}
                                </p>
                                <p>
                                  <strong>Instructions: </strong>{" "}
                                  {item.instructions}
                                  hours
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
