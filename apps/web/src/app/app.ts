import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar';
import { EditorComponent } from './components/editor/editor';
import { TopicViewComponent } from './components/topic-view/topic-view';
import { TopicsService, Topic } from './services/topics.service';
import { SynthesizeResult } from './services/synthesize.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, EditorComponent, TopicViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly topicsService = inject(TopicsService);

  topics = signal<Topic[]>([]);
  selectedTopic = signal<Topic | null>(null);
  showEditor = signal(true);

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.topicsService.getAll().subscribe({
      next: (topics) => this.topics.set(topics),
    });
  }

  selectTopic(topic: Topic): void {
    this.selectedTopic.set(topic);
    this.showEditor.set(false);
  }

  openEditor(): void {
    this.selectedTopic.set(null);
    this.showEditor.set(true);
  }

  onNotesSaved(result: SynthesizeResult): void {
    this.loadTopics();
    if (result.entries.length === 1) {
      const entry = result.entries[0];
      this.topicsService.getAll().subscribe({
        next: (topics) => {
          this.topics.set(topics);
          const saved = topics.find((t) => t.id === entry.topicId);
          if (saved) {
            this.selectTopic(saved);
          }
        },
      });
    } else {
      this.loadTopics();
    }
  }
}
