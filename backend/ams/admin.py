from django.contrib import admin
from .models import *

class SectionAdmin(admin.ModelAdmin):

	readonly_fields = ('id', 'key',)
	list_display = ('label',)
	list_filter = ('label',)
	search_fields = ('label',)

class ModuleAdmin(admin.ModelAdmin):

	readonly_fields = ('id', 'key',)
	list_display = ('label', 'icon',)
	list_filter = ('label', 'icon',)
	search_fields = ('label', 'icon',)

class UserAdmin(admin.ModelAdmin):

	list_display = ('empID', 'username', 'email',)
	list_filter = ('empID', 'username', 'email',)
	search_fields = ('empID', 'username', 'email',)

class ShiftAdmin(admin.ModelAdmin):

	readonly_fields = ('id', 'shift_name',)
	list_display = ('shift_name', 'shift_from', 'shift_to',)
	list_filter = ('shift_name', 'shift_from', 'shift_to',)
	search_fields = ('shift_name', 'shift_from', 'shift_to',)

class ScheduleAdmin(admin.ModelAdmin):

	readonly_fields = ('id',)
	list_display = ('sched_name', 'sched_sun', 'sched_mon', 'sched_tue', 'sched_wed', 'sched_thu', 'sched_fri', 'sched_sat',)
	list_filter = ('sched_name', 'sched_sun', 'sched_mon', 'sched_tue', 'sched_wed', 'sched_thu', 'sched_fri', 'sched_sat',)
	search_fields = ('sched_name', 'sched_sun', 'sched_mon', 'sched_tue', 'sched_wed', 'sched_thu', 'sched_fri', 'sched_sat',)

class EmployeeAdmin(admin.ModelAdmin):

	list_display = ('emp_id', 'emp_name', 'emp_bdate', 'emp_nation', 'emp_email', 'emp_phone', 'emp_address', 'emp_hired', 'emp_position', 'emp_salary', 'emp_sched',)
	list_filter = ('emp_id', 'emp_name', 'emp_bdate', 'emp_nation', 'emp_email', 'emp_phone', 'emp_address', 'emp_hired', 'emp_position', 'emp_salary', 'emp_sched',)
	search_fields = ('emp_id', 'emp_name', 'emp_bdate', 'emp_nation', 'emp_email', 'emp_phone', 'emp_address', 'emp_hired', 'emp_position', 'emp_salary', 'emp_sched',)

class AttendanceAdmin(admin.ModelAdmin):

	list_display = ('emp_id', 'attend_date', 'attend_checkin', 'attend_checkout', 'attend_latein', 'attend_earlyout', 'attend_work', 'attend_req', 'attend_under', 'attend_over', 'attend_excuse', 'attend_status',)
	list_filter = ('emp_id', 'attend_date', 'attend_checkin', 'attend_checkout', 'attend_latein', 'attend_earlyout', 'attend_work', 'attend_req', 'attend_under', 'attend_over', 'attend_excuse', 'attend_status',)
	search_fields = ('emp_id', 'attend_date', 'attend_checkin', 'attend_checkout', 'attend_latein', 'attend_earlyout', 'attend_work', 'attend_req', 'attend_under', 'attend_over', 'attend_excuse', 'attend_status',)

class AssetAdmin(admin.ModelAdmin):

	list_display = ('asset_id', 'asset_model', 'asset_sector', 'asset_area', 'asset_serial', 'asset_plate',)
	list_filter = ('asset_id', 'asset_model', 'asset_sector', 'asset_area', 'asset_serial', 'asset_plate',)
	search_fields = ('asset_id', 'asset_model', 'asset_sector', 'asset_area', 'asset_serial', 'asset_plate',)

class RequestAdmin(admin.ModelAdmin):

	readonly_fields = ('id', 'req_id')
	list_display = ('asset_id', 'req_createby', 'req_checkby', 'req_date', 'req_workshop', 'req_physloc', 'req_status', 'req_maint', 'req_repair', 'req_km', 'req_enghr', 'req_fuel', 'req_desc',)
	list_filter = ('asset_id', 'req_createby', 'req_checkby', 'req_date', 'req_workshop', 'req_physloc', 'req_status', 'req_maint', 'req_repair', 'req_km', 'req_enghr', 'req_fuel', 'req_desc',)
	search_fields = ('asset_id', 'req_createby', 'req_checkby', 'req_date', 'req_workshop', 'req_physloc', 'req_status', 'req_maint', 'req_repair', 'req_km', 'req_enghr', 'req_fuel', 'req_desc',)

class NationalityAdmin(admin.ModelAdmin):

	list_display = ('nationality',)
	list_filter = ('nationality',)
	search_fields = ('nationality',)

class PositionAdmin(admin.ModelAdmin):

	list_display = ('position',)
	list_filter = ('position',)
	search_fields = ('position',)

class SalaryAdmin(admin.ModelAdmin):

	list_display = ('salary',)
	list_filter = ('salary',)
	search_fields = ('salary',)

class ItemAdmin(admin.ModelAdmin):

	readonly_fields = ('id', 'item_code',)
	list_display = ('item_name', 'item_category', 'item_location', 'item_measurement', 'item_reorder', 'item_onhand', 'item_cost', 'item_description',)
	list_filter = ('item_name', 'item_category', 'item_location', 'item_measurement', 'item_reorder', 'item_onhand', 'item_cost', 'item_description',)
	search_fields = ('item_name', 'item_category', 'item_location', 'item_measurement', 'item_reorder', 'item_onhand', 'item_cost', 'item_description',)

admin.site.register(Section, SectionAdmin)
admin.site.register(Module, ModuleAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(Asset, AssetAdmin)
admin.site.register(Request, RequestAdmin)
admin.site.register(Nationality, NationalityAdmin)
admin.site.register(Position, PositionAdmin)
admin.site.register(Salary, SalaryAdmin)
admin.site.register(Item, ItemAdmin)
