from rest_framework import serializers
from django.contrib.auth.models import User
from ams.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "userid",
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


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
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
    opt_category = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        slug_field='cat_name'
    )

    class Meta:
        model = Option
        fields = [
            "opt_name",
            "opt_category",
            "opt_value",
        ]


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = [
            "branch_name",
        ]


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = [
            "section_code",
            "section_branch",
            "section_type",
            "section_category",
        ]


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = [
            "id",
            "shift_name",
            "shift_description",
            "shift_from",
            "shift_to",
        ]


class ScheduleSerializer(serializers.ModelSerializer):
    sched_sun = serializers.SlugRelatedField(
        queryset=Shift.objects.all(),
        slug_field='shift_description'
    )
    sched_mon = serializers.SlugRelatedField(
        queryset=Shift.objects.all(),
        slug_field='shift_description'
    )
    sched_tue = serializers.SlugRelatedField(
        queryset=Shift.objects.all(),
        slug_field='shift_description'
    )
    sched_wed = serializers.SlugRelatedField(
        queryset=Shift.objects.all(),
        slug_field='shift_description'
    )
    sched_thu = serializers.SlugRelatedField(
        queryset=Shift.objects.all(),
        slug_field='shift_description'
    )
    sched_fri = serializers.SlugRelatedField(
        queryset=Shift.objects.all(),
        slug_field='shift_description'
    )
    sched_sat = serializers.SlugRelatedField(
        queryset=Shift.objects.all(),
        slug_field='shift_description'
    )

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
    emp_section = serializers.SlugRelatedField(
        queryset=Section.objects.all(),
        slug_field='section_code'
    )

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
            "emp_section",
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
            "item_measurement",
            "item_reorder",
            "item_cost",
            "item_description",
        ]


class WarehouseItemSerializer(serializers.ModelSerializer):
    item_code = serializers.SlugRelatedField(
        queryset=Item.objects.all(),
        slug_field='item_code'
    )
    warehouse_code = serializers.SlugRelatedField(
        queryset=Section.objects.all(),
        slug_field='section_code'
    )

    class Meta:
        model = WarehouseItem
        fields = [
            "item_code",
            "warehouse_code",
            "item_location",
            "item_onhand",
        ]


class AssetSerializer(serializers.ModelSerializer):
    asset_area = serializers.SlugRelatedField(
        queryset=Branch.objects.all(),
        slug_field='branch_name'
    )

    class Meta:
        model = Asset
        fields = [
            "id",
            "asset_code",
            "asset_category",
            "asset_type",
            "asset_model",
            "asset_serial",
            "asset_plate",
            "asset_area",
            "asset_sector",
            "asset_status",
            "asset_purchased",
        ]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "trans_code",
            "trans_action",
            "trans_date",
            "trans_user",
            "trans_detail",
            "trans_status",
        ]


class WorkorderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workorder
        fields = [
            "work_code",
            "asset_code",
            "asset_kilo",
            "work_date",
            "work_type",
            "work_status",
            "workshop_code",
            "recep_tech",
            "recep_sched",
            "recep_supv",
            "recep_diagnosis",
        ]


class OperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operation
        fields = [
            "op_code",
            "op_description",
            "op_hours",
            "op_item",
            "op_restriction",
        ]


class OperationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationType
        fields = [
            "op_type",
            "op_rate",
        ]


class WorkorderOperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkorderOperation
        fields = [
            "op_code",
            "work_code",
            "op_sched",
            "op_supv",
            "op_type",
        ]


class OperationTechnicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationTechnician
        fields = [
            "op_code",
            "work_code",
            "op_tech",
            "op_rate",
            "op_hours",
            "tech_hours",
            "total_cost",
        ]


class OperationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationItem
        fields = [
            "op_code",
            "work_code",
            "item_code",
            "item_cost",
            "item_quantity",
            "total_cost",
        ]
