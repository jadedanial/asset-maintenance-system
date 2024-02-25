from django.shortcuts import render
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from ams.models import *
from .serializers import *


def index(request):
    return render(request, "index.html")


class APIDocView(viewsets.ViewSet):
    @swagger_auto_schema(responses={200: "OK"})
    def list(self, request):
        return Response({"message": "AMS by Jade Danial (danialjade@gmail.com)"})


class ComponentListView(ListAPIView):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    permission_classes = [IsAuthenticated]


class ModuleListView(ListAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]


class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class OptionListView(ListAPIView):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticated]


class BranchListView(ListAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]


class SectionListView(ListAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]


class UserView(APIView):

    def get(self, request):
        token = request.META.get("HTTP_AUTHORIZATION")

        if not token:
            return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = token.split(" ")[1]
            token_obj = Token.objects.get(key=token)
        except Token.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"id": token_obj.user.id, "username": token_obj.user.username}, status=status.HTTP_200_OK)


class RegisterView(APIView):

    def post(self, request):
        if (not request.data["empID"].isnumeric()):
            raise ValidationError("Employee ID not exist!")

        serializer = UserSerializer(data=request.data)
        empid = User.objects.filter(empID=request.data["empID"]).first()
        employeeID = Employee.objects.filter(
            emp_id=request.data["empID"]).first()
        user = User.objects.filter(username=request.data["username"]).first()
        email = User.objects.filter(email=request.data["email"]).first()
        password = request.data["password"]

        if empid:
            raise ValidationError("User already exist!")

        if not employeeID:
            raise ValidationError("Employee ID not exist!")

        if user:
            raise ValidationError("User already exist!")

        if email:
            raise ValidationError("User already exist!")

        if len(password) < 8:
            raise ValidationError("Password too short!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class LoginView(APIView):

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({"token": token.key, "id": user.id, "user": user.username}, status=status.HTTP_200_OK)


class LogoutView(APIView):

    def post(self, request):
        token = request.META.get("HTTP_AUTHORIZATION")

        if not token:
            return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = token.split(" ")[1]
            token_obj = Token.objects.get(key=token)
            token_obj.delete()
        except Token.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


class ShiftView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ShiftSerializer(data=request.data)
        name = Shift.objects.filter(
            shift_name__iexact=request.data["shift_name"]).first()

        if name:
            raise ValidationError("Shift name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        id = Shift.objects.filter(id=request.data["id"]).first()
        name = Shift.objects.filter(
            shift_name__iexact=request.data["shift_name"]).first()
        serializer = ShiftSerializer(id, data=request.data)

        if name:
            if str(name.id) != str(id.id):
                raise ValidationError("Shift name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ShiftListView(ListAPIView):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated]


class ScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ScheduleSerializer(data=request.data)
        name = Schedule.objects.filter(
            sched_name__iexact=request.data["sched_name"]).first()

        if name:
            raise ValidationError("Schedule name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        id = Schedule.objects.filter(id=request.data["id"]).first()
        name = Schedule.objects.filter(
            sched_name__iexact=request.data["sched_name"]).first()
        serializer = ScheduleSerializer(id, data=request.data)

        if name:
            if str(name.id) != str(id.id):
                raise ValidationError("Schedule name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ScheduleListView(ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]


class EmployeeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        name = Employee.objects.filter(
            emp_name__iexact=request.data["emp_name"]
        ).first()

        if name:
            raise ValidationError("Employee name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        id = Employee.objects.filter(emp_id=request.data["emp_id"]).first()
        name = Employee.objects.filter(
            emp_name__iexact=request.data["emp_name"]
        ).first()
        serializer = EmployeeSerializer(id, data=request.data)

        if name:
            if str(name.emp_id) != str(id.emp_id):
                raise ValidationError("Employee name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class EmployeeListView(ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]


class EmployeeScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        data = request.data
        emp_object = Employee.objects.filter(
            emp_id=request.data["empID"]).first()
        sched_object = Schedule.objects.filter(
            id=request.data["schedid"]).first()

        emp_object.emp_sched = Schedule(
            id=data.get("schedid", sched_object.id))
        emp_object.save()
        serializer = EmployeeSerializer(emp_object)

        return Response(serializer.data)


class EmployeeAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        attend_object = Attendance.objects.filter(
            emp_id=request.data["emp_id"], attend_date=request.data["attend_date"]
        ).first()
        serializer = AttendanceSerializer(attend_object, data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class AttendanceListView(ListAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]


class VacationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VacationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class VacationListView(ListAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer
    permission_classes = [IsAuthenticated]


class ExcuseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExcuseSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ExcuseListView(ListAPIView):
    queryset = Excuse.objects.all()
    serializer_class = ExcuseSerializer
    permission_classes = [IsAuthenticated]


class ItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        name = Item.objects.filter(
            item_name__iexact=request.data["item_name"]).first()

        if name:
            raise ValidationError("Item name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        item = Item.objects.filter(item_code=request.data["item_code"]).first()
        name = Item.objects.filter(
            item_name__iexact=request.data["item_name"]).first()
        serializer = ItemSerializer(item, data=request.data)

        if name:
            if str(name.item_code) != str(item.item_code):
                raise ValidationError("Item name already exist!")
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ItemListView(ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]


class WarehouseItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = WarehouseItemSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        item = Item.objects.get(item_code=request.data["item_code"])
        section = Section.objects.get(
            section_code=request.data["warehouse_code"])
        warehouse_item = WarehouseItem.objects.filter(
            item_code=item, warehouse_code=section).first()
        serializer = WarehouseItemSerializer(warehouse_item, data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class WarehouseItemUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        print(request.data)
        data = request.data

        for d in data:
            item = Item.objects.get(item_code=d["item_code"])
            section = Section.objects.get(section_code=d["warehouse_code"])
            warehouse_item = WarehouseItem.objects.filter(
                item_code=item, warehouse_code=section).first()

            if warehouse_item is None:
                warehouse_item = WarehouseItem(
                    item_code=item, warehouse_code=section, item_onhand=float(d["item_onhand"]))
            else:
                warehouse_item.item_onhand += float(d["item_onhand"])

            warehouse_item.save()

        return Response(data)


class WarehouseItemListView(ListAPIView):
    queryset = WarehouseItem.objects.all()
    serializer_class = WarehouseItemSerializer
    permission_classes = [IsAuthenticated]


class VehicleListView(ListAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]


class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        transaction = Transaction.objects.filter(
            trans_code=request.data["trans_code"]).first()
        serializer = TransactionSerializer(transaction, data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class TransactionListView(ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
