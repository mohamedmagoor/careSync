from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
from Account.models import CustomUser
from datetime import time, date, datetime, timedelta


class DoctorSchedule(models.Model):
    """
    Represents a doctor's weekly schedule with working hours and days off
    """
    WEEKDAYS = [
        (0, 'Monday'),
        (1, 'Tuesday'), 
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    doctor = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        limit_choices_to={'user_type': 'doctor'},
        related_name='schedules'
    )
    day_of_week = models.IntegerField(choices=WEEKDAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_working_day = models.BooleanField(default=True)
    appointment_duration = models.IntegerField(default=30, help_text="Duration in minutes")
    
    class Meta:
        unique_together = ['doctor', 'day_of_week']
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        day_name = dict(self.WEEKDAYS)[self.day_of_week]
        if self.is_working_day:
            return f"{self.doctor.full_name} - {day_name} ({self.start_time} - {self.end_time})"
        else:
            return f"{self.doctor.full_name} - {day_name} (Day Off)"
    
    def get_available_slots(self, date_obj):
        """
        Get available time slots for a specific date
        """
        if not self.is_working_day:
            return []
        
        # Check if the date matches this day of week
        if date_obj.weekday() != self.day_of_week:
            return []
        
        slots = []
        current_time = self.start_time
        end_time = self.end_time
        
        while current_time < end_time:
            slot_datetime = datetime.combine(date_obj, current_time)
            
            # Check if this slot is already booked
            is_booked = Appointment.objects.filter(
                doctor=self.doctor,
                appointment_date=date_obj,
                appointment_time=current_time,
                status__in=['confirmed', 'pending']
            ).exists()
            
            slots.append({
                'time': current_time.strftime('%H:%M'),
                'datetime': slot_datetime,
                'is_available': not is_booked
            })
            
            # Add appointment duration to get next slot
            current_datetime = datetime.combine(date_obj, current_time)
            next_datetime = current_datetime + timedelta(minutes=self.appointment_duration)
            current_time = next_datetime.time()
        
        return slots


class Appointment(models.Model):
    """
    Represents an appointment between a patient and doctor
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    patient = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'patient'},
        related_name='patient_appointments'
    )
    doctor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'doctor'},
        related_name='doctor_appointments'
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, help_text="Patient's notes or reason for visit")
    doctor_notes = models.TextField(blank=True, help_text="Doctor's notes after appointment")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['doctor', 'appointment_date', 'appointment_time']
        ordering = ['appointment_date', 'appointment_time']
    
    def __str__(self):
        return f"{self.patient.full_name} with Dr. {self.doctor.full_name} on {self.appointment_date} at {self.appointment_time}"
    
    @property
    def appointment_datetime(self):
        return datetime.combine(self.appointment_date, self.appointment_time)
    
    def can_be_cancelled(self):
        """
        Check if appointment can be cancelled (at least 24 hours before)
        """
        if self.status in ['cancelled', 'completed']:
            return False
        
        appointment_datetime = self.appointment_datetime
        now = timezone.now()
        
        # Allow cancellation if appointment is at least 24 hours away
        return appointment_datetime > now + timedelta(hours=24)


class DoctorDayOff(models.Model):
    """
    Represents specific days when a doctor is not available (holidays, vacation, etc.)
    """
    doctor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'doctor'},
        related_name='days_off'
    )
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True, help_text="Reason for day off")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['doctor', 'date']
        ordering = ['date']
    
    def __str__(self):
        return f"Dr. {self.doctor.full_name} - Day off on {self.date}"
