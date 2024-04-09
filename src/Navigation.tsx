import config from "./config";
import {
  Box,
  Inline,
  Stack,
  Text,
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuLink,
  MenuItemHeader,
  MenuItem,
} from "./components";
import { ArrowRightIcon, LogoutIcon } from "./components/Icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LoginOrRegisterInModal } from "./Auth";
import { useAuth, useUser } from "reactfire";
import { getInitials } from "./utils";
import { signOut } from "firebase/auth";

export function Navigation() {
  const auth = useAuth();

  const { data: user } = useUser();
  const initials = getInitials(user?.displayName || "CC");

  return (
    <Stack paddingX="8">
      <Box as="nav" paddingY="4">
        <Inline alignItems="center" justifyContent="between">
          <Inline width="full" gap="3" alignItems="center" as={Link} to="/">
            <Text as="span" fontSize="h5">
              🧭
            </Text>
            <Text as="h5" fontSize="h5" color="textPrimary">
              {config.app}
            </Text>
          </Inline>

          <Inline gap="6" width="full" justifyContent="end" alignItems="center">
            {!user?.uid ? (
              <Inline gap="4">
                <LoginOrRegisterInModal>
                  {({ onOpen }) => (
                    <Button level="primary" onClick={() => onOpen("login")}>
                      Login
                    </Button>
                  )}
                </LoginOrRegisterInModal>
                <Button>Sign up</Button>
              </Inline>
            ) : (
              <Box>
                <Menu>
                  <MenuButton inline>
                    <Avatar
                      size="10"
                      id={user.uid}
                      initials={initials}
                      image={user?.photoURL || undefined}
                    />
                  </MenuButton>
                  <MenuList align="bottom-right">
                    <MenuLink to="/profile">
                      <Inline alignItems="center" gap="4">
                        <Box>
                          <Stack
                            size="12"
                            justifyContent="center"
                            alignItems="center"
                            rounded="full"
                            bgColor="surfacePrimaryLowest"
                          >
                            <Text
                              textTransform="uppercase"
                              fontSize="b3"
                              color="textPrimary"
                            >
                              {user.displayName ? user.displayName[0] : "CC"}
                            </Text>
                          </Stack>
                        </Box>
                        <Stack gap="1">
                          <Text as="h4">{user.displayName || `User`}</Text>
                          <Text
                            fontSize="c1"
                            color="textMedium"
                            className="tracking-wider whitespace-pre"
                          >
                            {user.email}
                          </Text>
                          <Text fontSize="c4" color="textPrimary">
                            Your Profile{" "}
                          </Text>
                        </Stack>
                      </Inline>
                    </MenuLink>
                    <MenuItemHeader className="border-t mt-2">
                      Settings
                    </MenuItemHeader>
                    <MenuItem action="logout" onClick={() => signOut(auth)}>
                      <Inline gap="2" alignItems="center">
                        <LogoutIcon /> <Text fontSize="b3">Logout</Text>
                      </Inline>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            )}
          </Inline>
        </Inline>
      </Box>
      <Box as="main">
        <Outlet />
      </Box>
    </Stack>
  );
}

const menu = [
  { path: "courses", title: "Courses" },
  { path: "reviews", title: "Reviews" },
];

export function DashboardLayout() {
  const maxHeight = "calc(100vh - 112px)";
  return (
    <Inline gap="12">
      <Stack
        as="aside"
        className="w-60"
        roundedLeft="md"
        style={{ maxHeight: maxHeight, height: maxHeight }}
      >
        <DashboardSideBar />
      </Stack>
      <Box as="main" width="full" backgroundColor="surfaceBase" rounded="lg">
        <Outlet />
      </Box>
    </Inline>
  );
}

export default function DashboardSideBar() {
  const { pathname } = useLocation();
  return (
    <Stack as="ul">
      {menu.map(({ path, title }) => {
        const isActivated = pathname.includes(path);
        return (
          <Inline
            as={Link}
            to={`/dashboard/${path}`}
            paddingY="5"
            paddingX="3"
            key={path}
            rounded="lg"
            gap="3"
            alignItems="center"
            backgroundColor={isActivated ? "surfacePrimary" : "transparent"}
          >
            <Text
              fontSize="b2"
              fontWeight={isActivated ? "bold" : "normal"}
              color={isActivated ? "textHigh" : "textOnSurface"}
            >
              {title}
            </Text>
            {isActivated ? <ArrowRightIcon color="textHigh" /> : null}
          </Inline>
        );
      })}
    </Stack>
  );
}
