from django.urls import path
from .views import *

urlpatterns = [
    path("section", SectionListView.as_view()),
    path("module", ModuleListView.as_view()),
    path("category", CategoryListView.as_view()),
    path("option", OptionListView.as_view()),
    path("user", UserView.as_view()),
    path("register/", RegisterView.as_view()),
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("shift", ShiftListView.as_view()),
    path("schedule", ScheduleListView.as_view()),
    path("employee/", EmployeeView.as_view()),
    path("employees", EmployeeListView.as_view()),
    path("emp_schedule/", EmployeeScheduleView.as_view()),
    path("emp_attendance/", EmployeeAttendance.as_view()),
    path("attendance", AttendanceListView.as_view()),
    path("vacation/", VacationView.as_view()),
    path("item/", ItemView.as_view()),
    path("items", ItemListView.as_view()),
]
