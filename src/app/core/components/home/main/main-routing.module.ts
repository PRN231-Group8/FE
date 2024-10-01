import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MainComponent }
    ])],
    exports: [RouterModule]
})
export class MainRoutingModule { }