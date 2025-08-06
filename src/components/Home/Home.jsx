import React from "react";
import "../../i18n";
import "./Home.css";
import doctorImage from "../../assets/images/doctor.png";
import testimonialimg1 from "../../assets/images/doctorTest.jpeg";
import testimonialimg2 from "../../assets/images/PharmacistTest.jpeg";
import testimonialimg3 from "../../assets/images/patientTest.jpeg";
import newsimg1 from "../../assets/images/Designer.jpeg";
import newsimg2 from "../../assets/images/Designer2.jpeg";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from "react-helmet";

import { useTranslation, Trans } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          padding: "8px 16px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
        aria-label="Toggle language"
      >
        {i18n.language === "en" ? "العربية" : "English"}
      </button>
      <Helmet>
        <title>CareSync - Your Complete Healthcare Solution</title>
        <meta
          name="description"
          content="EasyCare provides comprehensive healthcare services including doctor consultations, patient care, and pharmacy services all in one place."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">{t("hero.badge")}</div>
          <h1>
            <Trans
              i18nKey="hero.title"
              components={{
                br: <br />,
                span: <span className="highlight-text" />,
              }}
            />
          </h1>
          <p>{t("hero.description")}</p>
          <div className="hero-actions">
            <Link to="/appointments" className="cta-button primary">
              <i className="fas fa-calendar-plus"></i>
              {t("hero.bookAppointment")}
            </Link>
            <Link to="/contact" className="cta-button secondary">
              <i className="fas fa-envelope"></i>
              {t("hero.contactUs")}
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="doctor-image-container">
            <img
              src={doctorImage}
              alt="Healthcare Professional"
              className="doctor-image"
            />
          </div>

          {/* Floating Cards */}

          <div className="floating-card stats-card">
            <div className="card-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="card-content">
              <h3>125+</h3>
              <p>{t("floating.stats", "Trusted Doctors")}</p>
            </div>
          </div>

          <div className="floating-card review-card">
            <div className="star-rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p>{t("floating.review", "Excellent service and care!")}</p>
          </div>

          <div className="floating-card question-card">
            <div className="card-icon">
              <i className="fas fa-stethoscope"></i>
            </div>
            <div className="card-content">
              <p>{t("floating.question", "How are you feeling today?")}</p>
            </div>
          </div>

          <div className="floating-card results-card">
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="card-content">
              <p>{t("floating.results", "Your test results look great!")}</p>
            </div>
          </div>

          <div className="floating-card doctor-info-card">
            <div className="doctor-avatar">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="card-content">
              <h4>{t("floating.doctorName", "Alex Miller")}</h4>
              <p>{t("floating.doctorSpecialty", "Cardiologist")}</p>
              <div className="status-indicator"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>{t("features.title")}</h2>
            <p>{t("features.description")}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>{t("features.doctor.title")}</h3>
              <p>{t("features.doctor.desc")}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-injured"></i>
              </div>
              <h3>{t("features.patient.title")}</h3>
              <p>{t("features.patient.desc")}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>{t("features.pharmacy.title")}</h3>
              <p>{t("features.pharmacy.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-heading">{t("cta.title")}</h2>
          <p className="cta-text">{t("cta.text")}</p>
          <Link to="/role">
            <button className="cta-button">{t("cta.button")}</button>
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2>{t("news.title")}</h2>
            <p>{t("news.description")}</p>
          </div>

          <div className="news-grid">
            <div className="news-card">
              <img
                src={newsimg1}
                alt="Telemedicine Service"
                className="news-image"
              />
              <div className="news-content">
                <h3>{t("news.telemedicine.title")}</h3>
                <p>{t("news.telemedicine.desc")}</p>
                <Link to="/news/telemedicine">
                  <button className="news-button">{t("news.readMore")}</button>
                </Link>
              </div>
            </div>

            <div className="news-card">
              <img
                src={newsimg2}
                alt="Pharmacy Services"
                className="news-image"
              />
              <div className="news-content">
                <h3>{t("news.pharmacy.title")}</h3>
                <p>{t("news.pharmacy.desc")}</p>
                <Link to="/news/pharmacy">
                  <button className="news-button">{t("news.readMore")}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>{t("testimonials.title")}</h2>
            <p>{t("testimonials.description")}</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-text">{t("testimonials.1.text")}</div>
              <div className="testimonial-author">
                <img
                  src={testimonialimg1}
                  alt="John Doe"
                  className="testimonial-avatar"
                />
                <div className="author-info">
                  <h4>{t("testimonials.1.name")}</h4>
                  <p>{t("testimonials.1.role")}</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-text">{t("testimonials.2.text")}</div>
              <div className="testimonial-author">
                <img
                  src={testimonialimg2}
                  alt="Jane Smith"
                  className="testimonial-avatar"
                />
                <div className="author-info">
                  <h4>{t("testimonials.2.name")}</h4>
                  <p>{t("testimonials.2.role")}</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-text">{t("testimonials.3.text")}</div>
              <div className="testimonial-author">
                <img
                  src={testimonialimg3}
                  alt="Emily Johnson"
                  className="testimonial-avatar"
                />
                <div className="author-info">
                  <h4>{t("testimonials.3.name")}</h4>
                  <p>{t("testimonials.3.role")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('faq.title')}</h2>
            <p>{t('faq.description')}</p>
          </div>

          <div className="faq-container">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>{t('faq.1.q')}</Accordion.Header>
                <Accordion.Body>{t('faq.1.a')}</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>{t('faq.2.q')}</Accordion.Header>
                <Accordion.Body>{t('faq.2.a')}</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>{t('faq.3.q')}</Accordion.Header>
                <Accordion.Body>{t('faq.3.a')}</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>{t('faq.4.q')}</Accordion.Header>
                <Accordion.Body>{t('faq.4.a')}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section> */}
    </>
  );
}
