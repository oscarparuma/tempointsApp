import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)},
      { path: 'login', loadChildren: '../login/login.module#LoginPageModule' },
      { path: 'contact', loadChildren: '../contact/contact.module#ContactPageModule' },
      { path: '', loadChildren: '../tabs/tabs.module#TabsPageModule' },
      { path: 'tabs', loadChildren: '../tabs/tabs.module#TabsPageModule' },
      { path: 'about', loadChildren: '../about/about.module#AboutPageModule' },
      { path: 'promo', loadChildren: '../promo/promo.module#PromoPageModule' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
