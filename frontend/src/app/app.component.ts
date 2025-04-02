import { Component } from '@angular/core';
import { TableComponent } from './table/table.component'; // Your table component
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TableComponent,
    HttpClientModule // Import HttpClientModule here as well
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
