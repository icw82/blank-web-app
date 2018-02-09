from os.path import dirname, basename

from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin
from django.conf.urls.static import static
#from django.views.generic.base import RedirectView

app_name = basename(dirname(__file__))

from . import views

def app_urls(names):
    urls = []

    for name in names:
        if name != 'core' and name != app_name:
            urls.append(path('api/', include(name + '.urls')))

    return urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('nested_admin/', include('nested_admin.urls')),
]

# API URLs
urlpatterns += app_urls(settings.PROJECT_APPS)

urlpatterns += static(
    settings.STATIC_URL,
    document_root = settings.STATIC_ROOT)

urlpatterns += static(
    settings.MEDIA_URL,
    document_root = settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^(?!api/|admin).*$', views.BaseView.as_view())]

#urlpatterns += [path('', views.BaseView.as_view())]
