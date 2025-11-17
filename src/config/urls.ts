export class AppUrls {
  constructor(private baseUrl: string) {}

  private readonly BASE_PATH = 'fashionhub/'; 

  get HOME() {
    return `${this.baseUrl}${this.BASE_PATH}`;
  }

  get LOGIN() {
    return `${this.baseUrl}${this.BASE_PATH}login.html`;
  }

  get ABOUT() {
    return `${this.baseUrl}${this.BASE_PATH}about.html`;
  }

  get ACCOUNT() {
    return `${this.baseUrl}${this.BASE_PATH}account.html`;
  }

  get PRODUCTS() {
    return `${this.baseUrl}${this.BASE_PATH}products.html`;
  }

  get CART() {
    return `${this.baseUrl}${this.BASE_PATH}cart.html`;
  }
}
