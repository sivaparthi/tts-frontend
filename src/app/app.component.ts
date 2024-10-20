import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BouncingCircleComponent } from './bouncing-circle/bouncing-circle.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BouncingCircleComponent, ToggleButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'tts';
}
