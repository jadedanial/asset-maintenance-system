from enum import unique
from django.db import models
from django.contrib.auth.models import AbstractUser


class Component(models.Model):
    id = models.AutoField(primary_key=True)
    label = models.CharField(
        max_length=50, unique=True, blank=False, null=False, verbose_name="Component Label"
    )
    key = models.CharField(max_length=100, blank=True,
                           null=True, verbose_name="Key")

    def __str__(self):
        return str(self.label)

    def update_model(self):
        key_id = Component.objects.get(key=self.key).id
        Component.objects.filter(id=key_id).update(key=str(self.label))

    def save(self, *args, **kwargs):
        super(Component, self).save(*args, **kwargs)
        self.update_model()


class Module(models.Model):
    id = models.AutoField(primary_key=True)
    label = models.CharField(
        max_length=50, unique=True, blank=False, null=False, verbose_name="Module Label"
    )
    key = models.CharField(max_length=100, blank=True,
                           null=True, verbose_name="Key")
    icon = models.CharField(max_length=100, blank=True,
                            null=True, verbose_name="Icon")
    children = models.ManyToManyField(
        Component, blank=True, verbose_name="Children")

    def __str__(self):
        return str(self.label)

    def update_model(self):
        key_id = Module.objects.get(key=self.key).id
        Module.objects.filter(id=key_id).update(key=str(self.label))

    def save(self, *args, **kwargs):
        super(Module, self).save(*args, **kwargs)
        self.update_model()


class Category(models.Model):
    cat_name = models.CharField(
        max_length=300, unique=True, blank=False, null=False, verbose_name="Category"
    )

    def __str__(self):
        return str(self.cat_name)


class Option(models.Model):
    opt_name = models.CharField(
        max_length=200, unique=True, blank=False, null=False, verbose_name="Option Name"
    )
    opt_category = models.ForeignKey(
        Category,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name="Category",
    )
    opt_value = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Value"
    )

    def __str__(self):
        return str(self.opt_name)


class Branch(models.Model):
    branch_name = models.CharField(
        max_length=300, unique=True, blank=False, null=False, verbose_name="Branch Name"
    )

    def __str__(self):
        return str(self.branch_name)


class Section(models.Model):
    type = (
        ('', ''),
        ('workshop', 'Workshop'),
        ('warehouse', 'Warehouse'),
    )
    category = (
        ('', ''),
        ('main', 'Main'),
        ('sub', 'Sub'),
    )
    section_code = models.CharField(
        max_length=100, unique=True, blank=True, null=True, verbose_name="Section Code"
    )
    section_branch = models.ForeignKey(
        Branch,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        verbose_name="Branch",
    )
    section_type = models.CharField(
        max_length=100, choices=type, default='', blank=False, null=False, verbose_name="Type"
    )
    section_category = models.CharField(
        max_length=100, choices=category, default='', blank=False, null=False, verbose_name="Category"
    )

    def __str__(self):
        return str(self.section_code)


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
        return str(self.username)


class Shift(models.Model):
    id = models.AutoField(primary_key=True)
    shift_name = models.CharField(
        max_length=300, unique=True, blank=True, null=True, verbose_name="Name"
    )
    shift_description = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Description"
    )
    shift_from = models.TimeField(blank=True, null=True, verbose_name="From")
    shift_to = models.TimeField(blank=True, null=True, verbose_name="To")

    def __str__(self):
        return str(self.shift_description)

    def update_model(self):
        test_id = Shift.objects.get(id=self.id).id
        Shift.objects.filter(id=test_id).update(shift_description=str(
            self.shift_from) + " - " + str(self.shift_to))

    def save(self, *args, **kwargs):
        super(Shift, self).save(*args, **kwargs)
        self.update_model()


class Schedule(models.Model):
    id = models.AutoField(primary_key=True)
    sched_name = models.CharField(
        max_length=300, unique=True, blank=True, null=True, verbose_name="Name"
    )
    sched_sun = models.ForeignKey(
        Shift,
        blank=True,
        null=True,
        related_name="sched_sun",
        on_delete=models.CASCADE,
        verbose_name="Sunday",
    )
    sched_mon = models.ForeignKey(
        Shift,
        blank=True,
        null=True,
        related_name="sched_mon",
        on_delete=models.CASCADE,
        verbose_name="Monday",
    )
    sched_tue = models.ForeignKey(
        Shift,
        blank=True,
        null=True,
        related_name="sched_tue",
        on_delete=models.CASCADE,
        verbose_name="Tuesday",
    )
    sched_wed = models.ForeignKey(
        Shift,
        blank=True,
        null=True,
        related_name="sched_wed",
        on_delete=models.CASCADE,
        verbose_name="Wednesday",
    )
    sched_thu = models.ForeignKey(
        Shift,
        blank=True,
        null=True,
        related_name="sched_thu",
        on_delete=models.CASCADE,
        verbose_name="Thurdsay",
    )
    sched_fri = models.ForeignKey(
        Shift,
        blank=True,
        null=True,
        related_name="sched_fri",
        on_delete=models.CASCADE,
        verbose_name="Friday",
    )
    sched_sat = models.ForeignKey(
        Shift,
        blank=True,
        null=True,
        related_name="sched_sat",
        on_delete=models.CASCADE,
        verbose_name="Satuday",
    )

    def __str__(self):
        return str(self.sched_name)


