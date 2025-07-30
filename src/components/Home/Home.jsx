import React from "react";
import "./Home.css";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import doctorImage from "../../assets/images/doctor.png";
import doctorIcon from "../../assets/images/banner.png";
import patientImage from "../../assets/images/patient.png";
import pharmacistImage from "../../assets/images/pharmacy.png";
import doctorImage1 from "../../assets/images/doctorI.png";
import testimonialimg1 from "../../assets/images/doctorTest.jpeg";
import testimonialimg2 from "../../assets/images/PharmacistTest.jpeg";
import testimonialimg3 from "../../assets/images/patientTest.jpeg";
import newsimg1 from "../../assets/images/Designer.jpeg";
import newsimg2 from "../../assets/images/Designer2.jpeg";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Helmet } from "react-helmet";

export default function Home() {
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
      <Helmet>
        <title>CareSync - Your Complete Healthcare Solution</title>
        <meta name="description" content="EasyCare provides comprehensive healthcare services including doctor consultations, patient care, and pharmacy services all in one place." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-content">
          <h1>Doctor, Patient, and Pharmacist - All in One Place</h1>
          <p>Experience seamless healthcare with our integrated platform. Connect with doctors, manage prescriptions, and access pharmacy services all in one convenient location.</p>
          <div className="hero-actions">
            <Link to="/role">
              <button className="cta-button">Get Started Today</button>
            </Link>
            <Link to="/contact">
              <button className="cta-button secondary">Learn More</button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={doctorImage} alt="Healthcare Professional" />
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive healthcare solutions designed to meet all your medical needs</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Doctor Services</h3>
              <p>Connect with specialized doctors for expert consultations and personalized healthcare plans tailored to your needs.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-injured"></i>
              </div>
              <h3>Patient Care</h3>
              <p>Comprehensive patient care with modern facilities and compassionate healthcare professionals dedicated to your well-being.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Pharmacy Services</h3>
              <p>Fully stocked pharmacy with prescription medications, over-the-counter products, and professional pharmaceutical guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-heading">Take the First Step Towards Better Health</h2>
          <p className="cta-text">
            Join thousands of satisfied patients who trust EasyCare for their healthcare needs. 
            Start your journey to better health today.
          </p>
          <Link to="/role">
            <button className="cta-button">Get Started Now</button>
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest News & Updates</h2>
            <p>Stay informed about the latest healthcare innovations and service improvements</p>
          </div>
          
          <div className="news-grid">
            <div className="news-card">
              <img src={newsimg1} alt="Telemedicine Service" className="news-image" />
              <div className="news-content">
                <h3>Telemedicine Service Now Available</h3>
                <p>Our new telemedicine service allows patients to get expert consultations without leaving their homes, ensuring safety and convenience.</p>
                <Link to="/news/telemedicine">
                  <button className="news-button">Read More</button>
                </Link>
              </div>
            </div>
            
            <div className="news-card">
              <img src={newsimg2} alt="Pharmacy Services" className="news-image" />
              <div className="news-content">
                <h3>Expanded Pharmacy Services</h3>
                <p>We are excited to announce expanded pharmacy services with home delivery options for patients who prefer convenience.</p>
                <Link to="/news/pharmacy">
                  <button className="news-button">Read More</button>
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
            <h2>What Our Clients Say</h2>
            <p>Hear from our satisfied patients and healthcare professionals</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-text">
                "Amazing service! The doctors are very professional, and I felt cared for throughout the entire process. The convenience of having everything in one place is incredible."
              </div>
              <div className="testimonial-author">
                <img src={testimonialimg1} alt="John Doe" className="testimonial-avatar" />
                <div className="author-info">
                  <h4>John Doe</h4>
                  <p>Patient</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="quote-text">
                "The healthcare here is exceptional, and the pharmacy service makes everything so convenient. The integrated approach really benefits our patients."
              </div>
              <div className="testimonial-author">
                <img src={testimonialimg2} alt="Jane Smith" className="testimonial-avatar" />
                <div className="author-info">
                  <h4>Jane Smith</h4>
                  <p>Pharmacist</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="quote-text">
                "Having all my healthcare needs met in one place makes life so much easier. The staff is friendly and the service is top-notch. Highly recommend!"
              </div>
              <div className="testimonial-author">
                <img src={testimonialimg3} alt="Emily Johnson" className="testimonial-avatar" />
                <div className="author-info">
                  <h4>Emily Johnson</h4>
                  <p>Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about our services</p>
          </div>
          
          <div className="faq-container">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>How can I book an appointment?</Accordion.Header>
                <Accordion.Body>
                  You can book an appointment online through our website or mobile app. 
                  Simply click "Book Now" and follow the easy steps to schedule your consultation.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="1">
                <Accordion.Header>Are the pharmacy services available 24/7?</Accordion.Header>
                <Accordion.Body>
                  Yes, our pharmacy services are available round the clock to ensure 
                  you have access to medications whenever needed, with emergency services always available.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="2">
                <Accordion.Header>How do I contact customer support?</Accordion.Header>
                <Accordion.Body>
                  You can reach us via the "Contact Us" page, call our support hotline, 
                  or use our live chat feature for immediate assistance with any questions or concerns.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="3">
                <Accordion.Header>Is telemedicine available for all specialties?</Accordion.Header>
                <Accordion.Body>
                  Most of our specialties offer telemedicine consultations. 
                  Check our services page for the complete list of available online consultations.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
