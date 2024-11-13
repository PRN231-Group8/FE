import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatboxComponent } from './chatbox.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: ChatboxComponent }]),
  ],
  exports: [RouterModule],
})
export class ChatboxRoutingModule {}
