import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-view.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewerComponent implements OnInit {
  imageUrl: string = '';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.imageUrl = this.config.data?.imageUrl || '';
  }

  close(): void {
    this.ref.close();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }
}