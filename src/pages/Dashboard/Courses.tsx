import { AddCourseInModal } from "../../Courses";
import { Button, Inline, Stack, Text, Time } from "../../components";
import { PencilIcon, PlusIcon, TrashIcon } from "../../components/Icons";
import {
  TUser,
  USER_PERMISSIONS,
  checkIfUserCan,
  useCourses,
  useMyCourses,
  useProfile,
} from "../../data";
import PlaceholderImage from "../../assets/images/placeholder.png";

export default function DashboardCoursesPage() {
  const { user } = useProfile();
  const canAddCourse = checkIfUserCan(user.role, USER_PERMISSIONS.ADD_COURSE);
  return (
    <Stack
      gap="4"
      height="full"
      className="max-h-[84svh]"
      paddingBottom="12"
      overflow="auto"
    >
      {user.role === "admin" ? (
        <MyCourses canAddCourse={canAddCourse} user={user} />
      ) : user.role === "super_admin" ? (
        <AllCourses canAddCourse={canAddCourse} user={user} />
      ) : null}
    </Stack>
  );
}

function MyCourses({
  user,
  canAddCourse,
}: {
  user: TUser;
  canAddCourse?: boolean;
}) {
  const { courses } = useMyCourses(user.uid);
  return (
    <Stack gap="6">
      <Inline
        as="header"
        alignItems="center"
        justifyContent="between"
        paddingY="4"
        paddingX="6"
      >
        <Text as="h5" fontSize="h5">
          My Courses
        </Text>
        {canAddCourse ? (
          <AddCourseInModal user={user}>
            {({ add }) => (
              <Button iconPlacement="left" level="primary" onClick={add}>
                <PlusIcon /> Add New
              </Button>
            )}
          </AddCourseInModal>
        ) : null}
      </Inline>
      <Stack as="ul" gap="4" paddingX="6">
        {courses?.length ? (
          courses.map((course) => {
            return (
              <Inline
                as="li"
                gap="4"
                alignItems="center"
                rounded="md"
                key={course.id}
                justifyContent="between"
                backgroundColor="surfaceNeutral"
              >
                <Inline gap="4" alignItems="center">
                  <img
                    src={course?.thumbnail || PlaceholderImage}
                    alt={course.title}
                    className="w-28 rounded-l-md"
                  />
                  <Stack gap="1">
                    <Text fontSize="b1">{course.title}</Text>
                    <Inline gap="2" fontSize="c1" className="text-gray-800">
                      <Text>By: {course.author.name}</Text>
                      <Text>|</Text>
                      {/* <Text>
                      Launched On: <Time timeStamp={course.started_at} />
                    </Text> */}
                    </Inline>
                  </Stack>
                </Inline>
                <Inline gap="3" paddingX="4">
                  <PencilIcon />
                  <TrashIcon />
                </Inline>
              </Inline>
            );
          })
        ) : (
          <Stack gap="2" textAlign="center" marginY="12">
            <Text fontSize="s1">No courses found!</Text>
            <Text color="textLow">
              There are no courses added by you so far. You can add course that
              has been created by you.
            </Text>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

function AllCourses({
  user,
  canAddCourse,
}: {
  user: TUser;
  canAddCourse?: boolean;
}) {
  const { courses } = useCourses();
  return (
    <Stack gap="6">
      <Inline
        as="header"
        alignItems="center"
        justifyContent="between"
        paddingY="4"
        paddingX="6"
      >
        <Text as="h5" fontSize="h5">
          All Courses
        </Text>
        {canAddCourse ? (
          <AddCourseInModal user={user}>
            {({ add }) => (
              <Button iconPlacement="left" level="primary" onClick={add}>
                <PlusIcon /> Add New
              </Button>
            )}
          </AddCourseInModal>
        ) : null}
      </Inline>
      <Stack as="ul" gap="4" paddingX="6">
        {courses?.length ? (
          courses.map((course) => {
            return (
              <Inline
                as="li"
                gap="4"
                alignItems="center"
                rounded="md"
                key={course.id}
                justifyContent="between"
                backgroundColor="surfaceNeutral"
              >
                <Inline gap="4" alignItems="center">
                  <img
                    src={course?.thumbnail || PlaceholderImage}
                    alt={course.title}
                    className="w-28 rounded-l-md"
                  />
                  <Stack gap="1">
                    <Text fontSize="b1">{course.title}</Text>
                    <Inline gap="2" fontSize="c1" className="text-gray-800">
                      <Text>By: {course.author.name}</Text>
                      <Text>|</Text>
                      {course.start?.date ? (
                        <Text>
                          Launched On: <Time timeStamp={course.start.date} />
                        </Text>
                      ) : null}
                    </Inline>
                  </Stack>
                </Inline>
                <Inline gap="3" paddingX="4">
                  <PencilIcon />
                  <TrashIcon />
                </Inline>
              </Inline>
            );
          })
        ) : (
          <Stack gap="2" textAlign="center" marginY="12">
            <Text fontSize="s1">No courses found!</Text>
            <Text color="textLow">
              There are no courses added by you so far. You can add course that
              has been created by you.
            </Text>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
