import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { HomeInfoComponent } from "../../components/home-info/home-info.component";
import { FeaturedComponent } from "../../components/featured/featured.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    CarouselComponent,
    FeaturedComponent,
    HomeInfoComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
