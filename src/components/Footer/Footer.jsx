import React from 'react';
import './Footer.css';



 export default function Footer(){
  return (
    <>
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About EasyCare</h4>
          <p>
            EasyCare is committed to providing top-notch healthcare services with convenience
            and compassion. Our goal is to make healthcare accessible to everyone.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@easycare.com</p>
          <p>Phone: +1 123 456 7890</p>
          <p>Address: 123 EasyCare St., Health City</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className='fa-solid fa-brands fa-facebook'></i></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className='fa-solid fa-brands fa-instagram'></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className='fa-solid fa-brands  fa-twitter'></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 EasyCare. All rights reserved.</p>
      </div>
    </footer>
  </>
 )
 

 }
  
