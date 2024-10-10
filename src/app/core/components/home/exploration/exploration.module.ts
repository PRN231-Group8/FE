import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorationComponent } from './exploration.component';
import { ExplorationRoutingModule } from './exploration-routing.module';


@NgModule({
  declarations: [ExplorationComponent],
  imports: [
    CommonModule,
    ExplorationRoutingModule,
  ]
})
export class ExplorationModule { }
