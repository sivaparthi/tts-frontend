import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { StopButtonComponent } from '../stop-button/stop-button.component';
import { NgIf } from '@angular/common';
import { BouncingCircleComponent } from '../bouncing-circle/bouncing-circle.component';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [StopButtonComponent, NgIf, BouncingCircleComponent],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css',
})
export class ToggleButtonComponent {
  buttonText: string = 'Start';
  mediaRecorder: any;
  audioChunks: any[] = [];
  isRecording: boolean = false;
  isAnalyzing: boolean = false; // To control when to start analyzing mic input
  audioContext: AudioContext | null = null;
  analyserNode: AnalyserNode | null = null;
  microphoneStream: MediaStream | null = null;
  dataArray: Uint8Array | null = null;
  isPlayingAudio: boolean = false; // To control the display of the Stop button
  audioElement: HTMLAudioElement | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  async toggleRecording(): Promise<void> {
    if (!this.isRecording) {
      // Start recording
      this.buttonText = 'Stop';
      this.isRecording = true;
      this.isAnalyzing = true; // Start sound-based bounce
      await this.startAnalyzingAudio();

      // Request access to the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up MediaRecorder with MIME type for m4a (audio/mp4)
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });

      this.mediaRecorder.ondataavailable = (event: any) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        // Create a Blob from the audio chunks
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp4' });
        this.audioChunks = [];

        // Send the recorded audio to the backend API
        this.sendAudioToServer(audioBlob);
      };

      this.mediaRecorder.start();
    } else {
      // Stop recording
      this.buttonText = 'Start';
      this.isRecording = false;
      this.isAnalyzing = false; // Stop sound-based bounce
      this.stopAnalyzingAudio();
      this.mediaRecorder.stop();
    }
  }

  async sendAudioToServer(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.m4a');

    try {
      const response = await this.http
        .post('http://127.0.0.1:8002/synthesize-speech/', formData, {
          responseType: 'blob',
        })
        .toPromise();

      if (response) {
        const audioBlobResponse = response as Blob;
        const audioUrl = URL.createObjectURL(audioBlobResponse);
        this.playAudio(audioUrl);
      } else {
        console.error('No response from server');
      }
    } catch (error) {
      console.error('Error sending audio to server:', error);
    }
  }
  playAudio(audioUrl: string): void {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.src = audioUrl;
    this.audioElement.play();

    this.isPlayingAudio = true; // Show the Stop button
    console.log(this.isPlayingAudio);
    this.cdr.detectChanges();
    this.audioElement.onended = () => {
      this.isPlayingAudio = false; // Hide the Stop button when audio ends
      this.resetCircle();
      this.cdr.detectChanges();
    };
  }

  stopAudioPlayback() {
    if (this.audioElement) {
      this.audioElement.pause(); // Stop the audio playback
      this.audioElement.currentTime = 0; // Reset to the beginning
      this.isPlayingAudio = false;
      this.cdr.detectChanges(); // Hide the Stop button
      this.resetCircle();
    }
  }

  async startAnalyzingAudio() {
    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.microphoneStream = stream;

    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;

    const bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    source.connect(this.analyserNode);

    this.animateCircle();
  }

  stopAnalyzingAudio() {
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach((track) => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.resetCircle();
  }

  animateCircle() {
    if (this.isAnalyzing && this.analyserNode && this.dataArray) {
      requestAnimationFrame(() => this.animateCircle());

      this.analyserNode.getByteTimeDomainData(this.dataArray);
      const maxVolume = Math.max(...this.dataArray); // Get the max volume level
      const normalizedVolume = (maxVolume - 128) / 128; // Normalize the value

      // Scale the circle based on volume
      const scaleValue = 1 + normalizedVolume * 2; // Adjust scale multiplier as needed
      const circleElement = document.querySelector(
        '.bouncing-circle'
      ) as HTMLElement;
      if (circleElement) {
        circleElement.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
      }
    }
  }

  resetCircle() {
    // Reset the circle to its original state
    const circleElement = document.querySelector(
      '.bouncing-circle'
    ) as HTMLElement;
    if (circleElement) {
      circleElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }
}
