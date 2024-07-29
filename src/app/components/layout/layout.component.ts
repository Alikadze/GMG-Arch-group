import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterOutlet,
    NgClass,
    ScrollTopModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  isHeaderVisible = false;

  ngOnInit() {
    setTimeout(() => {
      this.isHeaderVisible = true;
    }, 500);
  }
}
