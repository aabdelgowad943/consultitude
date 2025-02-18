export interface Register {
  firstName?: string;
  lastName?: string;
  phone?: string;
  about?: string;
  profileUrl?: string;
  title?: string;
  email: string;
  password: string;
  // name: string;
}

export interface VerifyEmail {
  email: string;
  otp: string;
}

export interface ResetPassword {
  email: string;
}
