import { TUser, useProfile } from "../data";
import {
  Avatar,
  Box,
  Button,
  DataLoadingFallback,
  Inline,
  Stack,
  Text,
} from "../components";
import { getInitials } from "../utils";
import { SuspenseWithPerf } from "reactfire";
import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "../components/Icons";

export default function ProfilePage() {
  const { user } = useProfile();
  if (!user || !user.uid) return null;
  return (
    <SuspenseWithPerf
      fallback={<DataLoadingFallback label="Loading profile details..." />}
      traceId="loading_profile_details"
    >
      <Profile user={user} />
    </SuspenseWithPerf>
  );
}

function Profile({ user }: { user: TUser }) {
  const user_initials = getInitials(user.name);
  const navigate = useNavigate();
  return (
    <Box
      width="full"
      display="flex"
      paddingY="8"
      className="h-[62svh]"
      justifyContent="center"
    >
      {user?.uid ? (
        <Box
          width="full"
          maxWidth="2xl"
          paddingY="12"
          paddingX="8"
          rounded="lg"
          backgroundColor="surfaceBase"
        >
          <Inline gap="4">
            <Avatar
              size="18"
              id={user.uid}
              initials={user_initials}
              fontSize="h5"
              image={user?.displayPicture || undefined}
            />
            <Stack gap="8">
              <Stack gap="2">
                <Text fontSize="b1">Name</Text>
                <Text fontSize="h4">{user?.name}</Text>
              </Stack>
              <Stack>
                <Text>{user?.email}</Text>
              </Stack>
              <Stack gap="4">
                {user.roles?.length ? (
                  <Button
                    level="primary"
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                  >
                    Visit Dashboard
                  </Button>
                ) : null}
                <Inline gap="4">
                  <Button>Edit Profile</Button>
                  <Button level="primary" status="danger">
                    <LogoutIcon />
                    Logout
                  </Button>
                </Inline>
              </Stack>
            </Stack>
          </Inline>
        </Box>
      ) : null}
    </Box>
  );
}
