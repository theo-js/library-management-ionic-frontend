import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  IonAvatar,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonProgressBar,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  MenuController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { filter, scan } from 'rxjs';

@Component({
  selector: 'app-root-layout',
  templateUrl: './root-layout.component.html',
  styleUrls: ['./root-layout.component.scss'],
  imports: [
    IonRouterOutlet,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonList,
    IonListHeader,
    IonAvatar,
    IonItem,
    IonLabel,
    IonIcon,
    IonProgressBar,
    RouterLink,
    RouterLinkActive,
  ],
})
export class RootLayoutComponent {
  private router = inject(Router);
  private menuController = inject(MenuController);

  public readonly DEFAULT_TITLE = 'Library';
  public readonly NAV_LINKS: { title: string; href: string }[] = [
    { title: 'Catalog', href: '/books' },
    { title: 'Foo', href: '/foo' },
  ];

  public title = signal<string>(this.DEFAULT_TITLE);

  constructor() {
    addIcons({ chevronForwardOutline });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const route = this.router.routerState.root;
      let currentRoute = route;

      // Find deepest segment
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.title.set(currentRoute.snapshot.data['title'] ?? this.DEFAULT_TITLE);
    });
  }

  public closeMenu(): void {
    this.menuController.close();
  }

  private readonly navigationState = toSignal(
    this.router.events.pipe(
      scan((isNavigating, event) => {
        if (event instanceof NavigationStart) return true;

        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError)
          return false;

        return isNavigating;
      }, true),
    ),
    { initialValue: true },
  );

  public readonly isNavigating = computed(() => this.navigationState());
}
