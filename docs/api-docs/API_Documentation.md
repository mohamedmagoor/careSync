# API Documentation

## Base URL

https://grackle-notable-hardly.ngrok-free.app/api/

## Endpoints

### 1. User Registration{#user-registration}

- **Endpoint:** `POST /register/`
- **Purpose:** Register a new user (patient, doctor, or pharmacist) in the system.

**Request Body:**
**For Patient Registration:**

````json
{
  "full_name": "Emily Davis",
  "email": "patient@example.com",
  "national_id": "30103011607053",
  "phone_number": "01060493174",
  "password": "StrongPassword123",
  "gender": "Female",
  "birthday": "1990-01-20",
  "address": "789 Wellness Ave, Healthtown",
  "diabetes": true,
  "heart_disease": false,
  "allergies": ["Peanuts", "Penicillin"],
  "other_diseases": "Seasonal flu",
  "user_type": "patient"
}
**For pharmacist Registration:**
```json
{
    "full_name": "Pharmacist Jane Smith",
    "email": "pharmacists@example.com",
    "national_id": "23356789012345",
    "phone_number": "01398765432",
    "password": "StrongPassword123",
    "gender": "Female",
    "birthday": "1990-08-22",
    "address": "456 Pharmacy Lane, Healthtown",
    "pharmacy_name": "Smith's Pharmacy",
    "pharmacy_address": "456 Pharmacy Lane, Healthtown",
    "user_type":"pharmacist"
}
**For doctor Registration:**
{
    "full_name": "Dr. John Doe",
    "email": "doctor@example.com",
    "national_id": "12345678901234",
    "phone_number": "01012345678",
    "password": "StrongPassword123",
    "gender": "Male",
    "birthday": "1980-05-15",
    "address": "123 Doctor Street, MedCity",
    "hospital": "General Hospital",
    "clinic": "Doe Clinic",
    "specialization": "Cardiology",
    "user_type": "doctor"
}
Expected Response:

{
  "status": "User created"
}
2. Login {#login}
- **Endpoint:** POST /login/
- **Purpose:** Authenticate a user and obtain JWT tokens.
Request Body:

{
  "national_id": "email@example.com",
  "password": "StrongPassword123"
}
Expected Response:

{
  "access": "JWT access token",
  "refresh": "JWT refresh token",
  "user_type": "pharmacist|doctor|patient"
}
3. Request Password Reset {#request-password-reset}
- **Endpoint:** POST /request-password-reset/
- **Purpose:** Initiates a password reset request by sending an OTP to the user's email.
Request Body:
{
  "email": "user@example.com"
}
Expected Response:
{
  "status": "OTP sent to email."
}
4. Verify OTP {#verify-otp}
- **Endpoint:** POST /verify-otp/
- **Purpose:** Verifies the OTP sent to the user during the password reset process.
Request Body:
{
  "email": "user@example.com",
  "otp": "123456"
}
Expected Response:
{
  "status": "OTP verified successfully."
}

5. Set New Password {#set-new-password}
- **Endpoint:** POST /set-new-password/
- **Purpose:** Sets a new password for the user after OTP verification.
Request Body:
{
  "email": "user@example.com",
  "otp": "123456",
  "new_password": "NewStrongPassword123"
}
Expected Response:
{
  "status": "Password updated successfully."
}

6. User Profile {#user-profile}
- **Endpoint:** GET /profile/
- **Purpose:** Retrieves the profile information of the authenticated user.
Required Headers:
{
  "Authorization": "Bearer <access_token>",
  "ngrok-skip-browser-warning": "true"
}
Expected Response:
{
  "full_name": "Dr. John Doe",
  "email": "doctor@example.com",
  "national_id": "12345678901234",
  "phone_number": "01012345678",
  "password": "StrongPassword123",
  "gender": "Male",
  "birthday": "1980-05-15",
  "address": "123 Doctor Street, MedCity",
  "hospital": "General Hospital",
  "clinic": "Doe Clinic",
  "specialization": "Cardiology",
  "user_type": "doctor"
}

7. Patient Search {#patient-search}
- **Endpoint:** GET /search-patient/{national_id}/
- **Purpose:** Retrieves the information of a patient by their national ID.
Required Headers:
{
  "Authorization": "Bearer <access_token>"
}
Expected Response:
{
  "full_name": "Emily Davis",
  "national_id": "30103011607053",
  "email": "patient@example.com"
}

8. Add Prescription {#add-prescription}
- **Endpoint:** POST /patients/{national_id}/prescriptions/
- **Purpose:** Allow to add prescriptions associated with a specific patient.
Required Headers:
{
  "Authorization": "Bearer <access_token>"
}
Request Body:
{
  "medicine_name": "Paracetamol 2",
  "dosage": "5000mg",
  "instructions": "Take 5 tablets every 12 hours after food."
}
Expected Response:
{
  "status": "Prescription added successfully."
}

9. Doctors Categories {#doctors-categories}
- **Endpoint:** GET /doctors-categories/
- **Purpose:** Retrieves a list of all doctors with their profile details.
Expected Response:
[
  {
    "full_name": "Dr. John Doe",
    "phone_number": "01060493144",
    "specialization": "Cardiology",
    "hospital": "General Hospital",
    "clinic": "Doe Clinic"
  },
  ...
]

10. Pharmacists Categories {#pharmacists-categories}
- **Endpoint:** GET /pharmacists-categories/
- **Purpose:** Retrieves a list of all pharmacists with their profile details.
Expected Response:
[
  {
    "full_name": "Pharmacist Jane Smith",
    "phone_number": "01060493144",
    "pharmacy_name": "Smith's Pharmacy",
    "pharmacy_address": "456 Pharmacy Lane, Healthtown"
  },
  ...
]
10. ContactUs {#contact-us}
- **Endpoint:** POST /contact-us/
- **Purpose:**Allow Authenticated user to contact US:
{
  "Authorization": "Bearer <access_token>",
  "ngrok-skip-browser-warning": "true"
}
Request Body:
{
    "name": "Emily Davis",
    "national_id": "12345678901234",
    "message": "I would like to inquire about my prescription."
}

Expected Response:
{
	"message": "Your message has been received and emailed."
}

````