class Employee(models.Model):
    emp_id = models.AutoField(primary_key=True, verbose_name="Employee ID")
    emp_name = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Name"
    )
    emp_bdate = models.DateField(
        blank=True, null=True, verbose_name="Birthdate")
    emp_nation = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Nationality"
    )
    emp_address = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Address"
    )
    emp_email = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Email"
    )
    emp_phone = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Phone"
    )
    emp_hired = models.DateField(
        blank=True, null=True, verbose_name="Date Hired")
    emp_position = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Position"
    )
    emp_salary = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Salary Grade"
    )
    emp_section = models.ForeignKey(
        Section,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name="Section",
    )
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
    attend_date = models.DateField(
        blank=False, null=False, verbose_name="Date")
    attend_checkin = models.DateTimeField(
        blank=True, null=True, verbose_name="Check In"
    )
    attend_checkout = models.DateTimeField(
        blank=True, null=True, verbose_name="Check Out"
    )
    attend_latein = models.FloatField(
        blank=True, null=True, verbose_name="Late In")
    attend_earlyout = models.FloatField(
        blank=True, null=True, verbose_name="Early Out")
    attend_work = models.FloatField(
        blank=True, null=True, verbose_name="Worked")
    attend_req = models.FloatField(
        blank=True, null=True, verbose_name="Required")
    attend_under = models.FloatField(
        blank=True, null=True, verbose_name="Undertime")
    attend_over = models.FloatField(
        blank=True, null=True, verbose_name="Overtime")
    attend_excuse = models.FloatField(
        blank=True, null=True, verbose_name="Excuse")
    attend_status = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Status"
    )

    def __str__(self):
        return str(self.attend_date)


class Vacation(models.Model):
    emp_id = models.ForeignKey(
        Employee,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        verbose_name="Employee ID",
    )
    vac_type = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Vacation Type"
    )
    vac_start = models.DateField(
        blank=True, null=True, verbose_name="Start Date")
    vac_end = models.DateField(blank=True, null=True, verbose_name="End Date")
    vac_reason = models.TextField(blank=True, null=True, verbose_name="Reason")
    vac_attachment = models.CharField(
        max_length=1000, blank=True, null=True, verbose_name="Attachment"
    )
    vac_total = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Total"
    )

    def __str__(self):
        return str(self.emp_id)


class Excuse(models.Model):
    emp_id = models.ForeignKey(
        Employee,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        verbose_name="Employee ID",
    )
    exc_date = models.DateField(
        blank=True, null=True, verbose_name="Excuse Date")
    exc_start = models.TimeField(
        blank=True, null=True, verbose_name="Start Time")
    exc_end = models.TimeField(blank=True, null=True, verbose_name="End Time")
    exc_reason = models.TextField(blank=True, null=True, verbose_name="Reason")
    exc_total = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Total"
    )

    def __str__(self):
        return str(self.emp_id)


class Item(models.Model):
    id = models.AutoField(primary_key=True)
    item_code = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Item Code"
    )
    item_name = models.CharField(
        max_length=100, blank=False, null=False, verbose_name="Name"
    )
    item_category = models.CharField(
        max_length=200, blank=False, null=False, verbose_name="Category"
    )
    item_measurement = models.CharField(
        max_length=200, blank=False, null=False, verbose_name="Unit Of Measurement"
    )
    item_reorder = models.FloatField(
        blank=False, null=False, verbose_name="Reorder Quantity"
    )
    item_cost = models.FloatField(
        blank=False, null=False, verbose_name="Unit Cost")
    item_description = models.TextField(
        blank=False, null=False, verbose_name="Description"
    )

    def __str__(self):
        return str(self.item_code)

    def update_model(self):
        test_id = Item.objects.get(item_code=self.item_code).id
        Item.objects.filter(id=test_id).update(
            item_code="ITM00" + str(self.id))

    def save(self, *args, **kwargs):
        super(Item, self).save(*args, **kwargs)
        self.update_model()


class WarehouseItem(models.Model):
    item_code = models.ForeignKey(
        Item,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name="Item Code",
    )
    warehouse_code = models.ForeignKey(
        Section,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name="Warehouse Code",
    )
    item_location = models.CharField(
        max_length=200, blank=False, null=False, verbose_name="Physical Location"
    )
    item_onhand = models.FloatField(
        blank=True, null=True, verbose_name="Quantity On Hand"
    )

    def __str__(self):
        return str(self.item_code)


class Vehicle(models.Model):
    id = models.AutoField(primary_key=True)
    vehicle_code = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Vehicle Code"
    )
    vehicle_type = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Type"
    )
    vehicle_model = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Model"
    )
    vehicle_serial = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Serial"
    )
    vehicle_plate = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Plate"
    )
    vehicle_area = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Area"
    )
    vehicle_sector = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Sector"
    )
    vehicle_status = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Status"
    )

    def __str__(self):
        return str(self.vehicle_code)


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    trans_code = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Transaction Code"
    )
    trans_action = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="Action"
    )
    trans_date = models.DateTimeField(
        blank=True, null=True, verbose_name="Date")
    trans_user = models.CharField(
        max_length=300, blank=True, null=True, verbose_name="User"
    )
    trans_detail = models.TextField(
        blank=True, null=True, verbose_name="Detail")

    def __str__(self):
        return str(self.trans_code)

    def update_model(self):
        test_id = Transaction.objects.get(trans_code=self.trans_code).id
        Transaction.objects.filter(id=test_id).update(
            trans_code="TRA" + str(self.id))

    def save(self, *args, **kwargs):
        super(Transaction, self).save(*args, **kwargs)
        self.update_model()
