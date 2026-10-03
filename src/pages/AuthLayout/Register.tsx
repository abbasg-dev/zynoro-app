import { useForm, Controller, FormProvider } from "react-hook-form";
import { useMutation } from "react-query";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { userRegister } from "api/services/auth.services";
import { RegisterUser } from "interfaces/auth.model";
import { AxiosError } from "interfaces/errors.model";
import * as ROUTES from "constants/routes";
import "react-toastify/dist/ReactToastify.css";
import "./auth.scss";

const Register = () => {
  const methods = useForm<RegisterUser>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
    watch,
  } = methods;

  const registerMutation = useMutation(userRegister, {
    onSuccess: () => {
      reset();
      toast.success("Account created successfully.");
    },

    onError: (
      error: AxiosError<{
        message?: string;
      }>,
    ) => {
      toast.error(error.response?.data?.message ?? "Registration failed.");
    },
  });

  const onSubmit = (data: RegisterUser) => {
    registerMutation.mutate(data);
  };

  return (
    <>
      <ToastContainer />
      <h1 className="auth-title">Create an account</h1>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Controller
            name="displayName"
            control={control}
            rules={{
              required: "Full name is required",
            }}
            render={({ field }) => (
              <Form.Group controlId="displayName" className="mb-3">
                <Form.Label className="auth-label">
                  Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...field}
                  type="text"
                  placeholder="Enter full name"
                  value={field.value || ""}
                  isInvalid={!!errors.displayName}
                  className="auth-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.displayName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />

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
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must contain at least 8 characters",
              },
            }}
            render={({ field }) => (
              <Form.Group controlId="password" className="mb-2">
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

          <p className="password-hint mb-3">
            Please include at least 8 characters, 1 uppercase character, and 1
            non-alphabetic symbol (., &amp;, !, ?, etc).
          </p>

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords must match",
            }}
            render={({ field }) => (
              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label className="auth-label">
                  Confirm Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...field}
                  type="password"
                  placeholder="Confirm password"
                  value={field.value || ""}
                  isInvalid={!!errors.confirmPassword}
                  className="auth-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />

          <p className="terms-text mb-4">
            By signing up, I agree to the <Link to="#">Terms of Use</Link> and{" "}
            <Link to="#">Privacy Policy</Link>.
          </p>

          <Button
            type="submit"
            className="w-100 auth-submit-btn"
            disabled={
              registerMutation.isLoading || Object.keys(errors).length > 0
            }
          >
            {registerMutation.isLoading ? "Registering..." : "Sign up"}
          </Button>

          <div className="text-center mt-4">
            <Link to={ROUTES.LOGIN} className="auth-link">
              I have an existing account
            </Link>
          </div>
        </Form>
      </FormProvider>
    </>
  );
};

export default Register;
