import { ApiCmd } from './api-service-cmd';
import { HttpClient } from '../core/http/http-client';
import { LOCAL_STORAGE_KEY } from '../constant/app-constant';
import { ParamBuilder } from '../core/http/param-builder';

export class ApiService extends HttpClient {
  mUrl: string = 'http://192.168.1.101:1598/';
  // mUrl: string = 'http://118.27.192.106:3400/';

  headers = new Headers({
    Authorization: localStorage.getItem('token-hnc'),
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', // thêm phần này vào header thì mới gửi body cho backend được
  });

  userID = localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)).id
    : -1;
  username = localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)).username
    : '';

  itemPerPage = localStorage.getItem('item-per-page')
    ? JSON.parse(localStorage.getItem('item-per-page'))
    : 10;

  public static _instance: ApiService = null;

  constructor() {
    super();
  }

  public setData(data) {
    super.setData(data);
    if (data) {
      if ('http' in data) {
        let http = data['http'];

        this.mUrl = http[http['api_server']].host;

        this.setDebugEnable(http['debug']);
      }
    }
  }

  public setItemPerPage(itemPerPage) {
    super.setData(itemPerPage);
    if (itemPerPage) {
      localStorage.setItem('item-per-page', itemPerPage);
      this.itemPerPage = itemPerPage;
    }
  }

  public setUserInfo(userInfo) {
    super.setData(userInfo);
    if (userInfo) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.USER_INFO,
        JSON.stringify(userInfo)
      );
      this.userID = userInfo.id;
      this.username = userInfo.username;
    }
  }

  //===================================================================================
  public sendRequestLOGIN(username: string, password: string): Promise<any> {
    return this.requestPost(
      this.mUrl + ApiCmd.LOGIN,
      ParamBuilder.builder().add('userName', username).add('password', password)
    );
  }
}
