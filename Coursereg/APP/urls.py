from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register_user),
    path("me/", views.me),
    path("courses/", views.courses),
    path("courses/<int:pk>/", views.course_detail),
    path("courses/<int:pk>/enroll/", views.enroll),
    path("my-registrations/", views.my_registrations),
    path("admin/registrations/", views.all_registrations),
    path("admin/registrations/<int:pk>/", views.update_registration),
]
