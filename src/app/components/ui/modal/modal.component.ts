import { Component, input, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonFooter, IonModal, IonTitle, IonToolbar],
})
export class ModalComponent {
  @ViewChild(IonModal) modal!: IonModal;
  public trigger = input.required<string>();
  public title = input.required<string>();
  public isConfirmDisabled = input<boolean>(false);
  public confirmed = output<IonModal>();

  cancel(): void {
    this.modal.dismiss();
  }

  confirm(): void {
    this.confirmed.emit(this.modal);
  }
}
