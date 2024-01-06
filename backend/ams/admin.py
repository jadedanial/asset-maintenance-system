from django.contrib import admin
from .models import *


class SectionAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
        "key",
    )
    list_display = ("label",)
    list_filter = ("label",)
    search_fields = ("label",)


class ModuleAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
        "key",
    )
    list_display = (
        "label",
        "icon",
    )
    list_filter = (
        "label",
        "icon",
    )
    search_fields = (
        "label",
        "icon",
    )


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("cat_name",)
    list_filter = ("cat_name",)
    search_fields = ("cat_name",)


class OptionAdmin(admin.ModelAdmin):
    list_display = (
        "opt_name",
        "opt_category",
        "opt_value",
    )
    list_filter = (
        "opt_name",
        "opt_category",
        "opt_value",
    )
    search_fields = (
        "opt_name",
        "opt_category",
        "opt_value",
    )


class BranchAdmin(admin.ModelAdmin):
    list_display = (
        "branch_name",
        "branch_category",
        "branch_type",
    )
    list_filter = (
        "branch_name",
        "branch_category",
        "branch_type",
    )
    search_fields = (
        "branch_name",
        "branch_category",
        "branch_type",
    )


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "empID",
        "username",
        "email",
    )
    list_filter = (
        "empID",
        "username",
        "email",
    )
    search_fields = (
        "empID",
        "username",
        "email",
    )


class ShiftAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
        "shift_description",
    )
    list_display = (
        "shift_name",
        "shift_description",
        "shift_from",
        "shift_to",
    )
    list_filter = (
        "shift_name",
        "shift_description",
        "shift_from",
        "shift_to",
    )
    search_fields = (
        "shift_name",
        "shift_description",
        "shift_from",
        "shift_to",
    )


class ScheduleAdmin(admin.ModelAdmin):
    readonly_fields = ("id",)
    list_display = (
        "sched_name",
        "sched_sun",
        "sched_mon",
        "sched_tue",
        "sched_wed",
        "sched_thu",
        "sched_fri",
        "sched_sat",
    )
    list_filter = (
        "sched_name",
        "sched_sun",
        "sched_mon",
        "sched_tue",
        "sched_wed",
        "sched_thu",
        "sched_fri",
        "sched_sat",
    )
    search_fields = (
        "sched_name",
        "sched_sun",
        "sched_mon",
        "sched_tue",
        "sched_wed",
        "sched_thu",
        "sched_fri",
        "sched_sat",
    )


class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
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
        "emp_branch",
        "emp_sched",
    )
    list_filter = (
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
        "emp_branch",
        "emp_sched",
    )
    search_fields = (
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
        "emp_branch",
        "emp_sched",
    )


class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
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
    )
    list_filter = (
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
    )
    search_fields = (
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
    )


class VacationAdmin(admin.ModelAdmin):
    list_display = (
        "emp_id",
        "vac_type",
        "vac_start",
        "vac_end",
        "vac_reason",
        "vac_attachment",
        "vac_total",
    )
    list_filter = (
        "emp_id",
        "vac_type",
        "vac_start",
        "vac_end",
        "vac_reason",
        "vac_attachment",
        "vac_total",
    )
    search_fields = (
        "emp_id",
        "vac_type",
        "vac_start",
        "vac_end",
        "vac_reason",
        "vac_attachment",
        "vac_total",
    )


class ExcuseAdmin(admin.ModelAdmin):
    list_display = (
        "emp_id",
        "exc_date",
        "exc_start",
        "exc_end",
        "exc_reason",
        "exc_total",
    )
    list_filter = (
        "emp_id",
        "exc_date",
        "exc_start",
        "exc_end",
        "exc_reason",
        "exc_total",
    )
    search_fields = (
        "emp_id",
        "exc_date",
        "exc_start",
        "exc_end",
        "exc_reason",
        "exc_total",
    )


class WarehouseAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "warehouse_branch":
            kwargs["queryset"] = Branch.objects.filter(
                branch_category='warehouse')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    readonly_fields = (
        "id",
    )
    list_display = (
        "warehouse_code",
        "warehouse_name",
        "warehouse_branch",
    )
    list_filter = (
        "warehouse_code",
        "warehouse_name",
        "warehouse_branch",
    )
    search_fields = (
        "warehouse_code",
        "warehouse_name",
        "warehouse_branch",
    )


class ItemAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
        "item_code",
    )
    list_display = (
        "item_code",
        "item_name",
        "item_category",
        "item_measurement",
        "item_reorder",
        "item_cost",
        "item_description",
    )
    list_filter = (
        "item_code",
        "item_name",
        "item_category",
        "item_measurement",
        "item_reorder",
        "item_cost",
        "item_description",
    )
    search_fields = (
        "item_code",
        "item_name",
        "item_category",
        "item_measurement",
        "item_reorder",
        "item_cost",
        "item_description",
    )


class WarehouseItemAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
    )
    list_display = (
        "item_code",
        "warehouse_code",
        "item_location",
        "item_onhand",
    )
    list_filter = (
        "item_code",
        "warehouse_code",
        "item_location",
        "item_onhand",
    )
    search_fields = (
        "item_code",
        "warehouse_code",
        "item_location",
        "item_onhand",
    )


class VehicleAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
    )
    list_display = (
        "vehicle_code",
        "vehicle_type",
        "vehicle_model",
        "vehicle_serial",
        "vehicle_plate",
        "vehicle_area",
        "vehicle_sector",
        "vehicle_status",
    )
    list_filter = (
        "vehicle_code",
        "vehicle_type",
        "vehicle_model",
        "vehicle_serial",
        "vehicle_plate",
        "vehicle_area",
        "vehicle_sector",
        "vehicle_status",
    )
    search_fields = (
        "vehicle_code",
        "vehicle_type",
        "vehicle_model",
        "vehicle_serial",
        "vehicle_plate",
        "vehicle_area",
        "vehicle_sector",
        "vehicle_status",
    )


class TransactionAdmin(admin.ModelAdmin):
    readonly_fields = (
        "trans_id",
        "trans_type",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
    )
    list_display = (
        "trans_id",
        "trans_type",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
    )
    list_filter = (
        "trans_id",
        "trans_type",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
    )
    search_fields = (
        "trans_id",
        "trans_type",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
    )


admin.site.register(Section, SectionAdmin)
admin.site.register(Module, ModuleAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Option, OptionAdmin)
admin.site.register(Branch, BranchAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(Vacation, VacationAdmin)
admin.site.register(Excuse, ExcuseAdmin)
admin.site.register(Warehouse, WarehouseAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(WarehouseItem, WarehouseItemAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Transaction, TransactionAdmin)
