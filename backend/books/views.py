from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, generics
from .models import Book, Author, Category
from .serializers import BookSerializer, AuthorSerializer, CategorySerializer, RegisterSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django.contrib.auth.models import User


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'author__name', 'categories__name']
    filterset_fields = ['author', 'categories']
    permission_classes = [IsAuthenticatedOrReadOnly]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer