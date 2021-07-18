export interface IUser {
  email: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  authorizedApps: Array<string>;
  passwordResetToken: number;
}
