from rest_framework import serializers
from django.contrib.auth.models import User
from ams.models import *


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = [
            "id",
            "label",
            "key",
        ]
        depth = 2


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = [
            "id",
            "label",
            "key",
            "icon",
            "children",
        ]
        depth = 2


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "cat_name",
        ]


class OptionSerializer(serializers.ModelSerializer):
    opt_category = serializers.ReadOnlyField(source="opt_category.cat_name")

    class Meta:
        model = Option
        fields = [
            "opt_name",
            "opt_category",
            "opt_value",
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "empID",
            "username",
            "email",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = [
            "id",
            "shift_name",
            "shift_from",
            "shift_to",
        ]


class ScheduleSerializer(serializers.ModelSerializer):
    sched_sun = serializers.ReadOnlyField(source="sched_sun.shift_name")
    sched_mon = serializers.ReadOnlyField(source="sched_mon.shift_name")
    sched_tue = serializers.ReadOnlyField(source="sched_tue.shift_name")
    sched_wed = serializers.ReadOnlyField(source="sched_wed.shift_name")
    sched_thu = serializers.ReadOnlyField(source="sched_thu.shift_name")
    sched_fri = serializers.ReadOnlyField(source="sched_fri.shift_name")
    sched_sat = serializers.ReadOnlyField(source="sched_sat.shift_name")

    class Meta:
        model = Schedule
        fields = [
            "id",
            "sched_name",
            "sched_sun",
            "sched_mon",
            "sched_tue",
            "sched_wed",
            "sched_thu",
            "sched_fri",
            "sched_sat",
        ]


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            "emp_id",
            "emp_name",
            "emp_bdate",
            "emp_nation",
            "emp_address",
            "emp_email",
            "emp_phone",
            "emp_hired",
            "emp_position",
            "emp_salary",
            "emp_sched",
        ]


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = [
            "emp_id",
            "attend_date",
            "attend_checkin",
            "attend_checkout",
            "attend_latein",
            "attend_earlyout",
            "attend_work",
            "attend_req",
            "attend_under",
            "attend_over",
            "attend_excuse",
            "attend_status",
        ]


class VacationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacation
        fields = [
            "emp_id",
            "vac_type",
            "vac_start",
            "vac_end",
            "vac_reason",
            "vac_attachment",
            "vac_total",
        ]


class ExcuseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Excuse
        fields = [
            "emp_id",
            "exc_date",
            "exc_start",
            "exc_end",
            "exc_reason",
            "exc_total",
        ]


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            "id",
            "item_code",
            "item_name",
            "item_category",
            "item_location",
            "item_measurement",
            "item_reorder",
            "item_onhand",
            "item_cost",
            "item_description",
        ]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "trans_id",
            "trans_type",
            "trans_action",
            "trans_date",
            "trans_user",
            "trans_detail",
        ]
