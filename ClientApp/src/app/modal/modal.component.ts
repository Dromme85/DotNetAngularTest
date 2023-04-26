import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() isModalClosed = false;
  @Output() modalEvent = new EventEmitter<boolean>();
  message: string = "Really wanna do that?";

  constructor() { }

  ngOnInit(): void {
  }

  openModal(message: string) {
    this.message = message;
    this.isModalClosed = false;
  }

  closeModal() {
    this.isModalClosed = true;
    this.modalEvent.emit(false);
    // Return some "no" message
  }

  confirmModal() {
    this.isModalClosed = true;
    this.modalEvent.emit(true);
    // Return some "yes" message
  }

}
