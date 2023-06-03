from rest_framework import serializers
from django.contrib.auth.models import User
from ams.models import *

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'label', 'key',]
        depth = 2

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'label', 'key', 'icon', 'children',]
        depth = 2

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['empID', 'username', 'email', 'password',]
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['id', 'shift_name', 'shift_from', 'shift_to',]

class ScheduleSerializer(serializers.ModelSerializer):
    sched_sun = serializers.ReadOnlyField(source='sched_sun.shift_name')
    sched_mon = serializers.ReadOnlyField(source='sched_mon.shift_name')
    sched_tue = serializers.ReadOnlyField(source='sched_tue.shift_name')
    sched_wed = serializers.ReadOnlyField(source='sched_wed.shift_name')
    sched_thu = serializers.ReadOnlyField(source='sched_thu.shift_name')
    sched_fri = serializers.ReadOnlyField(source='sched_fri.shift_name')
    sched_sat = serializers.ReadOnlyField(source='sched_sat.shift_name')

    class Meta:
        model = Schedule
        fields = ['id', 'sched_name', 'sched_sun', 'sched_mon', 'sched_tue', 'sched_wed', 'sched_thu', 'sched_fri', 'sched_sat',]

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['emp_id', 'emp_name', 'emp_bdate', 'emp_nation', 'emp_email', 'emp_phone', 'emp_address', 'emp_hired', 'emp_position', 'emp_salary', 'emp_sched',]

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['emp_id', 'attend_date', 'attend_checkin', 'attend_checkout', 'attend_latein', 'attend_earlyout', 'attend_work', 'attend_req', 'attend_under', 'attend_over', 'attend_excuse', 'attend_status',]

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['asset_id', 'asset_model', 'asset_sector', 'asset_area', 'asset_serial', 'asset_plate',]

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ['id', 'req_id', 'asset_id', 'req_createby', 'req_checkby', 'req_date', 'req_workshop', 'req_physloc', 'req_status', 'req_maint', 'req_repair', 'req_km', 'req_enghr', 'req_fuel', 'req_desc',]

class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = ['nationality',]

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['position',]

class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = ['salary',]