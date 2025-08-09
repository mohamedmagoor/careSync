# Appointment Booking Feature

This feature allows patients to book appointments with doctors in the CareSync application.

## Backend Setup

### 1. Models

The backend includes three main models in `backend/Appointment/models.py`:

- **DoctorSchedule**: Manages doctor's weekly working hours
- **Appointment**: Stores appointment details between patients and doctors
- **DoctorDayOff**: Tracks specific days when doctors are unavailable

### 2. API Endpoints

Available at `https://grackle-notable-hardly.ngrok-free.app/api/appointments/`:

#### Patient Endpoints:

- `GET /doctors/` - Get all available doctors
- `GET /doctors/{doctor_id}/schedule/` - Get doctor's weekly schedule
- `GET /doctors/{doctor_id}/availability/` - Get doctor's availability for date range
- `POST /book/` - Book an appointment
- `GET /my-appointments/` - Get patient's appointments
- `DELETE /appointments/{appointment_id}/` - Cancel an appointment

#### Doctor Endpoints:

- `GET /doctor/appointments/` - Get doctor's appointments
- `POST /doctor/schedule/` - Create/manage schedule
- `POST /doctor/days-off/` - Add days off

### 3. Required Backend Setup

1. **Run Migrations** (if not already done):

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

2. **Create Doctor Schedules** (Required for appointment booking):

```python
# In Django shell or create a management command
from Account.models import CustomUser
from Appointment.models import DoctorSchedule
from datetime import time

# Get a doctor
doctor = CustomUser.objects.filter(user_type='doctor').first()

# Create weekly schedule (Monday to Friday, 9 AM to 5 PM)
for day in range(5):  # Monday = 0, Friday = 4
    DoctorSchedule.objects.get_or_create(
        doctor=doctor,
        day_of_week=day,
        defaults={
            'start_time': time(9, 0),  # 9:00 AM
            'end_time': time(17, 0),   # 5:00 PM
            'is_working_day': True,
            'appointment_duration': 30  # 30 minutes per appointment
        }
    )
```

## Frontend Components

### Main Components:

1. **AppointmentBooking.jsx** - Main container with step navigation
2. **DoctorList.jsx** - Shows available doctors with search/filter
3. **DoctorSchedule.jsx** - Displays doctor's availability and time slots
4. **BookingForm.jsx** - Confirmation form for booking
5. **MyAppointments.jsx** - Lists patient's appointments with management options

### Features:

- **Step-by-step booking process** with visual indicators
- **Doctor search and filtering** by specialization
- **Real-time availability** showing available/booked time slots
- **Week navigation** to view future appointments
- **Appointment management** (view, cancel)
- **Responsive design** for mobile and desktop

## Usage Instructions

### For Patients:

1. **Navigate to Appointments**:

   - Click "Book Appointment" in the navigation menu
   - Or visit `/appointments` directly

2. **Select a Doctor**:

   - Browse available doctors
   - Use search to find specific doctors
   - Filter by specialization
   - Click "Select Doctor" on your preferred doctor

3. **Choose Date and Time**:

   - Navigate between weeks using arrow buttons
   - Click on available time slots (green)
   - Booked slots are shown in yellow and cannot be selected

4. **Confirm Booking**:

   - Review appointment details
   - Add optional notes for the doctor
   - Click "Confirm Appointment"

5. **Manage Appointments**:
   - View all appointments in "My Appointments" tab
   - Filter by status (pending, confirmed, cancelled, completed)
   - Cancel appointments (up to 24 hours before)

### For Doctors:

1. **Set Up Schedule** (Backend Admin or API):

   - Create DoctorSchedule entries for working days
   - Set working hours and appointment duration
   - Add days off when unavailable

2. **Manage Appointments**:
   - View appointments through doctor dashboard
   - Update appointment status
   - Add doctor notes after consultation

## API Authentication

All endpoints require Bearer token authentication:

```javascript
headers: {
  'Authorization': `Bearer ${userToken}`,
  'Content-Type': 'application/json',
}
```

## Styling

The components use custom CSS with:

- Modern design with gradients and shadows
- Responsive layout for all screen sizes
- Color-coded status indicators
- Smooth animations and transitions
- Professional healthcare theme

## Error Handling

- Network errors are displayed to users
- Validation errors prevent invalid bookings
- Loading states keep users informed
- Graceful fallbacks for empty states

## Future Enhancements

Potential improvements:

- Email/SMS notifications
- Appointment reminders
- Video consultation integration
- Payment processing
- Advanced scheduling (recurring appointments)
- Doctor ratings and reviews
- Appointment history with medical records

## Troubleshooting

### Common Issues:

1. **No doctors showing**:

   - Ensure doctors exist in the database with `user_type='doctor'`
   - Check API endpoint is accessible

2. **No available time slots**:

   - Verify DoctorSchedule entries exist for the doctor
   - Check if the day falls within working days
   - Ensure no DoctorDayOff entries block the date

3. **Booking fails**:

   - Check user authentication
   - Verify appointment is in the future
   - Ensure time slot hasn't been booked by another patient

4. **Styling issues**:
   - Ensure all CSS files are imported
   - Check for CSS conflicts with existing styles
   - Verify responsive breakpoints work on your target devices
