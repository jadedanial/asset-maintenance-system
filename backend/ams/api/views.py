from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
import jwt, datetime
from ams.models import *
from .serializers import *

class SectionListView(ListAPIView):

    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class ModuleListView(ListAPIView):

    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            payload = jwt.decode(token, 'secret', algorithms = ['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        user = User.objects.filter(id = payload['id']).first()
        serializer = UserSerializer(user)
    
        return Response(serializer.data)

class RegisterView(APIView):

    def post(self, request):
        serializer = UserSerializer(data = request.data)
        empid = User.objects.filter(empID = request.data['empID']).first()
        employeeID = Employee.objects.filter(emp_id = request.data['empID']).first()
        user = User.objects.filter(username = request.data['username']).first()
        email = User.objects.filter(email = request.data['email']).first()
        password = request.data['password']

        if empid:
            raise ValidationError('User already exist!')
        
        if not employeeID:
            raise ValidationError('Employee ID not exist!')

        if user:
            raise ValidationError('User already exist!')
        
        if email:
            raise ValidationError('User already exist!')
        
        if len(password) < 8:
            raise ValidationError('Password too short!')

        serializer.is_valid(raise_exception = True)
        serializer.save()

        return Response(serializer.data)

class LoginView(APIView):

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = User.objects.filter(username = username).first()

        if user is None:
            raise AuthenticationFailed('Unauthenticated')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Unauthenticated')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes = 60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm = 'HS256')
        response = Response()
        response.set_cookie(key = 'jwt', value = token, httponly = True)
        response.data = {
            'jwt': token
        }

        return response

class LogoutView(APIView):

    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'Success!'
        }

        return response

class ShiftListView(ListAPIView):

    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer

class ScheduleListView(ListAPIView):

    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class EmployeeView(APIView):

    def post(self, request):
        serializer = EmployeeSerializer(data = request.data)

        serializer.is_valid(raise_exception = True)
        serializer.save()

        return Response(serializer.data)

class EmployeeListView(ListAPIView):

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class EmployeeScheduleView(APIView):

    def patch(self, request, *args, **kwargs):
        emp_object = Employee.objects.filter(emp_id = request.data['empID']).first()
        sched_object = Schedule.objects.filter(id = request.data['schedid']).first()
        data = request.data

        emp_object.emp_sched = Schedule(id = data.get('schedid', sched_object.id))
        emp_object.save()
        serializer = EmployeeSerializer(emp_object)

        return Response(serializer.data)

class AttendanceListView(ListAPIView):

    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class EmployeeAttendance(APIView):

    def post(self, request):
        serializer = AttendanceSerializer(data = request.data)

        serializer.is_valid(raise_exception = True)
        serializer.save()

        return Response(serializer.data)
    
    def patch(self, request, *args, **kwargs):
        attend_object = Attendance.objects.filter(emp_id = request.data['emp_id'], attend_date = request.data['attend_date']).first()
        serializer = AttendanceSerializer(attend_object, data = request.data)

        serializer.is_valid(raise_exception = True)
        serializer.save()

        return Response(serializer.data)

class AssetListView(ListAPIView):

    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

class NationalityListView(ListAPIView):

    queryset = Nationality.objects.all()
    serializer_class = NationalitySerializer

class PositionListView(ListAPIView):

    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class SalaryListView(ListAPIView):

    queryset = Salary.objects.all()
    serializer_class = SalarySerializer

class CategoryListView(ListAPIView):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MeasurementListView(ListAPIView):

    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer

class ItemView(APIView):

    def post(self, request):
        serializer = ItemSerializer(data = request.data)
        item = Item.objects.filter(item_name = request.data['item_name']).first()

        if item:
            raise ValidationError('Item already exist!')

        serializer.is_valid(raise_exception = True)
        serializer.save()

        return Response(serializer.data)

class ItemListView(ListAPIView):

    queryset = Item.objects.all()
    serializer_class = ItemSerializer