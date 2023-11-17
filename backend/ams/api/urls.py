from django.urls import path
from .views import *

urlpatterns = [
    path("sections", SectionListView.as_view()),
    path("modules", ModuleListView.as_view()),
    path("categories", CategoryListView.as_view()),
    path("options", OptionListView.as_view()),
    path("users", UserView.as_view()),
    path("register/", RegisterView.as_view()),
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("shifts", ShiftListView.as_view()),
    path("shift/", ShiftView.as_view()),
    path("schedules", ScheduleListView.as_view()),
    path("employee/", EmployeeView.as_view()),
    path("employees", EmployeeListView.as_view()),
    path("emp_schedule/", EmployeeScheduleView.as_view()),
    path("emp_attendance/", EmployeeAttendance.as_view()),
    path("attendances", AttendanceListView.as_view()),
    path("vacation/", VacationView.as_view()),
    path("vacations", VacationListView.as_view()),
    path("excuse/", ExcuseView.as_view()),
    path("excuses", ExcuseListView.as_view()),
    path("item/", ItemView.as_view()),
    path("items", ItemListView.as_view()),
    path("transaction/", TransactionView.as_view()),
    path("transactions", TransactionView.as_view()),
]
