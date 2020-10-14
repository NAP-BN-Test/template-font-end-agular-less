import { Http, Headers } from '@angular/http';

import { ParamBuilder } from './param-builder';

import { Config } from '../app/config';

/** Install
 * $ ionic cordova plugin add cordova-plugin-advanced-http
 * $ npm install @ionic-native/http
 * $ Add to imports int app-module
 * - HttpModule
 * $ Add to providers in app-module
 * - HTTP
 */

export class HttpClient extends Config {
  public mAngularHttp: Http;

  public mAngularHeader: Headers;

  public mDebugEnable: boolean = false;

  public mUseNativeHttp: boolean = false;

  constructor() {
    super();
  }

  public createClient(angularHttp: Http) {
    if (this.mAngularHttp) return;
    this.mAngularHttp = angularHttp;
  }

  setUseNativeHttp(useNative: boolean) {
    this.mUseNativeHttp = useNative;
  }

  getCommonAngularHeader() {
    if (!this.mAngularHeader) {
      this.mAngularHeader = new Headers();
      this.mAngularHeader.append(
        'Content-Type',
        'application/x-www-form-urlencoded;charset=utf-8'
      );
    }    
    return this.mAngularHeader;
  }

  public setDebugEnable(enable: boolean) {
    this.mDebugEnable = enable;
  }

  public getAngularHttp(): Http {
    return this.mAngularHttp;
  }

  public requestGet(
    url: string,
    paramBuilder: ParamBuilder,
    headers?: Headers
  ) {
    return this._AngularRequestGet(
      url,
      paramBuilder.build(),
      headers ? headers : this.getCommonAngularHeader()
    );
  }

  public requestPost(
    url: string,
    paramBuilder: ParamBuilder,
    headers?: Headers
  ) {
    return this._AngularRequestPost(
      url,
      paramBuilder.build(),
      headers ? headers : this.getCommonAngularHeader()
    );
  }
  public requestPut(
    url: string,
    paramBuilder: ParamBuilder,
    headers?: Headers
  ) {
    return this._AngularRequestPut(
      url,
      paramBuilder.build(),
      headers ? headers : this.getCommonAngularHeader()
    );
  }

  public _AngularRequestGet(url: string, params: string, headers) {
    return new Promise((success, fail) => {
      this.mAngularHttp
        .get(url + '?' + params, {
          headers: headers,
        })
        .subscribe(
          (data) => {
            success(data.json());
          },
          (error) => {
            fail(error.json());
          }
        );
    });
  }

  public _AngularRequestPost(url: string, params: string, headers: Headers) {
    params = params.replace(/ /g, '%20');
    return new Promise((success, fail) => {
      this.mAngularHttp
        .post(url, params, {
          headers: headers,
        })
        .subscribe(
          (data) => {
            success(data.json());
          },
          (error) => {
            fail(error.json());
          }
        );
    });
  }

  public _AngularRequestPut(url: string, params: string, headers) {
    params = params.replace(/ /g, '%20');
    return new Promise((success, fail) => {
      this.mAngularHttp
        .put(url, params, {
          headers: headers,
        })
        .subscribe(
          (data) => {
            success(data.json());
          },
          (error) => {
            fail(error.json());
          }
        );
    });
  }
}
