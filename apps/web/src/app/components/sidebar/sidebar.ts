import {
  Component,
  input,
  output,
  computed,
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
  newNoteRequested = output<void>();

  selectTopic(topic: Topic): void {
    this.topicSelected.emit(topic);
  }

  isSelected = computed(() => (id: number) => this.selectedTopicId() === id);

  requestNewNote(): void {
    this.newNoteRequested.emit();
  }
}
