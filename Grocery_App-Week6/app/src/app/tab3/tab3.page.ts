import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ExploreContainerComponent],
})
export class Tab3Page {
  constructor(private toastController: ToastController) {
    console.log(this.toastController)
  }

  async presentToast() {
    try {
      console.log("TOAST CALLED 1");
  
      let toast = await this.toastController.create({
        message: 'Hello World!',
        duration: 5000,
      });
  
      console.log("TOAST CALLED 2");
  
      await toast.present();
  
      console.log("TOAST CALLED 3");
    } catch (error) {
      console.error('Error creating or presenting toast: ', error);
    }
  }
  
}
