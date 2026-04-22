import {
  Component,
  signal,
  output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SynthesizeService, SynthesizeResult } from '../../services/synthesize.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class EditorComponent {
  notesSaved = output<SynthesizeResult>();

  text = signal('');
  submitting = signal(false);
  result = signal<SynthesizeResult | null>(null);
  error = signal<string | null>(null);

  private readonly synthesizeService = inject(SynthesizeService);

  submit(): void {
    const raw = this.text().trim();
    if (!raw || this.submitting()) return;

    this.submitting.set(true);
    this.result.set(null);
    this.error.set(null);

    this.synthesizeService.process(raw).subscribe({
      next: (res) => {
        this.result.set(res);
        this.text.set('');
        this.submitting.set(false);
        this.notesSaved.emit(res);
      },
      error: () => {
        this.error.set('Something went wrong. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.submit();
    }
  }

  dismiss(): void {
    this.result.set(null);
    this.error.set(null);
  }
}
