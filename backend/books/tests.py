from rest_framework.test import APITestCase
from rest_framework import status 

from django.urls import reverse

class BookAPITests(APITestCase):
    def test_list_books_returns_200(self):
        url = reverse('book-list')
        response = self.client.get(url) 
        # fake request to the book-list endpoint
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        # check if the response status code is 200 OK
    def test_create_book_requires_authentication(self):
        url = reverse('book-list')
        data = { 'title': 'Unauthorized Book'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_book_authenticated(self):
        from django.contrib.auth.models import User
        from books.models import Author, Category
        user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=user)
        author = Author.objects.create(name='Test Author')
        category = Category.objects.create(name='Test Category')
        url = reverse('book-list')
        data = {'title': 'Authorized Book', 'author': author.id, 'categories': [category.id]}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)