// angular
import { Component } from '@angular/core';

// framework
import { BaseComponent } from '../../framework/core/core.module';

// app
import { routeAnimation } from '../../app.animations';

@Component({
  templateUrl: './about-banana.component.html',
  styleUrls: ['about-banana.component.scss'],
  animations: [routeAnimation]
})
export class AboutBananaComponent extends BaseComponent {
}
