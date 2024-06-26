import { Link, useNavigate } from "react-router-dom";
import { CourseBox, CourseCard } from "../Courses";
import {
  Box,
  Button,
  Inline,
  SkeletonBox,
  Stack,
  Text,
  PageMeta,
} from "../components";
import {
  useCoursesByCategory,
  usePopularCourses,
  useTopCourses,
} from "../data/courses";
import { Stars } from "../common";

import Ratings from "../assets/images/ratings4.png";
import { useCategories } from "../data";
import { SkeletonTitle } from "../components/Skeletons";
import { CategoryIcon } from "../Categories";

export default function Home() {
  const navigate = useNavigate();
  const { isLoading, courses } = useTopCourses();
  const { isLoading: popularCoursesLoading, courses: popularCourses } =
    usePopularCourses();
  const { isLoading: categoriesLoading, categories } = useCategories();
  const {
    params,
    courses: coursesByCategory,
    isLoading: categoryLoading,
    setFieldValue,
  } = useCoursesByCategory();

  return (
    <>
      <PageMeta title="Home" />
      <Box marginY="8">
        <Stack gap="12">
          <Stack gap="4">
            <Inline justifyContent="between" alignItems="center">
              <Text as="h5" fontSize="h5">
                Top 5 of the month
              </Text>
              <Button inline onClick={() => navigate("/courses")}>
                See All
              </Button>
            </Inline>
            <Box className="hidden xl:block">
              {isLoading ? (
                <SkeletonTopCategories />
              ) : courses?.length ? (
                <Inline gap="6">
                  <Box
                    as={Link}
                    className="w-1/2 h-[320px] xl:h-[420px] "
                    to={`/courses/${courses[0].id}`}
                  >
                    <CourseBox
                      courseId={courses[0].id}
                      title={courses[0].title}
                      thumbnail={courses[0].thumbnail}
                      avgRatings={courses[0].averageRatings}
                      ratingCount={courses[0].ratings?.length}
                    />
                  </Box>
                  {courses.length > 1 ? (
                    <Box width="1/2" className="grid grid-cols-2 gap-6">
                      {courses[1]?.id ? (
                        <Box
                          className="lw-[100%]"
                          as={Link}
                          to={`/courses/${courses[1].id}`}
                        >
                          <CourseBox
                            size="sm"
                            courseId={courses[1].id}
                            title={courses[1].title}
                            thumbnail={courses[1]?.thumbnail}
                            avgRatings={courses[1].averageRatings}
                            ratingCount={courses[1].ratings?.length}
                          />
                        </Box>
                      ) : (
                        <Box
                          style={{
                            width: "100%",
                          }}
                        ></Box>
                      )}
                      {courses[2]?.id ? (
                        <Box
                          style={{
                            width: "100%",
                          }}
                          as={Link}
                          to={`/courses/${courses[2].id}`}
                        >
                          <CourseBox
                            size="sm"
                            courseId={courses[2].id}
                            title={courses[2].title}
                            thumbnail={courses[2]?.thumbnail}
                            avgRatings={courses[2].averageRatings}
                            ratingCount={courses[2].ratings?.length}
                          />
                        </Box>
                      ) : null}
                      {courses[3]?.id ? (
                        <Box
                          style={{
                            width: "100%",
                          }}
                          as={Link}
                          to={`/courses/${courses[3].id}`}
                        >
                          <CourseBox
                            size="sm"
                            courseId={courses[3].id}
                            title={courses[3].title}
                            thumbnail={courses[3]?.thumbnail}
                            avgRatings={courses[3].averageRatings}
                            ratingCount={courses[3].ratings?.length}
                          />
                        </Box>
                      ) : (
                        <Box
                          style={{
                            width: "100%",
                          }}
                        ></Box>
                      )}
                      {courses[4]?.id ? (
                        <Box
                          style={{
                            width: "100%",
                          }}
                          as={Link}
                          to={`/courses/${courses[4].id}`}
                        >
                          <CourseBox
                            size="sm"
                            courseId={courses[4].id}
                            title={courses[4].title}
                            thumbnail={courses[4]?.thumbnail}
                            avgRatings={courses[4].averageRatings}
                            ratingCount={courses[4].ratings?.length}
                          />
                        </Box>
                      ) : (
                        <Box
                          style={{
                            width: "100%",
                          }}
                        ></Box>
                      )}
                    </Box>
                  ) : null}
                </Inline>
              ) : null}
            </Box>
            <Box className="block xl:hidden">
              {isLoading ? (
                <Inline gap="6" flexWrap="wrap">
                  <Box
                    style={{
                      height: 260,
                    }}
                    className="w-[48%]"
                  >
                    <SkeletonBox width="full" height="full" />
                  </Box>
                  <Box
                    style={{
                      height: 260,
                    }}
                    className="w-[48%]"
                  >
                    <SkeletonBox width="full" height="full" />
                  </Box>
                  <Box
                    style={{
                      height: 260,
                    }}
                    className="w-[48%]"
                  >
                    <SkeletonBox width="full" height="full" />
                  </Box>
                  <Box
                    style={{
                      height: 260,
                    }}
                    className="w-[48%]"
                  >
                    <SkeletonBox width="full" height="full" />
                  </Box>
                </Inline>
              ) : courses?.length ? (
                <Inline gap="6" flexWrap="wrap">
                  {courses.map((course) => (
                    <Box
                      key={course.id}
                      className="w-full md:w-[48%] h-[320px] md:h-[260px]"
                    >
                      <CourseBox
                        courseId={course.id}
                        title={course.title}
                        thumbnail={course.thumbnail}
                        avgRatings={course.averageRatings}
                        ratingCount={course.ratings?.length}
                      />
                    </Box>
                  ))}
                </Inline>
              ) : null}
            </Box>
          </Stack>
          <Box backgroundColor="white" padding="12" rounded="lg">
            <Inline color="textHigh" gap="3" justifyContent="between">
              <Stack width="full" gap="4">
                <Stack gap="2" maxWidth="md">
                  <Text as="h1" fontSize="h1">
                    Rate your experience
                  </Text>
                  <Text color="textLow">
                    Did you like the experience of your picked up courses?
                    Kindly rate courses where you have been a participant to
                    help others to choose wisely.
                  </Text>
                </Stack>
                <Stars rating={4} size={{ xs: "6", md: "8", xl: "12" }} />
                <Box marginTop="5">
                  <Box
                    className="w-fit"
                    backgroundColor="black"
                    color={"white"}
                    rounded="full"
                    paddingY="3"
                    paddingX="6"
                  >
                    <Text className="text-xl font-semibold">Submit</Text>
                  </Box>
                </Box>
              </Stack>
              <Box
                position="relative"
                className="hidden xl:block xl:w-full w-0"
              >
                <img
                  alt='Ratings Vector Image'
                  src={Ratings}
                  className="absolute -bottom-[10px] 2xl:-bottom-[80px] h-[280px] 2xl:h-[420px]"
                />
              </Box>
            </Inline>
          </Box>
          <Stack gap="4">
            <Text as="h5" fontSize="h5">
              Explore by categories
            </Text>
            <Inline as="ul" gap="4" flexWrap="wrap">
              {categoriesLoading
                ? [0, 1, 2, 3].map((i) => <SkeletonTitle key={i} />)
                : categories?.length
                ? [{id: 'all', title: 'All'}].concat(categories).map(({ id, title }) => {
                    const isSelected = params.category.id === id;
                    return (
                      <Inline
                        key={id}
                        as="button"
                        gap="2"
                        rounded="full"
                        color={isSelected ? "textHigh" : "textOnSurface"}
                        backgroundColor={
                          isSelected ? "surfaceDefault" : "surfaceNeutral"
                        }
                        paddingX="4"
                        paddingY="3"
                        textAlign="center"
                        alignItems="center"
                        justifyContent="center"
                        className='min-w-[80px]'
                        onClick={() => {
                          setFieldValue("category", {id, title});
                        }}
                      >
                        <CategoryIcon id={id} size="6" />
                        <Text fontSize="b3" className="words-break">
                          {title}
                        </Text>
                      </Inline>
                    );
                  })
                : null}
            </Inline>
            {categoryLoading ? (
              <Box as="ul" display="flex" gap="4">
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    as="li"
                    style={{
                      height: 380,
                      width: 280,
                    }}
                  >
                    <SkeletonBox height="full" width="full" />
                  </Box>
                ))}
              </Box>
            ) : coursesByCategory?.length ? (
              <Inline as="ul" gap="4" overflowX="auto">
                {coursesByCategory.map((course) => (
                  <CourseCard course={course} key={course.id} />
                ))}
              </Inline>
            ) : (
              <Box className="h-[280px]">No content found!</Box>
            )}
          </Stack>
          <Stack gap="4">
            <Inline justifyContent="between" alignItems="center">
              <Text as="h5" fontSize="h5">
                Popular ones
              </Text>
              <Box paddingRight="12">
                <Button inline onClick={() => navigate("/courses")}>
                  See All
                </Button>
              </Box>
            </Inline>
            <Box as="ul" className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularCoursesLoading
                ? [1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      as="li"
                      style={{
                        height: 180,
                        width: 320,
                      }}
                    >
                      <SkeletonBox width="full" height="full" />
                    </Box>
                  ))
                : popularCourses.map(
                    ({ id, title, averageRatings, thumbnail, ratings }) => (
                      <Box
                        key={id}
                        as={"li"}
                        style={{
                          height: 180,
                          width: "100%",
                        }}
                      >
                        <Box as={Link} to={`/courses/${id}`}>
                          <CourseBox
                            size="sm"
                            courseId={id}
                            title={title}
                            thumbnail={thumbnail}
                            avgRatings={averageRatings}
                            ratingCount={ratings?.length}
                          />
                        </Box>
                      </Box>
                    )
                  )}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

function SkeletonTopCategories() {
  return (
    <Inline gap="6">
      <Box
        style={{
          height: 420,
        }}
        width="1/2"
      >
        <SkeletonBox width="full" height="full" />
      </Box>
      <Inline width="1/2" gap="6" flexWrap="wrap">
        <Box
          style={{
            width: "48%",
          }}
        >
          <SkeletonBox width="full" height="full" />
        </Box>
        <Box
          style={{
            width: "48%",
          }}
        >
          <SkeletonBox width="full" height="full" />
        </Box>
        <Box
          style={{
            width: "48%",
          }}
        >
          <SkeletonBox width="full" height="full" />
        </Box>
        <Box
          style={{
            width: "48%",
          }}
        >
          <SkeletonBox width="full" height="full" />
        </Box>
      </Inline>
    </Inline>
  );
}
