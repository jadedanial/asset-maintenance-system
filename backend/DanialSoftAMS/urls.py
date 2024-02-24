from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Asset Maintenance System (AMS) API",
        default_version='v1',
        description="""
        Developed by Jade Danial (danialjade@gmail.com), the AMS API is an asset performance optimization system designed to enhance the efficiency and effectiveness of an organization's assets. It ensures all assets are well-maintained and functioning at their optimal capacity. 

        - **Asset**: Allows users to create and update asset information, control, and organize assets to optimize operations.
        - **Workshop**: Enables users to schedule and track different types of maintenance tasks such as corrective and preventive maintenance.
        - **Warehouse**: Provides a complete and integrated inventory management module that ensures the availability of spare parts needed for maintenance.
        - **Administration**: Helps improve daily productivity by monitoring the number of available employees for operation and managing their information, vacations, attendances, and absences.
        - **Report**: Generates reports to monitor various aspects of the operation such as work order status, employee productivity, spare part consumption, out-of-service assets, and road call assets.
        """,
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('docs/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc',
         cache_timeout=0), name='schema-redoc'),
    path("api-auth/", include("rest_framework.urls")),
    path("admin/", admin.site.urls),
    path("api/", include("ams.api.urls")),
    path("", include("ams.api.urls")),
]
