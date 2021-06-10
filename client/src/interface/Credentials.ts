export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface ConfirmCredentials {
  token: string;
}

export interface ResetRequestCredentials {
  email: string;
}

export interface ResetCredentials {
  token: string;
  password: string;
}
