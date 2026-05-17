from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Registration
from .serializers import CourseSerializer, RegistrationSerializer, RegisterUserSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    """Create a new user account"""
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """Return info about the currently logged-in user"""
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "is_staff": request.user.is_staff,
    })


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def courses(request):
    """
    GET: List all courses (public, no login needed)
    POST: Create a new course (admin only)
    """
    if request.method == "GET":
        all_courses = Course.objects.all().order_by("-created_at")
        serializer = CourseSerializer(all_courses, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([AllowAny])
def course_detail(request, pk):
    """
    GET: View course details (public)
    PUT: Edit course (admin only)
    DELETE: Delete course (admin only)
    """
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        course.delete()
        return Response({"message": "Course deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll(request, pk):
    """Enroll the logged-in user in a course"""
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    if Registration.objects.filter(user=request.user, course=course).exists():
        return Response({"error": "You are already registered for this course"}, status=status.HTTP_400_BAD_REQUEST)

    user_registration_count = Registration.objects.filter(user=request.user).exclude(status="rejected").count()
    if user_registration_count >= 6:
        return Response({"error": "You cannot register for more than 6 courses"}, status=status.HTTP_400_BAD_REQUEST)

    accepted_count = course.registrations.filter(status__in=["pending", "accepted"]).count()
    if accepted_count >= course.capacity:
        return Response({"error": "This course is full"}, status=status.HTTP_400_BAD_REQUEST)

    registration = Registration.objects.create(user=request.user, course=course)
    serializer = RegistrationSerializer(registration)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_registrations(request):
    """View all registrations for the logged-in user"""
    registrations = Registration.objects.filter(user=request.user).order_by("-registered_at")
    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def all_registrations(request):
    """Admin: view all registrations from all users"""
    if not request.user.is_staff:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
    registrations = Registration.objects.all().order_by("-registered_at")
    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_registration(request, pk):
    """Admin: accept or reject a registration"""
    if not request.user.is_staff:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    try:
        registration = Registration.objects.get(pk=pk)
    except Registration.DoesNotExist:
        return Response({"error": "Registration not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get("status")
    if new_status not in ["pending", "accepted", "rejected"]:
        return Response({"error": "Status must be pending, accepted, or rejected"}, status=status.HTTP_400_BAD_REQUEST)

    registration.status = new_status
    registration.save()
    serializer = RegistrationSerializer(registration)
    return Response(serializer.data)
