import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bouncing-circle',
  standalone: true,
  imports: [NgClass],
  templateUrl: './bouncing-circle.component.html',
  styleUrl: './bouncing-circle.component.css'
})
export class BouncingCircleComponent {
}
