from django.urls import path
from . import views

app_name = 'unitconv'

urlpatterns = [
    path('', views.index, name='index'),
]