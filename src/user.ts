export interface INewUser {
  username: string;
  password: string;
}

export interface IUser extends INewUser {
  id: string;
}
