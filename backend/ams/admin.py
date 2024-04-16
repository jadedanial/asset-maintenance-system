from django.contrib import admin
from .models import *


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "userid",
        "username",
        "email",
    )
    list_filter = (
        "userid",
        "username",
        "email",
    )
    search_fields = (
        "userid",
        "username",
        "email",
    )


class ComponentAdmin(admin.ModelAdmin):
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
    )
    list_filter = (
        "branch_name",
    )
    search_fields = (
        "branch_name",
    )


class SectionAdmin(admin.ModelAdmin):
    list_display = (
        "section_code",
        "section_branch",
        "section_type",
        "section_category",
    )
    list_filter = (
        "section_code",
        "section_branch",
        "section_type",
        "section_category",
    )
    search_fields = (
        "section_code",
        "section_branch",
        "section_type",
        "section_category",
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
        "emp_section",
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
        "emp_section",
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
        "emp_section",
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
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "warehouse_code":
            kwargs["queryset"] = Section.objects.filter(
                section_type='warehouse')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
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


class AssetAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
    )
    list_display = (
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
    )
    list_filter = (
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
    )
    search_fields = (
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
    )


class TransactionAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
    )
    readonly_fields = (
        "trans_code",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
        "trans_status",
    )
    list_display = (
        "trans_code",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
        "trans_status",
    )
    list_filter = (
        "trans_code",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
        "trans_status",
    )
    search_fields = (
        "trans_code",
        "trans_action",
        "trans_date",
        "trans_user",
        "trans_detail",
        "trans_status",
    )


class WorkorderAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "workshop_code":
            kwargs["queryset"] = Section.objects.filter(
                section_type='workshop')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    readonly_fields = (
        "id",
    )
    list_display = (
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
        "recep_remarks",
    )
    list_filter = (
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
        "recep_remarks",
    )
    search_fields = (
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
        "recep_remarks",
    )


class OperationAdmin(admin.ModelAdmin):
    list_display = (
        "op_code",
        "op_description",
        "op_hours",
        "op_item",
        "op_restriction",
    )
    list_filter = (
        "op_code",
        "op_description",
        "op_hours",
        "op_item",
        "op_restriction",
    )
    search_fields = (
        "op_code",
        "op_description",
        "op_hours",
        "op_item",
        "op_restriction",
    )


class OperationTypeAdmin(admin.ModelAdmin):
    list_display = (
        "op_type",
        "op_rate",
    )
    list_filter = (
        "op_type",
        "op_rate",
    )
    search_fields = (
        "op_type",
        "op_rate",
    )


class WorkorderOperationAdmin(admin.ModelAdmin):
    list_display = (
        "op_code",
        "work_code",
        "op_sched",
        "op_supv",
        "op_type",
    )
    list_filter = (
        "op_code",
        "work_code",
        "op_sched",
        "op_supv",
        "op_type",
    )
    search_fields = (
        "op_code",
        "work_code",
        "op_sched",
        "op_supv",
        "op_type",
    )


class OperationTechnicianAdmin(admin.ModelAdmin):
    list_display = (
        "op_code",
        "work_code",
        "op_tech",
        "op_rate",
        "op_hours",
        "tech_hours",
        "total_cost",
    )
    list_filter = (
        "op_code",
        "work_code",
        "op_tech",
        "op_rate",
        "op_hours",
        "tech_hours",
        "total_cost",
    )
    search_fields = (
        "op_code",
        "work_code",
        "op_tech",
        "op_rate",
        "op_hours",
        "tech_hours",
        "total_cost",
    )


class OperationItemAdmin(admin.ModelAdmin):
    list_display = (
        "op_code",
        "work_code",
        "item_code",
        "item_cost",
        "item_quantity",
        "total_cost",
    )
    list_filter = (
        "op_code",
        "work_code",
        "item_code",
        "item_cost",
        "item_quantity",
        "total_cost",
    )
    search_fields = (
        "op_code",
        "work_code",
        "item_code",
        "item_cost",
        "item_quantity",
        "total_cost",
    )


admin.site.register(User, UserAdmin)
admin.site.register(Component, ComponentAdmin)
admin.site.register(Module, ModuleAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Option, OptionAdmin)
admin.site.register(Branch, BranchAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(Vacation, VacationAdmin)
admin.site.register(Excuse, ExcuseAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(WarehouseItem, WarehouseItemAdmin)
admin.site.register(Asset, AssetAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Workorder, WorkorderAdmin)
admin.site.register(Operation, OperationAdmin)
admin.site.register(OperationType, OperationTypeAdmin)
admin.site.register(WorkorderOperation, WorkorderOperationAdmin)
admin.site.register(OperationTechnician, OperationTechnicianAdmin)
admin.site.register(OperationItem, OperationItemAdmin)
