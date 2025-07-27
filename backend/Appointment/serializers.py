from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, date, timedelta
from .models import DoctorSchedule, Appointment, DoctorDayOff
from Account.models import CustomUser


class DoctorSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor information in appointment context
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'email', 'phone_number', 'hospital', 'clinic', 'specialization']


class DoctorScheduleSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor's weekly schedule
    """
    day_name = serializers.SerializerMethodField()
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    
    class Meta:
        model = DoctorSchedule
        fields = ['id', 'doctor', 'doctor_name', 'day_of_week', 'day_name', 
                 'start_time', 'end_time', 'is_working_day', 'appointment_duration']
    
    def get_day_name(self, obj):
        return dict(DoctorSchedule.WEEKDAYS)[obj.day_of_week]


class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for appointments
    """
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    can_cancel = serializers.SerializerMethodField()
    appointment_datetime = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'patient_name', 'doctor', 'doctor_name', 
                 'doctor_specialization', 'appointment_date', 'appointment_time', 
                 'appointment_datetime', 'status', 'notes', 'doctor_notes', 
                 'can_cancel', 'created_at', 'updated_at']
        read_only_fields = ['doctor_notes', 'created_at', 'updated_at']
    
    def get_can_cancel(self, obj):
        return obj.can_be_cancelled()
    
    def get_appointment_datetime(self, obj):
        return obj.appointment_datetime.isoformat() if obj.appointment_datetime else None
    
    def validate(self, data):
        """
        Validate appointment data
        """
        appointment_date = data.get('appointment_date')
        appointment_time = data.get('appointment_time')
        doctor = data.get('doctor')
        
        # Check if appointment is in the future
        appointment_datetime = datetime.combine(appointment_date, appointment_time)
        if appointment_datetime <= timezone.now():
            raise serializers.ValidationError("Appointment must be scheduled for a future date and time.")
        
        # Check if doctor has a schedule for this day
        day_of_week = appointment_date.weekday()
        schedule = DoctorSchedule.objects.filter(
            doctor=doctor,
            day_of_week=day_of_week,
            is_working_day=True
        ).first()
        
        if not schedule:
            raise serializers.ValidationError("Doctor is not available on this day.")
        
        # Check if time is within doctor's working hours
        if not (schedule.start_time <= appointment_time <= schedule.end_time):
            raise serializers.ValidationError(
                f"Appointment time must be between {schedule.start_time} and {schedule.end_time}."
            )
        
        # Check if doctor has a day off on this date
        if DoctorDayOff.objects.filter(doctor=doctor, date=appointment_date).exists():
            raise serializers.ValidationError("Doctor is not available on this date.")
        
        # Check if slot is already booked (for create operations)
        if not self.instance:  # Only check for new appointments
            existing_appointment = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                status__in=['confirmed', 'pending']
            ).exists()
            
            if existing_appointment:
                raise serializers.ValidationError("This time slot is already booked.")
        
        return data


class DoctorDayOffSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor's days off
    """
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    
    class Meta:
        model = DoctorDayOff
        fields = ['id', 'doctor', 'doctor_name', 'date', 'reason', 'created_at']
        read_only_fields = ['created_at']


class DoctorAvailabilitySerializer(serializers.Serializer):
    """
    Serializer for getting doctor availability for a specific date range
    """
    start_date = serializers.DateField()
    end_date = serializers.DateField(required=False)
    
    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date', start_date)
        
        if end_date < start_date:
            raise serializers.ValidationError("End date must be after start date.")
        
        # Limit to 30 days range
        if (end_date - start_date).days > 30:
            raise serializers.ValidationError("Date range cannot exceed 30 days.")
        
        return data


class BookAppointmentSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for booking appointments
    """
    class Meta:
        model = Appointment
        fields = ['doctor', 'appointment_date', 'appointment_time', 'notes']
    
    def validate(self, data):
        """
        Validate appointment booking
        """
        appointment_date = data.get('appointment_date')
        appointment_time = data.get('appointment_time')
        doctor = data.get('doctor')
        
        # Check if appointment is in the future
        appointment_datetime = datetime.combine(appointment_date, appointment_time)
        if appointment_datetime <= timezone.now():
            raise serializers.ValidationError("Appointment must be scheduled for a future date and time.")
        
        # Check if doctor has a schedule for this day
        day_of_week = appointment_date.weekday()
        schedule = DoctorSchedule.objects.filter(
            doctor=doctor,
            day_of_week=day_of_week,
            is_working_day=True
        ).first()
        
        if not schedule:
            raise serializers.ValidationError("Doctor is not available on this day.")
        
        # Check if time is within doctor's working hours
        if not (schedule.start_time <= appointment_time <= schedule.end_time):
            raise serializers.ValidationError(
                f"Appointment time must be between {schedule.start_time} and {schedule.end_time}."
            )
        
        # Check if doctor has a day off on this date
        if DoctorDayOff.objects.filter(doctor=doctor, date=appointment_date).exists():
            raise serializers.ValidationError("Doctor is not available on this date.")
        
        # Check if slot is already booked
        existing_appointment = Appointment.objects.filter(
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status__in=['confirmed', 'pending']
        ).exists()
        
        if existing_appointment:
            raise serializers.ValidationError("This time slot is already booked.")
        
        return data
    
    def create(self, validated_data):
        # Set the patient from the request user
        user = self.context['request'].user
        
        # Debug logging
        print(f"Creating appointment with user: {user}")
        print(f"User type: {getattr(user, 'user_type', 'None')}")
        print(f"User authenticated: {user.is_authenticated}")
        print(f"Validated data: {validated_data}")
        
        # Validate that the user is a patient
        if not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated to book an appointment.")
        
        if getattr(user, 'user_type', None) != 'patient':
            raise serializers.ValidationError("Only patients can book appointments.")
        
        validated_data['patient'] = user
        
        try:
            return super().create(validated_data)
        except Exception as e:
            print(f"Error creating appointment: {e}")
            raise serializers.ValidationError(f"Failed to create appointment: {str(e)}")
