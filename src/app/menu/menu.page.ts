import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'TemPointsApp',
      children: [
        {
          title: 'Contact',
          url: '/contact',
          icon: 'person'
        },
        {
          title: 'About',
          url: '/tabs/about',
          icon: 'information-circle'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
