export class Config {
  public mTitle: any = null;

  constructor() {}

  public setData(data): void {
    if (data) {
      this.mTitle = data;
    }
  }

  public hasData(): boolean {
    return this.mTitle != null;
  }

  public get(key: string) {
    if (this.hasData()) {
      if (key in this.mTitle) {
        return this.mTitle[key];
      }
    }
    return null;
  }
}
