import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '@atoms/spinner';
import { ButtonComponent } from '@atoms/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-spinner-guide',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ButtonComponent, CardModule],
  templateUrl: './spinner-guide.html',
  styleUrls: ['./spinner-guide.css']
})
export class SpinnerGuideComponent {
  isLoading = signal(false);

  toggleLoading() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);
  }
}
