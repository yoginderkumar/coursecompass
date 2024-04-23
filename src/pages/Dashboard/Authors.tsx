import { AddAuthorInModal } from "../../Authors";
import { Box, Button, Circle, Inline, Stack, Text } from "../../components";
import { PlusIcon } from "../../components/Icons";
import {
  USER_PERMISSIONS,
  checkIfUserCan,
  useAuthors,
  useProfile,
} from "../../data";
import { getInitials } from "../../utils";

export default function DashboardAuthorsPage() {
  const { user } = useProfile();
  const { authors } = useAuthors();
  const canAddAuthor = checkIfUserCan(user.role, USER_PERMISSIONS.ADD_AUTHOR);
  return (
    <Stack
      gap="4"
      height="full"
      className="max-h-[84svh]"
      paddingBottom="12"
      overflow="auto"
    >
      <Inline
        as="header"
        alignItems="center"
        justifyContent="between"
        paddingY="4"
        paddingX="6"
      >
        <Text as="h5" fontSize="h5">
          Authors
        </Text>
        {canAddAuthor ? (
          <AddAuthorInModal>
            {({ add }) => (
              <Button iconPlacement="left" level="primary" onClick={add}>
                <PlusIcon /> Add New
              </Button>
            )}
          </AddAuthorInModal>
        ) : null}
      </Inline>
      <Box paddingX="6">
        {authors?.length ? (
          <Inline as="ul" gap="4" flexWrap="wrap">
            {authors.map((author) => (
              <Box key={author.uid}>
                <Circle backgroundColor="white" size="14">
                  {author.displayPicture ? (
                    <img
                      src={author.displayPicture}
                      alt={author.name}
                      className="w-14 h-14 object-contain rounded-full"
                    />
                  ) : (
                    <Text>{getInitials(author.name)}</Text>
                  )}
                </Circle>
              </Box>
            ))}
          </Inline>
        ) : (
          <Stack gap="2" textAlign="center" marginY="12">
            <Text fontSize="s1">No courses found!</Text>
            <Text color="textLow">
              There are no courses added by you so far. You can add course that
              has been created by you.
            </Text>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
