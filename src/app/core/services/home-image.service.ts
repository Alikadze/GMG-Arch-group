import { Injectable } from '@angular/core';
import { Image } from '../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class HomeImageService {
  images: Image[] = [  
    {
      itemImageSrc: '/assets/images/My_Modern_Home_No19-.2e16d0ba.fill-1280x960.format-webp_ivELdvq.webp',
      thumbnailImageSrc: '/assets/images/My_Modern_Home_No19-.2e16d0ba.fill-1280x960.format-webp_ivELdvq.webp',
      space: 460,
      rooms: 6,
      country: 'Georgia',
      city: 'Batumi'
    },
    {
      itemImageSrc: '/assets/images/Most-Beautiful-House-in-the-World_0_1200.jpg',
      thumbnailImageSrc: '/assets/images/Most-Beautiful-House-in-the-World_0_1200.jpg',
      space: 710,
      rooms: 10,
      country: 'Georgia',
      city: 'Tbilisi'
    },
    {
      itemImageSrc: '/assets/images/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.webp',
      thumbnailImageSrc: '/assets/images/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.webp',
      space: 320,
      rooms: 5,
      country: 'Georgia',
      city: 'Kutaisi'
    }
  ];

  getImages(): Promise<Image[]> {
    return new Promise((resolve) => {
      resolve(this.images);
    });
  }

}
