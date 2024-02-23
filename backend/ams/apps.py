from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.utils import OperationalError


class AmsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ams"

    def ready(self):
        try:
            User = get_user_model()
            if not User.objects.filter(is_superuser=True).exists():
                User.objects.create_superuser(
                    'jadedanial', 'jadedanial@ams.com', 'assetmaintenancesystem')
        except OperationalError:
            pass
