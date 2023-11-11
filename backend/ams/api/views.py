from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
import jwt, datetime
from .permissions import IsAuthenticatedWithJWT
from ams.models import *
from .serializers import *


class SectionListView(ListAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class ModuleListView(ListAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedWithJWT]


class OptionListView(ListAPIView):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)

        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request):

        if (not request.data["empID"].isnumeric()):
            raise ValidationError("Employee ID not exist!")
           
        serializer = UserSerializer(data=request.data)
        empid = User.objects.filter(empID=request.data["empID"]).first()
        employeeID = Employee.objects.filter(emp_id=request.data["empID"]).first()
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
        username = request.data["username"]
        password = request.data["password"]
        user = User.objects.filter(username=username).first()

        if user is None:
            raise AuthenticationFailed("Unauthenticated")

        if not user.check_password(password):
            raise AuthenticationFailed("Unauthenticated")

        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=120),
            "iat": datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, "secret", algorithm="HS256")
        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=False)
        response.data = {"jwt": token}

        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "Success!"}

        return response


class ShiftListView(ListAPIView):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class ScheduleListView(ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class EmployeeView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

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
    permission_classes = [IsAuthenticatedWithJWT]


class EmployeeScheduleView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def patch(self, request, *args, **kwargs):
        data = request.data
        emp_object = Employee.objects.filter(emp_id=request.data["empID"]).first()
        sched_object = Schedule.objects.filter(id=request.data["schedid"]).first()

        emp_object.emp_sched = Schedule(id=data.get("schedid", sched_object.id))
        emp_object.save()
        serializer = EmployeeSerializer(emp_object)

        return Response(serializer.data)


class EmployeeAttendance(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

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
    permission_classes = [IsAuthenticatedWithJWT]


class VacationView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def post(self, request):
        serializer = VacationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class VacationListView(ListAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class ExcuseView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def post(self, request):
        serializer = ExcuseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ExcuseListView(ListAPIView):
    queryset = Excuse.objects.all()
    serializer_class = ExcuseSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class ItemView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        name = Item.objects.filter(item_name__iexact=request.data["item_name"]).first()

        if name:
            raise ValidationError("Item name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        code = Item.objects.filter(item_code=request.data["item_code"]).first()
        name = Item.objects.filter(item_name__iexact=request.data["item_name"]).first()
        serializer = ItemSerializer(code, data=request.data)

        if name:
            if str(name.item_code) != str(code.item_code):
                raise ValidationError("Item name already exist!")

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        data = request.data
        for item in data:
            code = Item.objects.filter(item_code=item["item_code"]).first()
            code.item_onhand += item["item_onhand"]
            code.save()

        return Response(data)


class ItemListView(ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedWithJWT]


class TransactionView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)


class TransactionListView(ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticatedWithJWT]
