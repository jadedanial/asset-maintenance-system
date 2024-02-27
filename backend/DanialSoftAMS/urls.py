from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

description = """
![Your Logo](https://raw.githubusercontent.com/jadedanial/asset-maintenance-system/main/frontend/ams/public/images/ams.png)
An asset performance optimization system developed by Jade Danial (danialjade@gmail.com) that aims to enhance the efficiency and effectiveness of an organization’s assets. This system is designed to ensure that all assets are well-maintained and functioning at their optimal capacity.
"""

schema_view = get_schema_view(
    openapi.Info(
        title="Asset Maintenance System (AMS) API",
        default_version="v1.0",
        description=description,
    ),
    public=True,
)


urlpatterns = [
    path("", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("docs/", schema_view.with_ui("redoc",
         cache_timeout=0), name="schema-redoc"),
    path("ams/", include("ams.api.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("admin/", admin.site.urls),
    path("api/", include("ams.api.urls")),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
