import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonItemSliding,
  IonLabel, IonItemOptions, IonItemOption, IonButton, IonToast, IonFab, IonFabButton, IonIcon,
  IonText, IonButtons, IonInput, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { Grocery } from '../grocery';
import { GroceryserviceService } from '../groceryservice.service';

@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonItemSliding, IonLabel, IonItemOptions, IonItemOption, IonButton, IonToast,
    IonFab, IonFabButton, IonIcon, IonText, IonButtons, IonInput, CommonModule, FormsModule,
    IonSelect, IonSelectOption],
})
export class ModalInputComponent implements OnInit {

  _message: string = "Add Item";
  _name?: string;
  _quantity?: number;
  _grocery?: Grocery;
  _index?: number;
  _editMode: boolean = false;

  //array of possible quantities
  _quantities: number[] = [];
  _quantitySize: number = 10;

  constructor(private modalCtrl: ModalController,
    private groceryServiceService: GroceryserviceService
  ) {

    for (let i = 1; i <= this._quantitySize; i++) {
      this._quantities.push(i);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const name = this._name || "";
    const quantity = this._quantity || 0;
    console.log(name, quantity);
    if (!this._editMode) {
      //throw alert if name or quantity is empty
      if (name === "" || quantity === 0) {
        alert("Grocery Item and Quantity are both required");
        return;
      }
      const newGrocery = new Grocery("", name, quantity, "", 0, "");
      this.groceryServiceService.addGrocery(newGrocery).subscribe();
    }
    else {
      if (this._grocery !== undefined && this._index !== undefined) {
        //throw alert if name or quantity is empty
        if (name === "" || quantity === 0) {
          alert("Grocery Item and Quantity are both required");
          return;
        }
        this._grocery.setName(name);
        this._grocery.setQuantity(quantity);
        this.groceryServiceService.editGrocery(this._grocery, this._index).subscribe();
      }
    }
    return this.modalCtrl.dismiss('confirm');
  }

  ngOnInit() {

    if (this._grocery !== undefined && this._index !== undefined) {
      this._name = this._grocery.getName();
      this._quantity = this._grocery.getQuantity();
      this._editMode = true;
      this._message = "Edit Item";
    }

  }

}
