import { useState } from "react";
import toast from "react-hot-toast";
import { Formik } from "formik";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import * as Validator from "yup";
import { EmailValidator, queryToSearch } from "../utils";
import { useLoginCredentials } from "../data";
import { GoogleIcon, SpinnerIcon } from "../components/Icons";
import {
  Button,
  FormField,
  Modal,
  ModalBody,
  Stack,
  Inline,
  Text,
  Box,
  formikOnSubmitWithErrorHandling,
  Alert,
} from "../components";

const loginSignUpValidationSchema = Validator.object().shape({
  name: Validator.string()
    .matches(/^[A-Za-z ]*$/, "Please enter valid name")
    .max(40),
  email: EmailValidator.required("Please enter a valid email!"),
  password: Validator.string()
    .min(8)
    .max(15)
    .required("Please enter a valid password!"),
});

export function LoginOrRegisterInModal({
  children,
}: {
  children: (props: {
    onOpen: (mode: "login" | "signup") => void;
  }) => React.ReactNode;
}) {
  const { signupWithEmail, loginWithGoogle, loginWithEmail } =
    useLoginCredentials();
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"login" | "signup" | undefined>(undefined);
  function onClose() {
    setMode(undefined);
  }

  async function joinWithGoogleHandler() {
    setLoading(true);
    try {
      await loginWithGoogle();
      setLoading(false);
      toast.success("Logged in successfully!!!");
      onClose();
    } catch (e) {
      setLoading(false);
      toast.error(`${e}` || "Something went wrong!");
    }
  }

  return (
    <>
      {children({
        onOpen: (mode) => {
          setMode(mode);
        },
      })}
      <Modal
        isOpen={Boolean(mode)}
        title={mode === "login" ? "Login" : "Sign up"}
        onClose={onClose}
        isDismissable
      >
        <ModalBody autoMaxHeight>
          <Formik
            initialValues={{
              name: undefined as string | undefined,
              email: "",
              password: "",
            }}
            validationSchema={loginSignUpValidationSchema}
            onSubmit={formikOnSubmitWithErrorHandling(
              async (values, { setFieldError }) => {
                if (mode === "login") {
                  await loginWithEmail({
                    email: values.email,
                    password: values.password,
                  });
                } else {
                  if (!values.name?.length) {
                    setFieldError("name", "Please enter a valid name");
                    return;
                  }
                  await signupWithEmail({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                  });
                }
              }
            )}
          >
            {({ isSubmitting, status, submitForm }) => (
              <Stack gap="4">
                {mode === "login" ? (
                  <Stack>
                    <FormField
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="Enter email"
                    />
                    <FormField
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter Password"
                    />

                    {status ? <Alert status="error">{status}</Alert> : null}

                    <Button
                      size="lg"
                      type="submit"
                      disabled={loading}
                      loading={isSubmitting}
                      onClick={submitForm}
                    >
                      {isSubmitting ? <SpinnerIcon /> : null}
                      Login
                    </Button>
                  </Stack>
                ) : (
                  <Stack>
                    <FormField
                      name="name"
                      label="Name"
                      type="text"
                      placeholder="Enter name"
                    />
                    <FormField
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="Enter email"
                    />
                    <FormField
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter Password"
                    />

                    {status ? <Alert status="error">{status}</Alert> : null}

                    <Button
                      size="lg"
                      type="submit"
                      disabled={loading}
                      loading={isSubmitting}
                      onClick={submitForm}
                    >
                      {isSubmitting ? <SpinnerIcon /> : null}
                      Sign up
                    </Button>
                  </Stack>
                )}
                <Inline gap="3" alignItems="center">
                  <Box as="hr" width="full" />
                  <Text fontSize="b3">OR</Text>
                  <Box as="hr" width="full" />
                </Inline>
                <Button
                  size="lg"
                  loading={loading}
                  onClick={joinWithGoogleHandler}
                  disabled={isSubmitting}
                >
                  {loading ? <SpinnerIcon /> : <GoogleIcon />}
                  Continue with google
                </Button>
                <Inline alignItems="center" justifyContent="center">
                  {mode === "login" ? (
                    <Text fontSize="b3">
                      {`Don't have an account?`}{" "}
                      <Text
                        as="span"
                        color="textAlt1"
                        className="underline"
                        cursor="pointer"
                        onClick={() => setMode("signup")}
                      >
                        Sign up
                      </Text>
                    </Text>
                  ) : (
                    <Text fontSize="b3">
                      {`Already have an account?`}{" "}
                      <Text
                        as="span"
                        color="textAlt1"
                        className="underline"
                        cursor="pointer"
                        onClick={() => setMode("login")}
                      >
                        Login
                      </Text>
                    </Text>
                  )}
                </Inline>
              </Stack>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
}

export function ProtectedRoutes({
  redirectTo = "/",
  children,
  redirectBack,
}: {
  redirectTo?: string;
  children?: React.ReactNode;
  redirectBack?: boolean;
}) {
  const location = useLocation();
  const { status, data: signInCheckResult } = useSigninCheck();
  if (status === "loading") {
    return (
      <span>
        <SpinnerIcon /> Auth Check...
      </span>
    );
  }
  if (signInCheckResult.signedIn === true) {
    return <>{children || <Outlet />}</>;
  }
  return (
    <Navigate
      to={`${redirectTo}${queryToSearch(
        redirectBack
          ? {
              next: location.pathname + location.search,
            }
          : {}
      )}`}
      replace
    />
  );
}
