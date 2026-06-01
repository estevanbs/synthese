import {
  Component,
  input,
  OnChanges,
  SimpleChanges,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService, Note } from '../../services/notes.service';
import { Topic } from '../../services/topics.service';

@Component({
  selector: 'app-topic-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topic-view.html',
  styleUrl: './topic-view.css',
})
export class TopicViewComponent implements OnChanges {
  topic = input.required<Topic>();

  note = signal<Note | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  editing = signal(false);
  editContent = signal('');
  saving = signal(false);
  saveError = signal<string | null>(null);

  private readonly notesService = inject(NotesService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topic']) {
      this.cancelEdit();
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

  startEdit(): void {
    const content = this.note()?.content ?? '';
    this.editContent.set(content);
    this.saveError.set(null);
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.editContent.set('');
    this.saveError.set(null);
  }

  saveEdit(): void {
    const currentNote = this.note();
    if (!currentNote || this.saving()) return;

    const trimmed = this.editContent().trim();
    if (!trimmed) return;

    this.saving.set(true);
    this.saveError.set(null);

    this.notesService.update(currentNote.id, trimmed).subscribe({
      next: (updated) => {
        this.note.set(updated);
        this.editing.set(false);
        this.editContent.set('');
        this.saving.set(false);
      },
      error: () => {
        this.saveError.set('Failed to save changes. Please try again.');
        this.saving.set(false);
      },
    });
  }

  onEditKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.saveEdit();
    }
    if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  formattedContent = () => {
    const content = this.note()?.content;
    if (!content) return [];
    return content.split('\n').filter((line) => line.trim() !== '');
  };
}
