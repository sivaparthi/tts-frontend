import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-stop-button',
  standalone: true,
  imports: [],
  templateUrl: './stop-button.component.html',
  styleUrl: './stop-button.component.css',
})
export class StopButtonComponent {
  @Output() stopAudio = new EventEmitter<void>(); 

  onStopClick() {
    this.stopAudio.emit();
  }
}
