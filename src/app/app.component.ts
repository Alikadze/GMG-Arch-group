import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet/>'
})
export class AppComponent {
  ngOnInit() {
    gsap.registerPlugin(ScrollTrigger);
  }
  
}
