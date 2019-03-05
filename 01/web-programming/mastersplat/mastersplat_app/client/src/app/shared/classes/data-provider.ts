
export class DataProvider {
  id: String;
  name: String;
  url: String;
  total: Number;
  inserted_date: Date;
  updated_date: Date;
  status: Number;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}