import {
  Component,
  input,
  OnChanges,
  SimpleChanges,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService, Note } from '../../services/notes.service';
import { Topic } from '../../services/topics.service';

@Component({
  selector: 'app-topic-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-view.html',
  styleUrl: './topic-view.css',
})
export class TopicViewComponent implements OnChanges {
  topic = input.required<Topic>();

  note = signal<Note | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  private readonly notesService = inject(NotesService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topic']) {
      this.loadNote();
    }
  }

  private loadNote(): void {
    this.loading.set(true);
    this.error.set(null);
    this.note.set(null);

    this.notesService.getLatestForTopic(this.topic().id).subscribe({
      next: (note) => {
        this.note.set(note);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set('No notes yet for this topic.');
        } else {
          this.error.set('Failed to load notes.');
        }
        this.loading.set(false);
      },
    });
  }

  formattedContent = () => {
    const content = this.note()?.content;
    if (!content) return [];
    return content.split('\n').filter((line) => line.trim() !== '');
  };
}
