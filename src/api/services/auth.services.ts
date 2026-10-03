import api from "api/api";
import { clearLocalStorageItems } from "helpers/global";
import type {
  AuthResponse,
  FirebaseAuthPayload,
  RegisterUser,
  UserCredentials,
} from "interfaces/auth.model";
import { signOutFirebase } from "utils/firebase/firebase";

export const userRegister = async (
  data: RegisterUser,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

export const userLogin = async (
  data: UserCredentials,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signin", data);
  return response.data;
};

export const googleAuth = async (
  data: FirebaseAuthPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/google", data);
  return response.data;
};

export const facebookAuth = async (
  data: FirebaseAuthPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/facebook", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  try {
    await signOutFirebase();
  } finally {
    clearLocalStorageItems();
  }
};
