import { Injectable, TemplateRef } from '@angular/core';
import { ApiService } from './api-service/api-service';
import { Config } from './core/app/config';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {
  LOCAL_STORAGE_KEY,
  TIME_SELECT,
  TIME_TYPE,
} from './constant/app-constant';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AppModuleService {
  private mApiService: ApiService;
  private mAppConfig: Config;

  mUser: any;
  token: string = '';
  serverInfo: string = '';

  constructor(
    public mAngularHttp: Http,
    public router: Router,
    public activatedRoute: ActivatedRoute,

    private _snackBar: MatSnackBar
  ) {
    this.mApiService = new ApiService();
    this.mAppConfig = new Config();
  }

  //----------------------------------------------------//

  public getApiService(): ApiService {
    return this.mApiService;
  }

  public getAppConfig(): Config {
    return this.mAppConfig;
  }

  //----------------------------------------------------//

  public getUser(): any {
    if (localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)) {
      this.mUser = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)
      );
    }
    return this.mUser;
  }

  public setUser(user: any) {
    localStorage.setItem(LOCAL_STORAGE_KEY.USER_INFO, user);
    this.mUser = user;
  }

  public getToken(): string {
    if (localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN)) {
      this.token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN));
    }
    return this.token;
  }

  public setToken(token: string) {
    localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
    this.token = token;
  }

  //----------------------------------------------------//

  public LoadAppConfig() {
    this.getApiService().createClient(this.mAngularHttp);
    return new Promise((resolve, reject) => {
      if (this.getAppConfig().hasData()) {
        return resolve();
      } else {
        this.getApiService()
          .getAngularHttp()
          .request('assets/data/config.json')
          .subscribe(
            (response) => {
              let dataObject = response.json();
              this.mAppConfig.setData(dataObject);
              this.getApiService().setData(dataObject);
              return resolve();
            },
            (error) => {
              return reject();
            }
          );
      }
    });
  }

  //----------------------------------------------------//

  public parseTime(time: string): string {
    return moment(time).format('DD/MM/YYYY');
  }

  public parseMonthTime(time: string): string {
    return moment(time).format('MM-YYYY');
  }

  //----------------------------------------------------//
  // Hiện SnackBar
  public showSnackBar(
    message: string,
    duration?: number,
    hPosition?: any,
    vPosition?: any
  ) {
    this._snackBar.open(message, null, {
      duration: duration ? duration : 5000,
      horizontalPosition: hPosition ? hPosition : 'center',
      verticalPosition: vPosition ? vPosition : 'bottom',
    });
  }

  //----------------------------------------------------//

  public dataObserved = new BehaviorSubject<any>('');
  currentEvent = this.dataObserved.asObservable();

  publishEvent(name: string, params: any) {
    this.dataObserved.next({ name: name, params: params });
  }

  //----------------------------------------------------//

  handleParamsRoute(listParams) {
    let paramsObj = {};
    for (let field of listParams) {
      paramsObj[field.key] = field.value;
    }
    this.router.navigate([], {
      queryParams: paramsObj,
    });

    return paramsObj;
  }

  publishPageRoute(component: string, params?: any, state?: any) {
    this.router.navigate([component], {
      queryParams: params ? params : {},
      state: { params: state ? state : {} },
    });
  }

  // Thêm route history path trên URL
  handleActivatedRoute() {
    let array = [];
    this.activatedRoute.queryParams.subscribe((params) => {
      // GiHug ===================================================================================================================================================
      if (params.mailMergeCampaignID)
        array.push({
          key: 'mailMergeCampaignID',
          value: params.mailMergeCampaignID,
        });
    });
    let paramsObj = {};
    for (let field of array) {
      paramsObj[field.key] = field.value;
    }
    this.router.navigate([], {
      queryParams: paramsObj,
    });
    return paramsObj;
  }

  handleReportTimeSelect(isTimeSelect: boolean, selectTimeIndex: number) {
    if (isTimeSelect) {
      let timePickerJson = localStorage.getItem(
        LOCAL_STORAGE_KEY.REPORT_TIME_SELECT_TIME_PICKER
      );
      let timePicker = JSON.parse(timePickerJson);

      return {
        timeFrom: timePicker.timeFrom,
        timeTo: timePicker.timeTo,
        timeType: timePicker.timeType,
        timeSelect: TIME_SELECT.SELECT,
      };
    } else {
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      if (selectTimeIndex == TIME_SELECT.TODAY) {
        return {
          timeFrom: moment().format('YYYY-MM-DD'),
          timeTo: now,
          timeType: TIME_TYPE.HOUR,
          timeSelect: TIME_SELECT.TODAY,
        };
      } else if (selectTimeIndex == TIME_SELECT.YESTERDAY) {
        let yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');
        return {
          timeFrom: yesterday,
          timeTo: yesterday + ' 23:59:59',
          timeType: TIME_TYPE.HOUR,
          timeSelect: TIME_SELECT.YESTERDAY,
        };
      } else if (selectTimeIndex == TIME_SELECT.LAST_24H) {
        return {
          timeFrom: moment().add(-24, 'hours').format('YYYY-MM-DD HH:mm:ss'),
          timeTo: now,
          timeType: TIME_TYPE.HOUR,
          timeSelect: TIME_SELECT.LAST_24H,
        };
      } else if (selectTimeIndex == TIME_SELECT.LAST_7DAY) {
        return {
          timeFrom: moment().add(-7, 'days').format('YYYY-MM-DD'),
          timeTo: now,
          timeType: TIME_TYPE.DAY,
          timeSelect: TIME_SELECT.LAST_7DAY,
        };
      } else if (selectTimeIndex == TIME_SELECT.LAST_30DAY) {
        return {
          timeFrom: moment().add(-30, 'days').format('YYYY-MM-DD'),
          timeTo: now,
          timeType: TIME_TYPE.DATE,
          timeSelect: TIME_SELECT.LAST_30DAY,
        };
      } else if (selectTimeIndex == TIME_SELECT.THIS_MONTH) {
        let thisMonth = moment().format('YYYY-MM');
        return {
          timeFrom: thisMonth + '-01',
          timeTo: now,
          timeType: TIME_TYPE.DATE,
          timeSelect: TIME_SELECT.THIS_MONTH,
        };
      } else if (selectTimeIndex == TIME_SELECT.LAST_MONTH) {
        let lastMonth = moment().add(-1, 'months').format('YYYY-MM');
        let dayInMonth = moment().add(-1, 'months').daysInMonth();
        return {
          timeFrom: lastMonth + '-01',
          timeTo: lastMonth + '-' + dayInMonth + ' 23:59:59',
          timeType: TIME_TYPE.DATE,
          timeSelect: TIME_SELECT.LAST_MONTH,
        };
      } else {
        return {
          timeType: TIME_TYPE.MONTH,
          timeSelect: TIME_SELECT.ALL_TIME,
        };
      }
    }
  }

  getRouterUrl() {
    let urlFull = this.router.url;
    let urlSplit = urlFull.split('?');
    let url = urlSplit[0].replace('/', '');

    return url;
  }
}
