from io import BytesIO

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw, ImageFont

from books.models import Author, Book, Category


AUTHORS = {
    "Jane Austen": "English novelist known for incisive social commentary and enduring romantic fiction.",
    "Mary Shelley": "English novelist whose pioneering Gothic fiction helped define science fiction.",
    "Lewis Carroll": "English writer, mathematician, and author of imaginative children's literature.",
    "H. G. Wells": "English writer celebrated as a foundational voice in modern science fiction.",
    "Bram Stoker": "Irish novelist best known for influential Gothic horror fiction.",
}
CATEGORIES = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Fantasy", "Mystery"]
BOOKS = [
    ("Pride and Prejudice", "Jane Austen", ["Fiction"]),
    ("Sense and Sensibility", "Jane Austen", ["Fiction"]),
    ("Frankenstein", "Mary Shelley", ["Fiction", "Sci-Fi"]),
    ("The Last Man", "Mary Shelley", ["Fiction", "Sci-Fi"]),
    ("Alice's Adventures in Wonderland", "Lewis Carroll", ["Fiction", "Fantasy"]),
    ("Through the Looking-Glass", "Lewis Carroll", ["Fiction", "Fantasy"]),
    ("The Time Machine", "H. G. Wells", ["Fiction", "Sci-Fi"]),
    ("The War of the Worlds", "H. G. Wells", ["Fiction", "Sci-Fi"]),
    ("Dracula", "Bram Stoker", ["Fiction", "Mystery"]),
    ("The Jewel of Seven Stars", "Bram Stoker", ["Fiction", "Mystery"]),
]


class Command(BaseCommand):
    help = "Create idempotent demo authors, categories, books, covers, and PDFs."

    def handle(self, *args, **options):
        authors = {}
        for name, bio in AUTHORS.items():
            author, created = Author.objects.get_or_create(name=name, defaults={"bio": bio})
            authors[name] = author
            if created:
                self.stdout.write(f"Created author: {name}")

        categories = {}
        for name in CATEGORIES:
            category, created = Category.objects.get_or_create(name=name)
            categories[name] = category
            if created:
                self.stdout.write(f"Created category: {name}")

        created_books = 0
        for title, author_name, category_names in BOOKS:
            book, created = Book.objects.get_or_create(title=title, defaults={"author": authors[author_name]})
            if created:
                book.categories.set([categories[name] for name in category_names])
                created_books += 1

            changed = False
            filename = "".join(char.lower() if char.isalnum() else "-" for char in title).strip("-")
            if not book.cover_image:
                book.cover_image.save(f"{filename}.png", ContentFile(self._cover_bytes(title)), save=False)
                changed = True
            if not book.pdf_file:
                book.pdf_file.save(f"{filename}.pdf", ContentFile(self._pdf_bytes(title, author_name)), save=False)
                changed = True
            if changed:
                book.save()
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created book: {title}"))

        self.stdout.write(self.style.SUCCESS(
            f"Seed complete: {created_books} books created; totals - {Book.objects.count()} books, "
            f"{Author.objects.count()} authors, {Category.objects.count()} categories."
        ))

    @staticmethod
    def _lines(title):
        words, lines, line = title.split(), [], ""
        for word in words:
            candidate = f"{line} {word}".strip()
            if len(candidate) > 28:
                lines.append(line)
                line = word
            else:
                line = candidate
        return lines + [line]

    @classmethod
    def _cover_bytes(cls, title):
        image = cls._page_image(title, "Kitab Stack demo edition", (600, 900))
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return buffer.getvalue()

    @classmethod
    def _pdf_bytes(cls, title, author):
        pages = [
            cls._page_image(title, f"by {author}\n\nKitab Stack demo PDF", (1240, 1754)),
            cls._page_image(title, "Demo preview\n\nPage 2 of 3", (1240, 1754)),
            cls._page_image(title, "Demo preview\n\nPage 3 of 3", (1240, 1754)),
        ]
        buffer = BytesIO()
        pages[0].save(buffer, format="PDF", save_all=True, append_images=pages[1:], resolution=150)
        return buffer.getvalue()

    @classmethod
    def _page_image(cls, title, subtitle, size):
        image = Image.new("RGB", size, "#172554")
        draw = ImageDraw.Draw(image)
        font = ImageFont.load_default()
        y = size[1] // 2 - 80
        for line in cls._lines(title):
            box = draw.textbbox((0, 0), line, font=font)
            draw.text(((size[0] - (box[2] - box[0])) / 2, y), line, fill="white", font=font)
            y += 28
        for index, line in enumerate(subtitle.splitlines()):
            box = draw.textbbox((0, 0), line, font=font)
            draw.text(((size[0] - (box[2] - box[0])) / 2, y + 42 + index * 22), line, fill="#bfdbfe", font=font)
        return image
