from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.CharField(max_length=100)
    schedule = models.CharField(max_length=200)
    capacity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Registration(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="registrations")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "course")  # one registration per user per course

    def __str__(self):
        return f"{self.user.username} - {self.course.title} ({self.status})"
