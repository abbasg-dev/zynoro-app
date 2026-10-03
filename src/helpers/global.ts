import { format, parseISO } from "date-fns";
import * as constants from "constants/constants";
import { AuthResponse, AuthUser } from "interfaces/auth.model";

export function getUserToken(): string | null {
  const storedData = localStorage.getItem(constants.KEY_ACCESS_TOKEN);
  if (!storedData) return null;

  try {
    const parsed = JSON.parse(storedData) as { token: string };
    return parsed.token || null;
  } catch {
    return null;
  }
}

export function getUserInfo(): AuthUser | null {
  const user = localStorage.getItem(constants.KEY_USER_INFO);
  if (!user) return null;

  try {
    const parsed = JSON.parse(user) as { user: AuthUser };
    return parsed.user || null;
  } catch {
    return null;
  }
}

export const setLocalStorageItems = (data: AuthResponse) => {
  const { token, user } = data;
  localStorage.setItem(constants.KEY_ACCESS_TOKEN, JSON.stringify({ token }));
  localStorage.setItem(constants.KEY_USER_INFO, JSON.stringify({ user }));
};

export const clearLocalStorageItems = () => {
  localStorage.removeItem(constants.KEY_ACCESS_TOKEN);
  localStorage.removeItem(constants.KEY_USER_INFO);
};

export const dateFormatterWithTime = (date?: string) => {
  if (date) return format(parseISO(date), "MMMM d, yyyy h:mm a");
  return null;
};

export const formatCurrency = (value?: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value || 0);
};
