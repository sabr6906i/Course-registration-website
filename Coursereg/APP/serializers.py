from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Registration


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CourseSerializer(serializers.ModelSerializer):
    seats_available = serializers.SerializerMethodField()
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ["id", "title", "description", "instructor", "schedule", "capacity", "seats_available", "enrolled_count", "created_at"]

    def get_seats_available(self, obj):
        # count pending + accepted — both hold a seat
        taken = obj.registrations.filter(status__in=["pending", "accepted"]).count()
        return obj.capacity - taken

    def get_enrolled_count(self, obj):
        return obj.registrations.filter(status="accepted").count()


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class RegistrationSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = ["id", "user", "course", "status", "registered_at"]
