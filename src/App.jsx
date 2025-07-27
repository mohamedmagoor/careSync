import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import PatientRegister from "./components/PatientRegister/PatientRegister";
import Doctors from "./components/Doctors/Doctors";
import PharmacyRegister from "./components/PharmacyRegister/PharmacyRegister";
import PharmacistHome from "./components/PharmacistHome/PharmacistHome";
import Contact from "./components/Contact/Contact";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import Role from "./components/Role/Role";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import UserContextProvider from "./components/UserContext/UserContext";
import Otp from "./components/Otp/Otp";
import DoctorHome from "./components/DoctorHome/DoctorHome";
import PatientHome from "./components/PatientHome/PatientHome";
import PatientCatigoryDoctors from "./components/PatientCatigoryDoctors/PatientCatigoryDoctors";
import PatientCatigoryPharmacies from "./components/PatientCatigoryPharmacies/PatientCatigoryPharmacies";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DoctorShowHistory from "./components/DoctorShowHistory/DoctorShowHistory";
import DoctorProfile from "./components/DoctorProfile/DoctorProfile";
import AppointmentBooking from "./components/AppointmentBooking/AppointmentBooking";
function App() {
  const routers = createBrowserRouter([
    { index: true, path: "splash", element: <SplashScreen /> },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "home",
          element: <Home />,
        },
        { path: "patientRegister", element: <PatientRegister /> },
        {
          path: "doctors",
          element: <Doctors />,
        },
        { path: "pharmacyRegister", element: <PharmacyRegister /> },
        {
          path: "pharmacistHome",
          element: (
            <ProtectedRoute>
              <PharmacistHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctorHome",
          element: (
            <ProtectedRoute>
              <DoctorHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctorProfile",
          element: (
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "DoctorShowHistory",
          element: (
            <ProtectedRoute>
              <DoctorShowHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "patientHome",
          element: (
            <ProtectedRoute>
              <PatientHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "patientCategoryDoctors",
          element: <PatientCatigoryDoctors />,
        },
        {
          path: "patientCatigoryPharmacies",
          element: <PatientCatigoryPharmacies />,
        },
        {
          path: "appointments",
          element: (
            <ProtectedRoute>
              <AppointmentBooking />
            </ProtectedRoute>
          ),
        },
        { path: "forgotPassword", element: <ForgetPassword /> },
        { path: "otp", element: <Otp /> },
        { path: "contact", element: <Contact /> },
        { path: "role", element: <Role /> },
        { path: "role/register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <UserContextProvider>
      <RouterProvider router={routers} />
    </UserContextProvider>
  );
}

export default App;
