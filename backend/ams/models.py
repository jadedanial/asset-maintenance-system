from django.db import models
from django.contrib.auth.models import AbstractUser


class Section(models.Model):
    id = models.AutoField(primary_key=True)
    label = models.CharField(
        max_length=50, blank=False, null=False, verbose_name="Section Label"
    )
    key = models.CharField(max_length=100, blank=True, null=True, verbose_name="Key")

    def __str__(self):
        return self.label

    def update_model(self):
        key_id = Section.objects.get(key=self.key).id
        Section.objects.filter(id=key_id).update(key=str(self.label))

    def save(self, *args, **kwargs):
        super(Section, self).save(*args, **kwargs)
        self.update_model()


class Module(models.Model):
    id = models.AutoField(primary_key=True)
    label = models.CharField(
        max_length=50, blank=False, null=False, verbose_name="Module Label"
    )
    key = models.CharField(max_length=100, blank=True, null=True, verbose_name="Key")
    icon = models.CharField(max_length=100, blank=True, null=True, verbose_name="Icon")
    children = models.ManyToManyField(Section, blank=True, verbose_name="Children")

    def __str__(self):
        return self.label

    def update_model(self):
        key_id = Module.objects.get(key=self.key).id
        Module.objects.filter(id=key_id).update(key=str(self.label))

    def save(self, *args, **kwargs):
        super(Module, self).save(*args, **kwargs)
        self.update_model()


class User(AbstractUser):
    empID = models.PositiveIntegerField(
        blank=True, null=True, verbose_name="Employee ID"
    )
    username = models.CharField(
        max_length=100, unique=True, blank=False, null=False, verbose_name="Username"
    )
    email = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Email"
    )
    password = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Password"
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username


class Shift(models.Model):
    id = models.AutoField(primary_key=True)
    shift_name = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Name"
    )
    shift_from = models.TimeField(blank=False, null=False, verbose_name="From")
    shift_to = models.TimeField(blank=False, null=False, verbose_name="To")

    def __str__(self):
        return str(self.shift_name)

    def update_model(self):
        test_id = Shift.objects.get(id=self.id).id
        Shift.objects.filter(id=test_id).update(
            shift_name=str(self.shift_from) + " To " + str(self.shift_to)
        )

    def save(self, *args, **kwargs):
        super(Shift, self).save(*args, **kwargs)
        self.update_model()


class Schedule(models.Model):
    id = models.AutoField(primary_key=True)
    sched_name = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Name"
    )
    sched_sun = models.ForeignKey(
        Shift,
        blank=False,
        null=False,
        related_name="sched_sun",
        on_delete=models.CASCADE,
        verbose_name="Sunday",
    )
    sched_mon = models.ForeignKey(
        Shift,
        blank=False,
        null=False,
        related_name="sched_mon",
        on_delete=models.CASCADE,
        verbose_name="Monday",
    )
    sched_tue = models.ForeignKey(
        Shift,
        blank=False,
        null=False,
        related_name="sched_tue",
        on_delete=models.CASCADE,
        verbose_name="Tuesday",
    )
    sched_wed = models.ForeignKey(
        Shift,
        blank=False,
        null=False,
        related_name="sched_wed",
        on_delete=models.CASCADE,
        verbose_name="Wednesday",
    )
    sched_thu = models.ForeignKey(
        Shift,
        blank=False,
        null=False,
        related_name="sched_thu",
        on_delete=models.CASCADE,
        verbose_name="Thurdsay",
    )
    sched_fri = models.ForeignKey(
        Shift,
        blank=False,
        null=False,
        related_name="sched_fri",
        on_delete=models.CASCADE,
        verbose_name="Friday",
    )
    sched_sat = models.ForeignKey(
        Shift,
        blank=False,
        null=False,
        related_name="sched_sat",
        on_delete=models.CASCADE,
        verbose_name="Satuday",
    )

    def __str__(self):
        return str(self.sched_name)


class Employee(models.Model):
    emp_id = models.AutoField(primary_key=True, verbose_name="Employee ID")
    emp_name = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Name"
    )
    emp_bdate = models.DateField(blank=True, null=True, verbose_name="Birthdate")
    emp_nation = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Nationality"
    )
    emp_email = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Email"
    )
    emp_phone = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Phone"
    )
    emp_address = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Address"
    )
    emp_hired = models.DateField(blank=True, null=True, verbose_name="Date Hired")
    emp_position = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Position"
    )
    emp_salary = models.FloatField(blank=True, null=True, verbose_name="Monthly Salary")
    emp_sched = models.ForeignKey(
        Schedule,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name="Schedule",
    )

    def __str__(self):
        return str(self.emp_id)


