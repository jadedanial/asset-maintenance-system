from django.urls import path
from . import views
from .views import *

from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"api-doc", APIDocView, basename="api-doc")


urlpatterns = [
    path("", views.index, name="index"),
    path("", include(router.urls)),
    path("user", UserView.as_view()),
    path("register", RegisterView.as_view()),
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("components", ComponentListView.as_view()),
    path("modules", ModuleListView.as_view()),
    path("categories", CategoryListView.as_view()),
    path("options", OptionListView.as_view()),
    path("branches", BranchListView.as_view()),
    path("sections", SectionListView.as_view()),
    path("shift", ShiftView.as_view()),
    path("shifts", ShiftListView.as_view()),
    path("schedule", ScheduleView.as_view()),
    path("schedules", ScheduleListView.as_view()),
    path("employee", EmployeeView.as_view()),
    path("employees", EmployeeListView.as_view()),
    path("emp_schedule", EmployeeScheduleView.as_view()),
    path("emp_attendance", EmployeeAttendanceView.as_view()),
    path("attendances", AttendanceListView.as_view()),
    path("vacation", VacationView.as_view()),
    path("vacations", VacationListView.as_view()),
    path("excuse", ExcuseView.as_view()),
    path("excuses", ExcuseListView.as_view()),
    path("item", ItemView.as_view()),
    path("items", ItemListView.as_view()),
    path("warehouseitem", WarehouseItemView.as_view()),
    path("warehouseitemupdate", WarehouseItemUpdateView.as_view()),
    path("warehouseitems", WarehouseItemListView.as_view()),
    path("assets", AssetListView.as_view()),
    path("transaction", TransactionView.as_view()),
    path("transactions", TransactionListView.as_view()),
]
