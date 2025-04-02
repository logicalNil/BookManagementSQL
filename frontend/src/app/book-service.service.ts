import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // The service is available throughout the app
})
export class BookServiceService {

  private apiUrl = 'http://localhost:3001/book';

  constructor(private http: HttpClient) {
    console.log('HttpClient injected:', !!this.http); // Should log true
  }

  getBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  addBook(book: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, book);
  }

  updateBook(book: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update`, book);
  }
// For single book deletion
deleteBook(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete`, { body: { id } });
}

// For multiple books deletion
deleteMultipleBooks(ids: number[]): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete`, { body: { ids } });
}

}
