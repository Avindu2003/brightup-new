import { CommonModule } from '@angular/common';
import { SubscriptionDashbordService } from './subscription-dashbord.service';
import { Component } from '@angular/core';
import { NbCardModule, NbIconModule, NbWindowService } from "@nebular/theme";

@Component({
  selector: 'ngx-subscription-dashbord',
  standalone: false,
  // imports: [NbCardModule, NbIconModule,CommonModule],
  templateUrl: './subscription-dashbord.component.html',
  styleUrl: './subscription-dashbord.component.scss'
})
export class SubscriptionDashbordComponent {

  loading: boolean = true;
  modelLoading: boolean = true;
  dashobrodDetailList: any[] = [];
  totalCount = 0; 

  beginnerName = null;
  beginnerCount = 0;
  starterName = null;
  starterCount = 0;
  intermediateName = null;
  intermediateCount = 0;
  professionalName = null;
  prfessionalCount = 0;
  iconList : any;

   constructor(
      private subscriptionDashbordService :SubscriptionDashbordService,
      private windowService: NbWindowService
    ) {}

  ngOnInit() {
    this.getDashbordDetails();
    this.iconList = [{icon:'person-outline',class:'icon-box green-bg'}, {icon:'star-outline',class:'icon-box yellow-bg'}, {icon:'hard-drive-outline',class:'icon-box purple-bg'}, {icon:'bookmark-outline',class:'icon-box red-bg'}];

  }

  

getDashbordDetails() {
  this.subscriptionDashbordService.getDashbordDetails().subscribe((response: any) => {
    this.dashobrodDetailList = response.responseData;
    console.log("this.dashobrodDetailList");
    console.log(this.dashobrodDetailList);

    for (let i = 0; i < this.dashobrodDetailList.length; i++) {
      const item = this.dashobrodDetailList[i];
      this.totalCount += item.activeCount
    }
  });
}

  
}