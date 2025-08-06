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
import DoctorAppointments from "./components/Doctors/DoctorAppointments";
import DoctorScheduleManage from "./components/AppointmentBooking/DoctorScheduleManage";
import DoctorDaysOffManage from "./components/AppointmentBooking/DoctorDaysOffManage";
import DoctorAvailabilityManagement from "./components/AppointmentBooking/DoctorAvailabilityManagement";
// Add the import for AdminDashboard
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

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
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctorHome",
          element: (
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctorProfile",
          element: (
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "DoctorShowHistory",
          element: (
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorShowHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctor/schedule",
          element: (
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorScheduleManage />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctor/days-off",
          element: (
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDaysOffManage />
            </ProtectedRoute>
          ),
        },
        {
          path: "doctor/availability",
          element: (
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorAvailabilityManagement />
            </ProtectedRoute>
          ),
        },
        {
          path: "patientHome",
          element: (
            <ProtectedRoute allowedRoles={['patient']}>
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
            <ProtectedRoute allowedRoles={['patient']}>
              <AppointmentBooking />
            </ProtectedRoute>
          ),
        },
        { 
          path: "doctor/appointments", 
          element: (
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorAppointments />
            </ProtectedRoute>
          ) 
        },
        // Add the admin dashboard route (no protection here, add if needed)
        {
          path: "admin/dashboard",
          element: (
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
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