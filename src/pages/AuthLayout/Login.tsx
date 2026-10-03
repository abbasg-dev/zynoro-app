import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Google, Facebook } from "react-bootstrap-icons";
import { login } from "store/slices/authSlice";
import {
  userLogin,
  googleAuth,
  facebookAuth,
} from "api/services/auth.services";
import {
  signInWithGooglePopup,
  signInWithFacebookPopup,
  getFirebaseIdToken,
} from "utils/firebase/firebase";
import { AuthResponse, UserCredentials } from "interfaces/auth.model";
import { AxiosError } from "interfaces/errors.model";
import { setLocalStorageItems } from "helpers/global";
import * as ROUTES from "constants/routes";
import "react-toastify/dist/ReactToastify.css";
import "./auth.scss";

const Login = () => {
  const dispatch = useDispatch();
  const [currentService, setCurrentService] = useState<string | null>(null);

  const methods = useForm<UserCredentials>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = methods;

  const authMutation = useMutation(
    async ({
      service,
      payload,
    }: {
      service: "signin" | "google" | "facebook";
      payload?: UserCredentials | { idToken: string };
    }): Promise<AuthResponse> => {
      setCurrentService(service);

      switch (service) {
        case "signin":
          return userLogin(payload as UserCredentials);
        case "google":
          return googleAuth(payload as { idToken: string });
        case "facebook":
          return facebookAuth(payload as { idToken: string });
        default:
          throw new Error("Invalid authentication service");
      }
    },
    {
      onSuccess: (response, { service }) => {
        setLocalStorageItems(response);
        dispatch(login(response.user));

        toast.success(
          service === "signin" ? "Sign In Success" : "Login Success",
        );

        reset();
        setCurrentService(null);
      },

      onError: (error: AxiosError<{ message?: string }>) => {
        toast.error(error.response?.data?.message ?? "Authentication failed");
        setCurrentService(null);
      },
    },
  );

  const onSubmit = (data: UserCredentials) => {
    authMutation.mutate({ service: "signin", payload: data });
  };

  const handleGoogleLogin = async () => {
    try {
      setCurrentService("google");
      const result = await signInWithGooglePopup();
      const idToken = await getFirebaseIdToken(result.user);
      authMutation.mutate({ service: "google", payload: { idToken } });
    } catch {
      setCurrentService(null);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setCurrentService("facebook");
      const result = await signInWithFacebookPopup();
      const idToken = await getFirebaseIdToken(result.user);
      authMutation.mutate({ service: "facebook", payload: { idToken } });
    } catch {
      setCurrentService(null);
      toast.error("Facebook login failed. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <h1 className="auth-title">Login</h1>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format.",
              },
            }}
            render={({ field }) => (
              <Form.Group controlId="email" className="mb-3">
                <Form.Label className="auth-label">
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...field}
                  type="email"
                  placeholder="Enter email"
                  value={field.value || ""}
                  isInvalid={!!errors.email}
                  className="auth-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <Form.Group controlId="password" className="mb-4">
                <Form.Label className="auth-label">
                  Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...field}
                  type="password"
                  placeholder="Enter password"
                  value={field.value || ""}
                  isInvalid={!!errors.password}
                  className="auth-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />

          <Button
            type="submit"
            className="w-100 auth-submit-btn mb-3"
            disabled={authMutation.isLoading || currentService !== null}
          >
            {currentService === "signin" ? "Signing in..." : "Login"}
          </Button>

          <div className="divider-container my-3">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>

          <div className="social-btns-stack gap-2 d-flex flex-column mb-4">
            <Button
              type="button"
              variant="outline-secondary"
              className="social-auth-btn google-btn w-100"
              disabled={authMutation.isLoading || currentService !== null}
              onClick={handleGoogleLogin}
            >
              <Google className="social-icon google-icon" />
              <span>
                {currentService === "google"
                  ? "Signing in..."
                  : "Sign in with Google"}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline-secondary"
              className="social-auth-btn facebook-btn w-100"
              disabled={authMutation.isLoading || currentService !== null}
              onClick={handleFacebookLogin}
            >
              <Facebook className="social-icon facebook-icon" />
              <span>
                {currentService === "facebook"
                  ? "Signing in..."
                  : "Sign in with Facebook"}
              </span>
            </Button>
          </div>

          <div className="text-center">
            <Link to={ROUTES.REGISTER} className="auth-link">
              New Customer? Register
            </Link>
          </div>
        </Form>
      </FormProvider>
    </>
  );
};

export default Login;
