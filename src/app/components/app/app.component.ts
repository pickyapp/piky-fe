import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/types/app-state/app-state.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'picky-mvp2';

  constructor(private store: Store<AppState>) {
    
  }
}
