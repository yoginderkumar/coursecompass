import { AddCategoryInModal, CategoryIcon } from "../../Categories";
import { Box, Button, Inline, Stack, Text } from "../../components";
import { PlusIcon } from "../../components/Icons";
import { SkeletonTitle } from "../../components/Skeletons";
import {
  USER_PERMISSIONS,
  checkIfUserCan,
  useCategories,
  useProfile,
} from "../../data";

export default function DashboardCategoriesPage() {
  const { user } = useProfile();
  const canAddCategory = checkIfUserCan(
    user.role,
    USER_PERMISSIONS.ADD_CATEGORY
  );
  const { categories, isLoading, reload } = useCategories();
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
          Categories
        </Text>
        {canAddCategory ? (
          <AddCategoryInModal onSuccess={reload}>
            {({ add }) => (
              <Button iconPlacement="left" level="primary" onClick={add}>
                <PlusIcon /> Add New
              </Button>
            )}
          </AddCategoryInModal>
        ) : null}
      </Inline>
      <Inline as="ul" gap="6" paddingX="6" flexWrap="wrap">
        {isLoading
          ? [0, 1, 2, 3, 4].map((i) => (
              <Box key={i} height="24" width="24" rounded="md" as="li">
                <SkeletonTitle
                  backgroundColor="surfaceMain"
                  width="full"
                  height="6"
                />
              </Box>
            ))
          : categories?.length
          ? categories.map((category) => (
              <Inline
                key={category.id}
                backgroundColor="surfaceMain"
                paddingY="3"
                paddingX="6"
                rounded="full"
                as="li"
                alignItems="center"
                gap="4"
              >
                <CategoryIcon id={category.id} size="5" />
                {category.title}
              </Inline>
            ))
          : null}
      </Inline>
    </Stack>
  );
}
