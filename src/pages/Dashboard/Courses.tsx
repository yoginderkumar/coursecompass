import { AddCourseInModal } from "../../Courses";
import { Button, Inline, Stack, Text, Time } from "../../components";
import { PencilIcon, PlusIcon, TrashIcon } from "../../components/Icons";
import { useCourses } from "../../data";
import PlaceholderImage from "../../assets/images/placeholder.png";

export default function DashboardCoursesPage() {
  const { courses } = useCourses();
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
          Courses
        </Text>
        <AddCourseInModal>
          {({ add }) => (
            <Button iconPlacement="left" level="primary" onClick={add}>
              <PlusIcon /> Add New
            </Button>
          )}
        </AddCourseInModal>
      </Inline>
      <Stack as="ul" gap="4" paddingX="6">
        {courses.map((course) => {
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
                    <Text>By: {course.creator}</Text>
                    <Text>|</Text>
                    <Text>
                      Launched On: <Time timeStamp={course.started_at} />
                    </Text>
                  </Inline>
                </Stack>
              </Inline>
              <Inline gap="3" paddingX="4">
                <PencilIcon />
                <TrashIcon />
              </Inline>
            </Inline>
          );
        })}
      </Stack>
    </Stack>
  );
}