class Attendance(models.Model):
    emp_id = models.ForeignKey(
        Employee,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        verbose_name="Employee ID",
    )
    attend_date = models.DateField(blank=False, null=False, verbose_name="Date")
    attend_checkin = models.TimeField(blank=True, null=True, verbose_name="Check In")
    attend_checkout = models.TimeField(blank=True, null=True, verbose_name="Check Out")
    attend_latein = models.FloatField(blank=True, null=True, verbose_name="Late In")
    attend_earlyout = models.FloatField(blank=True, null=True, verbose_name="Early Out")
    attend_work = models.FloatField(blank=True, null=True, verbose_name="Worked")
    attend_req = models.FloatField(blank=True, null=True, verbose_name="Required")
    attend_under = models.FloatField(blank=True, null=True, verbose_name="Undertime")
    attend_over = models.FloatField(blank=True, null=True, verbose_name="Overtime")
    attend_excuse = models.FloatField(blank=True, null=True, verbose_name="Excuse")
    attend_status = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Status"
    )

    def __str__(self):
        return str(self.attend_date)


class Asset(models.Model):
    asset_id = models.PositiveIntegerField(
        primary_key=True, blank=False, null=False, verbose_name="Asset ID"
    )
    asset_model = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Model"
    )
    asset_sector = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Sector"
    )
    asset_area = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Area"
    )
    asset_serial = models.CharField(
        max_length=200, blank=False, null=False, verbose_name="Serial"
    )
    asset_plate = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Plate Number"
    )

    def __int__(self):
        return self.asset_id


class Request(models.Model):
    id = models.AutoField(primary_key=True)
    req_id = models.CharField(
        max_length=500, blank=True, null=True, verbose_name="Work Request ID"
    )
    asset_id = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Asset ID"
    )
    req_createby = models.CharField(
        max_length=500, blank=False, null=False, verbose_name="Created By"
    )
    req_checkby = models.CharField(
        max_length=500, blank=False, null=False, verbose_name="Checked By"
    )
    req_date = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Date"
    )
    req_status = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Request Status"
    )
    req_workshop = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Workshop"
    )
    req_physloc = models.CharField(
        max_length=500, blank=False, null=False, verbose_name="Physical Location"
    )
    req_maint = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Maintenance Type"
    )
    req_repair = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Repair Type"
    )
    req_km = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Kilometer"
    )
    req_enghr = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Engine Hour"
    )
    req_fuel = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Fuel Quantity"
    )
    req_desc = models.TextField(blank=True, null=True, verbose_name="Description")

    def __str__(self):
        return self.req_asset

    def update_model(self):
        test_id = Request.objects.get(req_id=self.req_id).id
        Request.objects.filter(id=test_id).update(req_id="WR" + str(self.id))

    def save(self, *args, **kwargs):
        super(Request, self).save(*args, **kwargs)
        self.update_model()


class Nationality(models.Model):
    nationality = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Nationality"
    )

    def __str__(self):
        return self.nationality


class Position(models.Model):
    position = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Position"
    )

    def __str__(self):
        return self.position


class Salary(models.Model):
    salary = models.FloatField(blank=False, null=False, verbose_name="Salary")

    def __int__(self):
        return self.salary


class Category(models.Model):
    category = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Category"
    )

    def __str__(self):
        return self.category


class Measurement(models.Model):
    measurement = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Measurement"
    )

    def __str__(self):
        return self.measurement


class Item(models.Model):
    id = models.AutoField(primary_key=True)
    item_code = models.CharField(
        max_length=500, blank=True, null=True, verbose_name="Item Code"
    )
    item_name = models.TextField(blank=False, null=False, verbose_name="Name")
    item_category = models.CharField(
        max_length=500, blank=False, null=False, verbose_name="Category"
    )
    item_location = models.CharField(
        max_length=300, blank=False, null=False, verbose_name="Physical Location"
    )
    item_measurement = models.CharField(
        max_length=500, blank=False, null=False, verbose_name="Unit Of Measurement"
    )
    item_reorder = models.FloatField(
        blank=False, null=False, verbose_name="Reorder Quantity"
    )
    item_onhand = models.FloatField(
        blank=True, null=True, verbose_name="Quantity On Hand"
    )
    item_cost = models.FloatField(blank=False, null=False, verbose_name="Unit Cost")
    item_description = models.TextField(
        blank=False, null=False, verbose_name="Description"
    )

    def __str__(self):
        return self.item_name

    def update_model(self):
        test_id = Item.objects.get(item_code=self.item_code).id
        Item.objects.filter(id=test_id).update(item_code="ITM00" + str(self.id))

    def save(self, *args, **kwargs):
        super(Item, self).save(*args, **kwargs)
        self.update_model()
