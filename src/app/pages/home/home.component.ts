import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { HomeInfoComponent } from "../../components/home-info/home-info.component";
import { FeaturedComponent } from "../../components/featured/featured.component";
import { AnimateOnScrollModule } from 'primeng/animateonscroll';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    CarouselComponent,
    FeaturedComponent,
    HomeInfoComponent,
    AnimateOnScrollModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
