export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterUser {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FirebaseAuthPayload {
  idToken: string;
}

export interface AuthUser {
  _id?: string;
  id: string;
  email: string;
  username: string;
  displayName: string;
  photoURL: string;
  providers: string[];
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
