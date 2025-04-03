import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from '../add-form/add-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BookServiceService } from '../book-service.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  books: any[] = [];

  isUpdateDisabled: boolean = true;
  isDeleteDisabled: boolean = true;

  constructor(
    private dialog: MatDialog,
    private bookService: BookServiceService
  ) {}

  ngOnInit(): void {
    this.fetchBooks(); // Call fetchBooks method on page load
  }

  /** Fetches all books from the backend */
  fetchBooks() {
    // In your table.component.ts
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response; // Assign the response data to the books array
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  /** Opens Dialog for Adding a New Book */
  onAddBook() {
    const dialogRef = this.dialog.open(AddFormComponent, {
      width: '400px',
      data: null, // No data for new book
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.addBook(result).subscribe(
          (response) => {
            this.fetchBooks()
          },
          (error) => {
            console.error('Error adding book:', error);
          }
        );
        this.updateButtonStates();
      }
    });
  }

  /** Opens Dialog to Edit Selected Book */
  onEditBook() {
    const selectedBook = this.books.find((book) => book.selected);
    if (!selectedBook) return;

    const dialogRef = this.dialog.open(AddFormComponent, {
      width: '400px',
      data: { ...selectedBook }, // Send a copy of the selected book
    });

    dialogRef.afterClosed().subscribe((updatedBook) => {
      if (updatedBook) {
        // Add the 'id' of the selected book to the updated data
        const selectedBook = this.books.find(book => book.selected);
        const updatedBookWithId = { ...updatedBook, id: selectedBook?.id };

        // Now pass this to the update service
        this.bookService.updateBook(updatedBookWithId).subscribe(
          (response) => {
            this.fetchBooks();  // Refresh the list after updating
            selectedBook.selected = false;  // Unselect after updating
            this.updateButtonStates();
          },
          (error) => {
            console.error('Error updating book:', error);
          }
        );
      }
    });

  }

  /** Deletes Selected Books */
  deleteSelected() {
    // Get all selected books
    const selectedBooks = this.books.filter((book) => book.selected);

    if (selectedBooks.length === 0) {
      return; // No selected books to delete
    }

    if (selectedBooks.length === 1) {
      // Single delete case
      const selectedBookId = selectedBooks[0].id;
      this.bookService.deleteBook(selectedBookId).subscribe(
        (response) => {
          // Remove the deleted book from local books array
          this.books = this.books.filter((book) => book.id !== selectedBookId);
          this.fetchBooks()
          this.updateButtonStates();
        },
        (error) => {
          console.error('Error deleting single book:', error);
        }
      );
    } else {
      // Multiple delete case
      const selectedBookIds = selectedBooks.map(book => book.id);
      this.bookService.deleteMultipleBooks(selectedBookIds).subscribe(
        (response) => {
          // Remove the deleted books from local books array
          this.books = this.books.filter((book) => !selectedBookIds.includes(book.id));
          this.fetchBooks()
          this.updateButtonStates();
        },
        (error) => {
          console.error('Error deleting multiple books:', error);
        }
      );
    }
  }


  /** Updates the button states based on selection */
  updateButtonStates() {
    const selectedCount = this.books.filter((book) => book.selected).length;
    this.isUpdateDisabled = selectedCount !== 1;
    this.isDeleteDisabled = selectedCount === 0;
  }

  /** Toggles Select All Checkbox */
  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.books.forEach((book) => (book.selected = isChecked));
    this.updateButtonStates();
  }

  /** Handles row checkbox changes */
  onRowSelect() {
    this.updateButtonStates();
  }
}
