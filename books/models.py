from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    categories = models.ManyToManyField(Category, related_name='books')
    created_at = models.DateTimeField(auto_now_add=True)
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)

    def __str__(self):
        return self.title
    