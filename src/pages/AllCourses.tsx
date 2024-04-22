import {
  Box,
  Button,
  Inline,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  PageMeta,
  SkeletonBox,
  Stack,
  Text,
  Time,
} from "../components";
import { RatingsFilter, useCoursesByCategory } from "../data";
import { categories, categoryTitlesMapped } from "../common/constants";
import {
  ArrowDownIcon,
  DocumentIcon,
  SpinnerIcon,
  StarIcon,
} from "../components/Icons";
import { Link } from "react-router-dom";
import { Amount } from "../common/Amount";
import { CourseCard } from "../Courses";

const ratingsOptions: Array<{ id: RatingsFilter; title: string }> = [
  { id: "high_to_low", title: "Highest to Lowest" },
  { id: "low_to_high", title: "Lowest to Highest" },
];

export default function AllCoursesPage() {
  const {
    courses,
    isLoading,
    params,
    isFetchingMore,
    pagination: { emptied },
    loadMore,
    setFieldValue,
  } = useCoursesByCategory();
  return (
    <>
      <PageMeta title="All Courses" />
      <Stack gap="8" marginBottom="12">
        <Stack gap="4">
          <Inline alignItems="center" justifyContent="between">
            <Box>
              <Text as="h5" fontSize={{ xs: "s2", md: "h5" }}>
                All Courses
              </Text>
            </Box>
            <Box className="hidden md:block">
              <Inline gap="4">
                <Inline gap="2" alignItems="center">
                  <Text fontSize="c2">Ratings :</Text>
                  <Menu>
                    <MenuButton inline>
                      <Inline alignItems="center" color="textOnSurface">
                        <Text>
                          {params?.ratings === "high_to_low"
                            ? "Highest to Lowest"
                            : "Lowest to Highest"}
                        </Text>
                        <ArrowDownIcon color="iconMedium" />
                      </Inline>
                    </MenuButton>
                    <MenuList align="bottom-right">
                      {ratingsOptions.map(({ id, title }) => (
                        <MenuItem
                          action={id}
                          key={id}
                          onClick={() => setFieldValue("ratings", id)}
                        >
                          <Text fontSize="b3" className="whitespace-pre">
                            {title}
                          </Text>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </Inline>
                <Inline gap="2" alignItems="center">
                  <Text fontSize="c2">Category :</Text>
                  <Menu>
                    <MenuButton inline>
                      <Inline alignItems="center" color="textOnSurface">
                        <Text>{categoryTitlesMapped?.[params.categoryId]}</Text>
                        <ArrowDownIcon color="iconMedium" />
                      </Inline>
                    </MenuButton>
                    <MenuList align="bottom-right">
                      {categories.map(({ id, title }) => (
                        <MenuItem
                          action={id}
                          key={id}
                          onClick={() => setFieldValue("categoryId", id)}
                        >
                          <Text fontSize="b3" className="whitespace-pre">
                            {title}
                          </Text>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </Inline>
              </Inline>
            </Box>
          </Inline>
          <Box className="block md:hidden">
            <Stack gap="2">
              <Inline gap="2" alignItems="center">
                <Text fontSize="c2">Ratings :</Text>
                <Menu>
                  <MenuButton inline>
                    <Inline alignItems="center" color="textOnSurface">
                      <Text>
                        {params?.ratings === "high_to_low"
                          ? "Highest to Lowest"
                          : "Lowest to Highest"}
                      </Text>
                      <ArrowDownIcon color="iconMedium" />
                    </Inline>
                  </MenuButton>
                  <MenuList align="bottom-right">
                    {ratingsOptions.map(({ id, title }) => (
                      <MenuItem
                        action={id}
                        key={id}
                        onClick={() => setFieldValue("ratings", id)}
                      >
                        <Text fontSize="b3" className="whitespace-pre">
                          {title}
                        </Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Inline>
              <Inline gap="2" alignItems="center">
                <Text fontSize="c2">Category :</Text>
                <Menu>
                  <MenuButton inline>
                    <Inline alignItems="center" color="textOnSurface">
                      <Text>{categoryTitlesMapped?.[params.categoryId]}</Text>
                      <ArrowDownIcon color="iconMedium" />
                    </Inline>
                  </MenuButton>
                  <MenuList align="bottom-right">
                    {categories.map(({ id, title }) => (
                      <MenuItem
                        action={id}
                        key={id}
                        onClick={() => setFieldValue("categoryId", id)}
                      >
                        <Text fontSize="b3" className="whitespace-pre">
                          {title}
                        </Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Inline>
            </Stack>
          </Box>
        </Stack>
        {isLoading ? (
          <Box as="ul" className="grid grid-cols-2 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Box
                key={i}
                as="li"
                style={{
                  height: 260,
                  width: "100%",
                }}
              >
                <SkeletonBox height="full" width="full" />
              </Box>
            ))}
          </Box>
        ) : courses.length ? (
          <>
            <Box as="ul" className="hidden xl:grid grid-cols-2 gap-6 gap-y-4">
              {courses.map(
                ({
                  id,
                  title,
                  thumbnail,
                  averageRatings,
                  ratings,
                  currency,
                  price,
                  start,
                  author,
                  description,
                }) => (
                  <Box
                    as="li"
                    key={id}
                    style={{
                      width: "100%",
                    }}
                    rounded="lg"
                    backgroundColor="surfaceBase"
                  >
                    <Box as={Link} width="full" to={`/courses/${id}`}>
                      <Inline gap="2">
                        <Box
                          position="relative"
                          className="max-w-[44%] min-w-[44%] h-[180px]"
                          padding="2"
                        >
                          <img
                            className="w-full h-full rounded-lg object-cover"
                            src={thumbnail}
                            alt={title}
                          />
                        </Box>
                        <Stack paddingY="4" width="full" paddingRight="4">
                          <Stack gap="3">
                            <Inline gap="2" justifyContent="between">
                              <Stack gap="1">
                                <Text
                                  fontSize="b1"
                                  className="break-words line-clamp-1 mr-4"
                                >
                                  {title}
                                </Text>
                                <Text fontSize="c3">By: {author.name}</Text>
                              </Stack>
                              <Stack gap="1">
                                <Text
                                  fontSize="b1"
                                  className="break-words line-clamp-1 mr-4"
                                >
                                  Price
                                </Text>
                                <Amount
                                  fontSize="c3"
                                  currency={currency}
                                  amount={price}
                                />
                              </Stack>
                            </Inline>
                            <Text fontSize="c2" className="h-8 line-clamp-2">
                              {description}
                            </Text>
                            <Inline
                              rounded="md"
                              paddingX="3"
                              paddingY="2"
                              gap="6"
                              className="bg-[#1A1B25]"
                              fontSize="c1"
                            >
                              {averageRatings ? (
                                <Stack
                                  gap="1"
                                  borderRightWidth="1"
                                  className="w-[33%]"
                                >
                                  <Text>Ratings</Text>
                                  <Inline
                                    gap="2"
                                    rounded="lg"
                                    alignItems="center"
                                  >
                                    <StarIcon
                                      size="3"
                                      color={
                                        averageRatings === 5
                                          ? "iconSuccess"
                                          : averageRatings === 1
                                          ? "iconError"
                                          : "iconPrimary"
                                      }
                                    />
                                    <Text fontSize="c1">{averageRatings}</Text>
                                  </Inline>
                                </Stack>
                              ) : null}
                              {ratings?.length ? (
                                <Stack
                                  gap="1"
                                  borderRightWidth="1"
                                  className="w-[33%]"
                                >
                                  <Text>Reviews</Text>
                                  <Text className="line-clamp-1">
                                    {ratings?.length}
                                  </Text>
                                </Stack>
                              ) : null}

                              <Stack gap="1" className="w-[33%]">
                                <Text>Launch Date</Text>
                                {start.date ? (
                                  <Time
                                    timeStamp={start.date}
                                    format="dd MMM, yy"
                                  />
                                ) : start.isRecorded ? (
                                  <Text>Recorded</Text>
                                ) : (
                                  <Text>Live</Text>
                                )}
                              </Stack>
                            </Inline>
                          </Stack>
                        </Stack>
                      </Inline>
                    </Box>
                  </Box>
                )
              )}
            </Box>
            <Box as="ul" gap="6" flexWrap="wrap" className="flex xl:hidden">
              {courses.map((course) => (
                <CourseCard course={course} key={course.id} />
              ))}
            </Box>
          </>
        ) : (
          <Stack alignItems="center" gap="6" marginY="24">
            <DocumentIcon size="12" />
            <Stack gap="3" alignItems="center">
              <Text fontSize="s2">No courses found!</Text>
              <Text fontSize="b3" color="textLow">
                We could not find courses here. Try changing the filters!
              </Text>
            </Stack>
          </Stack>
        )}
        {!emptied ? (
          <Stack alignItems="center" marginTop="12">
            <Button onClick={loadMore} loading={isFetchingMore}>
              {isFetchingMore ? <SpinnerIcon /> : null} Load More
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </>
  );
}
