import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";
import { userContext } from "../UserContext/UserContext";
import "./DoctorShowHistory.css";
import { Helmet } from "react-helmet";

export default function DoctorShowHistory() {
  const [medicineList, setMedicineList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { userToken } = useContext(userContext);
  const [patientDetails, setPatientDetails] = useState(null);

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
        setMedicineList(response.data);
        setPatientDetails(response.data);
      }
    } catch (error) {
      toast.error("Error Happened!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Doctor Show History</title>
        <meta name="description" content="easy care Doctor Show History page" />
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container my-5 py-5 text-center">
          <div className="pharmacistHomeContainer pb-5">
            <div className="row justify-content-center mt-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nationalId" className="form-label mt-4 h2">
                    Enter Patient's National ID
                  </label>
                  <input
                    type="search"
                    className="form-control"
                    id="nationalId"
                    placeholder="National ID"
                    onChange={(e) => setInputValue(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary py-2 px-4"
                  onClick={() => {
                    getMedicineList(inputValue);
                  }}
                >
                  Get Prescribed Medicines
                </button>
              </div>
            </div>
          </div>

          {/* Patient Card to Show Personal Data */}
          <div className="patient mt-5">
            <h1 className="h3">Patient Details</h1>
            <div className="patientCard mt-4 shadow  ">
              {patientDetails ? (
                <table className="table table-striped table-hover">
                  <tbody>
                    <tr>
                      <th scope="row">Full Name</th>
                      <td>{patientDetails.full_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Birthday</th>
                      <td>{patientDetails.birthday}</td>
                    </tr>
                    <tr>
                      <th scope="row">Diabetes</th>
                      <td>{patientDetails.diabetes ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <th scope="row">Heart Disease</th>
                      <td>{patientDetails.heart_disease ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <th scope="row">Allergies</th>
                      <td>{patientDetails.allergies.join(", ")}</td>
                    </tr>
                    <tr>
                      <th scope="row">Other Diseases</th>
                      <td>{patientDetails.other_diseases}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No patient details available.</p>
              )}
            </div>
          </div>

          <div className="my-5 prescriptionList">
            <h3 className="bold h2">Prescribed Medicines</h3>
            <div
              className="accordion accordion-flush shadow-lg"
              id="accordionFlushExample"
            >
              {medicineList && medicineList.prescriptions.length > 0 ? (
                medicineList.prescriptions.map((item, index) => (
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
                            <strong>Instructions: </strong> {item.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No prescribed medicines found for this patient.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
