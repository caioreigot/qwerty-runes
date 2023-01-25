import { Component, ElementRef, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-general-knowledge',
  templateUrl: './general-knowledge.component.html',
  styleUrls: ['./general-knowledge.component.less']
})
export class GeneralKnowledgeComponent {

  @ViewChild('input') input: ElementRef | null = null;
  
  constructor(private socket: Socket) {
    this.socket.fromEvent('message').subscribe(data => {
      console.log(data);
    });
  }

  onSubmit() {
    this.socket.emit('loopback', { data: this.input?.nativeElement.value });
  }
}
