import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExplorationComponent } from './exploration.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ExplorationComponent }
    ])],
    exports: [RouterModule]
  })
export class ExplorationRoutingModule { }