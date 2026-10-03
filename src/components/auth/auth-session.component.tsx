import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { getCurrentUser } from "api/services/auth.services";
import { setUser, logout } from "store/slices/authSlice";
import { getUserToken, clearLocalStorageItems } from "helpers/global";

const AuthSession = () => {
  const dispatch = useDispatch();
  const token = getUserToken();

  useQuery(["auth", "me"], getCurrentUser, {
    enabled: Boolean(token),
    retry: false,
    onSuccess: (response) => {
      dispatch(setUser(response.user));
    },
    onError: () => {
      clearLocalStorageItems();
      dispatch(logout());
    },
  });

  useEffect(() => {
    if (!token) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  return null;
};

export default AuthSession;
