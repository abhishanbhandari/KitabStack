Kitab Stack — Book Management Platform

A REST API for managing books, authors, and categories, built with Django REST Framework and PostgreSQL. Developed as part of an internship project.

Features
Book management — full CRUD (create, read, update, delete) for books
Author & category management — CRUD support via ModelViewSets
File uploads — books support cover images and PDF files
Search — search books by title, author name, or category name
Filtering — filter books by author or category
Pagination — book list results are paginated (5 per page)
Authentication — JWT-based authentication (login, refresh, registration)
Permissions — read access open to everyone, write access requires login
Interactive API documentation — auto-generated Swagger UI via drf-spectacular
Automated tests — DRF test cases covering listing, authentication, and permissions
Environment-based configuration — database credentials managed via .env
Tech Stack
Backend: Django 6.1, Django REST Framework 3.18
Database: PostgreSQL
Authentication: JWT (via djangorestframework-simplejwt)
Documentation: drf-spectacular (Swagger/OpenAPI)
Other libraries: django-filter (search/filtering), Pillow (image handling), python-decouple (environment variables)
Frontend: React (planned)
Deployment: Docker (planned)
Project Structure
book_platform/
├── backend/
│   ├── config/         # Django project settings, root URLs
│   ├── books/          # Main app: models, views, serializers, URLs, tests
│   ├── media/           # Uploaded book covers and PDFs (gitignored)
│   ├── venv/            # Python virtual environment (gitignored)
│   ├── manage.py
│   ├── .env             # Real environment variables (gitignored)
│   └── .env.example     # Template for required environment variables
├── frontend/            # React app (not yet implemented)
├── .gitignore
└── README.md
Setup Instructions
1. Clone the repository
bash
git clone https://github.com/abhishanbhandari/KitabStack.git
cd KitabStack/backend

All backend commands below are run from inside the backend/ folder.

2. Create and activate a virtual environment
bash
python -m venv venv
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate
3. Install dependencies
bash
pip install django djangorestframework django-filter Pillow python-decouple djangorestframework-simplejwt psycopg2-binary drf-spectacular
4. Configure environment variables

Copy .env.example to .env and fill in your actual PostgreSQL credentials:

bash
cp .env.example .env

.env requires:

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
5. Set up the database

Make sure PostgreSQL is running and the database in .env exists, then run:

bash
python manage.py migrate
6. Create a superuser (for admin access)
bash
python manage.py createsuperuser
7. Run the development server
bash
python manage.py runserver

The API will be available at http://127.0.0.1:8000/.

8. Run tests
bash
python manage.py test books
API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/token/	Log in — returns access and refresh JWT tokens
POST	/api/token/refresh/	Get a new access token using a refresh token
POST	/api/register/	Create a new user account
Books
Method	Endpoint	Description
GET	/api/books/	List all books (paginated, supports ?search= and ?author=/?categories= filters)
POST	/api/books/	Create a new book (requires authentication)
GET	/api/books/{id}/	Retrieve a single book
PUT/PATCH	/api/books/{id}/	Update a book (requires authentication)
DELETE	/api/books/{id}/	Delete a book (requires authentication)

Book creation/updates that include cover_image or pdf_file must be sent as multipart/form-data, not JSON.

Authors
Method	Endpoint	Description
GET	/api/authors/	List all authors
POST	/api/authors/	Create an author (requires authentication)
GET	/api/authors/{id}/	Retrieve a single author
PUT/PATCH	/api/authors/{id}/	Update an author (requires authentication)
DELETE	/api/authors/{id}/	Delete an author (requires authentication)
Categories
Method	Endpoint	Description
GET	/api/categories/	List all categories
POST	/api/categories/	Create a category (requires authentication)
GET	/api/categories/{id}/	Retrieve a single category
PUT/PATCH	/api/categories/{id}/	Update a category (requires authentication)
DELETE	/api/categories/{id}/	Delete a category (requires authentication)
Interactive documentation

Full interactive API documentation (Swagger UI) is available at:

http://127.0.0.1:8000/api/docs/

Raw OpenAPI schema:

http://127.0.0.1:8000/api/schema/
Authentication Usage
Obtain tokens by logging in:
   POST /api/token/
   Body: { "username": "...", "password": "..." }
Include the access token in the header of protected requests:
   Authorization: Bearer <access_token>
When the access token expires, refresh it:
   POST /api/token/refresh/
   Body: { "refresh": "<refresh_token>" }
Implementation Notes
All three resources (Book, Author, Category) use DRF ModelViewSet for consistency, registered via DefaultRouter.
JWT was chosen over DRF's basic token authentication for token expiry and refresh support, aligning with common industry practice.
Database credentials are kept out of source control via python-decouple and a .env file (excluded via .gitignore).
API documentation is auto-generated from the codebase using drf-spectacular, so it stays in sync with the actual implementation.
The project follows a backend//frontend/ structure to support an eventual React frontend and Docker Compose setup.
Roadmap
 Book, Author, Category models and CRUD
 Search, filtering, and pagination
 File uploads (cover images, PDFs)
 Environment-based secrets management
 JWT authentication and permissions
 Automated tests
 Interactive API documentation (Swagger)
 Restructure into backend//frontend/ folders
 Docker + Docker Compose setup
 React frontend
License

This project was developed for internship/educational purposes.