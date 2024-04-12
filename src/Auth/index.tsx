import { useState } from "react";
import { useLoginCredentials } from "../data";
import toast from "react-hot-toast";
import {
  Button,
  FormField,
  Modal,
  ModalBody,
  Stack,
  Inline,
  Text,
  Box,
} from "../components";
import { Formik } from "formik";
import { GoogleIcon, SpinnerIcon } from "../components/Icons";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import { queryToSearch } from "../utils";

export function LoginOrRegisterInModal({
  children,
}: {
  children: (props: {
    onOpen: (mode: "login" | "signup") => void;
  }) => React.ReactNode;
}) {
  const { loginWithGoogle } = useLoginCredentials();

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
      const err = e as Error;
      setLoading(false);
      toast.error(err.message || "Something went wrong!");
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
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            onSubmit={() => undefined}
          >
            {() => (
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
                    <Button size="lg" type="submit" disabled={loading}>
                      Login
                    </Button>
                  </Stack>
                ) : (
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
                    <FormField
                      name="confirm_password"
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm Password"
                    />
                    <Button size="lg" type="submit" disabled={loading}>
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
