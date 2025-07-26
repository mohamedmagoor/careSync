import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./SplashScreen.module.css";
import "./SplashScreen.module.css";
import { NavLink } from "react-router-dom";
import image from "../../assets/images/imageLogo.png";
import { DNA } from "react-loader-spinner";
export default function SplashScreen() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the splash screen has been shown before
    if (localStorage.getItem("splashShown")) {
      navigate("/home");
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        localStorage.setItem("splashShown", "true");
        navigate("/home");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);
  return (
    <>
      {loading ? (
        <div className="vh-100 d-flex justify-content-center align-items-center bg-gradient">
          <div className=" watermark position-absolute top-50 start-50 translate-middle text-white">
            <div className="text-center position-relative">
              <img src={image} alt="Logo" className="w-100" />
              <h1 className="fw-bold mb-4">Easy Care</h1>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
}
