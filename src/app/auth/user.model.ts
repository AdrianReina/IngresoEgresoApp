export class User {
  public nombre: string;
  public email: string;
  public uid: string;
  constructor(obj: dataObj) {
    this.nombre = (obj && obj.nombre) || '';
    this.uid = (obj && obj.uid) || '';
    this.email = (obj && obj.email) || '';
  }
}

export interface dataObj {
  uid: string;
  email: string;
  nombre: string;
}
