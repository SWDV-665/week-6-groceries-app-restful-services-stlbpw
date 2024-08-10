import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonItemSliding,
  IonLabel, IonItemOptions, IonItemOption, IonButton, IonToast, IonFab, IonFabButton, IonIcon,
  IonText
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Grocery } from '../grocery';
import { GroceryserviceService } from '../groceryservice.service';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { ModalInputComponent } from '../modal-input/modal-input.component';
import { addIcons } from 'ionicons';
import { pencil, trash, share } from 'ionicons/icons';
import { Share } from '@capacitor/share';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonList, IonItem,
    IonItemSliding, IonLabel, IonItemOptions, IonItemOption, IonButton, IonToast,
    IonFab, IonFabButton, IonIcon, IonText, CommonModule],
})


export class Tab1Page implements OnInit {

  _groceryList: Grocery[] = [];
  _title: string = "Grocery List";

  constructor(private toastController: ToastController,
    private modalCtrl: ModalController,
    private groceryServiceService: GroceryserviceService,
    private alertController: AlertController) {
    this.updateList();

    addIcons({ pencil, trash, share });

  }

  ngOnInit() {
    this.groceryServiceService.groceryListChanged$.subscribe((groceryListChanged: boolean) => {
      if (groceryListChanged) {
        this.updateList();
      }
    });

    this.groceryServiceService.triggerError$.subscribe((triggerError: boolean) => {
      if (triggerError) {
        this.presentAlert();
      }
    });
  }

  async updateList() {
    console.log('Updating Grocery List Called');

    this.groceryServiceService.getGroceryList().subscribe((data: Grocery[]) => {
      //print data to console
      console.log('Data from Server TAB: ', data);
      this._groceryList = data;

      //print out the grocery list
      console.log('Grocery List: ', this._groceryList);
    }, error => {
      console.error('Error getting grocery list: ', error);

    });
  }


  async deleteItem(grocery: Grocery, index: number, slider: IonItemSliding) {
    if (index > -1) {

      this.groceryServiceService.deleteGrocery(this._groceryList[index]).subscribe((data: any) => {
        console.log('Delete from Server: ', data);
        this.presentToast(this._groceryList[index], 'Deleted', 'bottom');
      }, error => {
        console.error('Error deleting grocery item: ', error);
        slider.close();
      });

    }
  }

  async shareItem(grocery: Grocery, index: number, slider: IonItemSliding) {
    if (index > -1) {
      this.presentToast(this._groceryList[index], 'Shared', 'bottom');

      //using capacitor share plugin
      const title: string = 'Sharing Grocery Item';
      const text: string = 'Grocery item - Name: ' + this._groceryList[index].getName() + ' - Quantity: ' + this._groceryList[index].getQuantity();

      await Share.share({
        title: title,
        text: text,
      });

      slider.close();
    }
  }

  /*using a moodal because the alert select list was not working.
  This is not using a service as described in the material, but is more similar to toast.  
  The interwebs (stackoverflow) pointed me to modals as a solution.
  */
  async addWithModal() {
    const modal = await this.modalCtrl.create({
      component: ModalInputComponent
    });
    modal.present();

  }

  /*using a moodal because the alert select list was not working.
  This is not using a service as described in the material, but is more similar to toast.  
  The interwebs (stackoverflow) pointed me to modals as a solution.
  */
  async editWithModal(grocery: Grocery, index: number, slider: IonItemSliding) {
    const modal = await this.modalCtrl.create({
      component: ModalInputComponent,
      componentProps: {
        _grocery: grocery,
        _index: index
      }
    });
    modal.present();
    slider.close();
  }


  async presentToast(grocery: Grocery, action: string, position: 'top' | 'middle' | 'bottom') {

    let name = grocery.getName();

    try {
      const toast = await this.toastController.create({
        message: name + ' - ' + action,
        duration: 1500,
        position: position

      });

      await toast.present();

    } catch (error) {
      console.error('Error presenting toast: ', error);
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Server ERROR',
      message: 'Error communicating with server',
      buttons: ['OK']
    });

    await alert.present();
  }


}
