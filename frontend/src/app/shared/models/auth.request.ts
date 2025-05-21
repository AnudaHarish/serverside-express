export interface AuthRequest {
  "email": string,
  "psw": string
}

export interface AuthResponse {
  "accessToken": string
}

export interface Registry {
  "email": string,
  "username": string,
  "new_password": string,
  "con_password": string,
}
