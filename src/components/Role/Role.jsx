import React from "react";
import { useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import doctorImage from "../../assets/images/doctorI.png";
import patientImage from "../../assets/images/patient.png";
import pharmacistImage from "../../assets/images/pharmacy.png";
import "./Role.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Role() {
  const [userType, setUserType] = useState("");

  const handleSelectUserType = (type) => {
    setUserType(type);
    console.log(`User selected: ${type}`);
  };
  return (
    <>
      <Helmet>
        <title>Role</title>
        <meta name="description" content="Choose Your Role" />
      </Helmet>
      <section className="welcome-section-role">
        <Container>
          <h2 className="text-center">Thank You for Joining Us!</h2>
          <h4 className="text-center">Please choose your role:</h4>
          <Row className="mt-4">
            {/* Doctor Card */}
            <Col md={4}>
              <Card className="welcome-card">
                <Card.Body className="text-center">
                  <div className="welcome-icons">
                    <img src={doctorImage} />
                  </div>

                  <Card.Title>Doctor</Card.Title>
                  <Link aria-current="page" to={"/doctors"}>
                    <Button
                      variant="primary"
                      onClick={() => handleSelectUserType("Doctor")}
                    >
                      I am a Doctor
                    </Button>
                  </Link>

                  <Card.Text>
                    Manage your patients and view their medical records
                    efficiently.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="welcome-card">
                <Card.Body className="text-center">
                  <div className="welcome-icons">
                    <img src={patientImage} />
                  </div>
                  <Card.Title> Patient</Card.Title>
                  <Link aria-current="page" to={"/patientRegister"}>
                    <Button
                      variant="primary"
                      onClick={() => handleSelectUserType("pharmacy")}
                    >
                      I am a Patients
                    </Button>
                  </Link>
                  <Card.Text>
                    Access your health information and manage your
                    prescriptions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="welcome-card">
                <Card.Body className="text-center">
                  <div className="welcome-icons">
                    <img src={pharmacistImage} />
                  </div>
                  <Card.Title>Pharmacist</Card.Title>
                  <Link aria-current="page" to={"/pharmacyRegister"}>
                    <Button
                      variant="primary"
                      onClick={() => handleSelectUserType("pharmacy")}
                    >
                      I am a pharmacist
                    </Button>
                  </Link>

                  <Card.Text>
                    View and manage prescriptions and medical data prescriptions
                    and medical data.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {userType && (
            <div className="mt-5">
              <h4>
                You have selected: <strong>{userType}</strong>
              </h4>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
