import React from "react";
import { useTranslation, Trans } from "react-i18next";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>{t("footer.aboutTitle", "About CareSync")}</h4>
            <p>
              {t(
                "footer.aboutText",
                "CareSync is committed to providing top-notch healthcare services with convenience and compassion. Our goal is to make healthcare accessible to everyone."
              )}
            </p>
          </div>

          <div className="footer-section">
            <h4>{t("footer.quickLinks", "Quick Links")}</h4>
            <ul>
              <li>
                <a href="#about">{t("footer.link.about", "About Us")}</a>
              </li>
              <li>
                <a href="#services">{t("footer.link.services", "Services")}</a>
              </li>
              <li>
                <a href="#contact">{t("footer.link.contact", "Contact")}</a>
              </li>
              <li>
                <a href="#faq">{t("footer.link.faq", "FAQ")}</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t("footer.contactTitle", "Contact Us")}</h4>
            <p>{t("footer.contactEmail", "Email")}: support@CareSync.com</p>
            <p>{t("footer.contactPhone", "Phone")}: +1 123 456 7890</p>
            <p>
              {t("footer.contactAddress", "Address")}: 123 CareSync St., Health
              City
            </p>
          </div>

          <div className="footer-section">
            <h4>{t("footer.followUs", "Follow Us")}</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <i className="fa-solid fa-brands fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <i className="fa-solid fa-brands fa-instagram"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <i className="fa-solid fa-brands  fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2024 CareSync. {t("footer.rights", "All rights reserved.")}
          </p>
        </div>
      </footer>
    </>
  );
}
