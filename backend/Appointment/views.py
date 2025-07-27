from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime, date, timedelta
from django.db.models import Q

from .models import DoctorSchedule, Appointment, DoctorDayOff
from Account.models import CustomUser
from .serializers import (
    DoctorSerializer, DoctorScheduleSerializer, AppointmentSerializer,
    DoctorDayOffSerializer, DoctorAvailabilitySerializer, BookAppointmentSerializer
)


class AvailableDoctorsView(generics.ListAPIView):
    """
    Get all available doctors with their specializations
    """
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        specialization = self.request.query_params.get('specialization', None)
        queryset = CustomUser.objects.filter(user_type='doctor')
        
        if specialization:
            queryset = queryset.filter(specialization__icontains=specialization)
        
        return queryset


class DoctorScheduleView(generics.ListAPIView):
    """
    Get doctor's weekly schedule
    """
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        return DoctorSchedule.objects.filter(doctor_id=doctor_id)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_availability(request, doctor_id):
    """
    Get doctor's availability for a specific date range
    """
    serializer = DoctorAvailabilitySerializer(data=request.query_params)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    start_date = data['start_date']
    end_date = data.get('end_date', start_date)
    
    doctor = get_object_or_404(CustomUser, id=doctor_id, user_type='doctor')
    
    availability = []
    current_date = start_date
    
    while current_date <= end_date:
        day_of_week = current_date.weekday()
        
        # Get doctor's schedule for this day
        schedule = DoctorSchedule.objects.filter(
            doctor=doctor,
            day_of_week=day_of_week
        ).first()
        
        # Check if doctor has a day off
        day_off = DoctorDayOff.objects.filter(
            doctor=doctor,
            date=current_date
        ).first()
        
        day_data = {
            'date': current_date.isoformat(),
            'day_name': current_date.strftime('%A'),
            'is_available': False,
            'slots': [],
            'reason_unavailable': None
        }
        
        if day_off:
            day_data['reason_unavailable'] = day_off.reason or 'Day off'
        elif schedule and schedule.is_working_day:
            day_data['is_available'] = True
            day_data['slots'] = schedule.get_available_slots(current_date)
            day_data['working_hours'] = {
                'start': schedule.start_time.strftime('%H:%M'),
                'end': schedule.end_time.strftime('%H:%M')
            }
        else:
            day_data['reason_unavailable'] = 'Not a working day'
        
        availability.append(day_data)
        current_date += timedelta(days=1)
    
    return Response({
        'doctor': DoctorSerializer(doctor).data,
        'availability': availability
    })


class BookAppointmentView(generics.CreateAPIView):
    """
    Book an appointment with a doctor
    """
    serializer_class = BookAppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        try:
            print(f"BookAppointmentView - User: {request.user}")
            print(f"BookAppointmentView - Data: {request.data}")
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print(f"BookAppointmentView - Error: {e}")
            import traceback
            traceback.print_exc()
            raise


class PatientAppointmentsView(generics.ListAPIView):
    """
    Get all appointments for the current patient
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'patient':
            return Appointment.objects.none()
        
        status_filter = self.request.query_params.get('status', None)
        queryset = Appointment.objects.filter(patient=user)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-appointment_date', '-appointment_time')


class DoctorAppointmentsView(generics.ListAPIView):
    """
    Get all appointments for the current doctor
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'doctor':
            return Appointment.objects.none()
        
        status_filter = self.request.query_params.get('status', None)
        date_filter = self.request.query_params.get('date', None)
        
        queryset = Appointment.objects.filter(doctor=user)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if date_filter:
            try:
                filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                queryset = queryset.filter(appointment_date=filter_date)
            except ValueError:
                pass
        
        return queryset.order_by('appointment_date', 'appointment_time')


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or cancel a specific appointment
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return Appointment.objects.filter(doctor=user)
        return Appointment.objects.none()
    
    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        
        # Only allow status updates for doctors, and notes updates
        if request.user.user_type == 'doctor':
            allowed_fields = ['status', 'doctor_notes']
        else:
            allowed_fields = ['notes']
        
        # Filter request data to only include allowed fields
        filtered_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        serializer = self.get_serializer(appointment, data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """
        Cancel an appointment (soft delete by changing status)
        """
        appointment = self.get_object()
        
        if not appointment.can_be_cancelled():
            return Response(
                {'error': 'Appointment cannot be cancelled. It\'s either too close to the appointment time or already completed/cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        appointment.status = 'cancelled'
        appointment.save()
        
        return Response({'message': 'Appointment cancelled successfully'})


# Views for doctors to manage their schedule (optional)
class DoctorScheduleManageView(generics.ListCreateAPIView):
    """
    Manage doctor's schedule (for doctors only)
    """
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'doctor':
            return DoctorSchedule.objects.none()
        return DoctorSchedule.objects.filter(doctor=user)
    
    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)


class DoctorDayOffView(generics.ListCreateAPIView):
    """
    Manage doctor's days off (for doctors only)
    """
    serializer_class = DoctorDayOffSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'doctor':
            return DoctorDayOff.objects.none()
        return DoctorDayOff.objects.filter(doctor=user)
    
    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)
