import {
  Component,
  input,
  output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Topic } from '../../services/topics.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  topics = input<Topic[]>([]);
  selectedTopicId = input<number | null>(null);
  topicSelected = output<Topic>();
  topicDeleted = output<Topic>();
  newNoteRequested = output<void>();

  pendingDeleteId = signal<number | null>(null);

  isSelected = computed(() => (id: number) => this.selectedTopicId() === id);

  selectTopic(topic: Topic): void {
    this.pendingDeleteId.set(null);
    this.topicSelected.emit(topic);
  }

  onDeleteClick(event: MouseEvent, topic: Topic): void {
    event.stopPropagation();
    if (this.pendingDeleteId() === topic.id) {
      this.pendingDeleteId.set(null);
      this.topicDeleted.emit(topic);
    } else {
      this.pendingDeleteId.set(topic.id);
    }
  }

  requestNewNote(): void {
    this.newNoteRequested.emit();
  }
}
