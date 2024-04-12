import { SuspenseWithPerf, useUser } from "reactfire";
import {
  Avatar,
  Box,
  Button,
  DataLoadingFallback,
  Inline,
  PageMeta,
  Stack,
  Text,
  Time,
} from "../components";
import { Link, useParams } from "react-router-dom";
import { CourseRatings, Review, useCourse, useReviews } from "../data";
import { Amount } from "../common/Amount";
import { getInitials, getLanguageValue, pluralize } from "../utils";
import { ProgressBars, Stars, getCategoryIcon } from "../common";
import { Suspense } from "react";
import { RateAndReviewCourseInModal } from "../Courses";
import { ThumbsUpIcon } from "../components/Icons";
import toast from "react-hot-toast";
import { categoryTitlesMapped } from "../common/constants";
import { User } from "firebase/auth";

export default function CoursePage() {
  const { courseId } = useParams();
  if (!courseId) return null;
  return (
    <SuspenseWithPerf
      fallback={<DataLoadingFallback label="Loading course details..." />}
      traceId="loading_course_details"
    >
      <Course key={courseId} courseId={courseId} />
    </SuspenseWithPerf>
  );
}

function Course({ courseId }: { courseId: string }) {
  const { course, reload } = useCourse(courseId);
  const { reviews, reload: reloadReviews } = useReviews(courseId);
  const { data: user } = useUser();
  return (
    <>
      <PageMeta title={course?.title || "Course"} />
      <Box marginBottom="8">
        {course?.id ? (
          <Stack gap="12">
            <Inline gap="8">
              <Stack gap="6" className="w-[80%]">
                <img
                  src={course?.thumbnail}
                  className="rounded-lg h-[320px]  object-cover"
                  alt={course?.title}
                />
              </Stack>
              <Stack paddingRight="6" gap="6" width="full" paddingY="4">
                <Text as="h5" fontSize="h5" className="line-clamp-2">
                  {course?.title}
                </Text>
                {course?.description ? (
                  <Text fontSize="b3" className="line-clamp-5">
                    {course.description}
                  </Text>
                ) : null}

                <Stack gap="1">
                  <Text>
                    Price :
                    <Amount
                      as="span"
                      className="ml-2"
                      amount={course.price}
                      currency={course.currency}
                    />
                  </Text>
                  <Text>
                    Language :
                    <Text as="span" fontSize="b3" className="ml-1">
                      {getLanguageValue(course?.language || "")}
                    </Text>
                  </Text>
                  <Inline gap="2">
                    <Text>Category :</Text>
                    <Inline gap="2" alignItems="center">
                      {getCategoryIcon({ id: course.category, size: "4" })}
                      <Text as="span">
                        {categoryTitlesMapped[course.category]}
                      </Text>
                    </Inline>
                  </Inline>
                </Stack>
                <Inline fontSize="c1" gap="3">
                  <Text>By: {course?.author.name}</Text>
                  <Text>|</Text>
                  {course?.content_url ? (
                    <Link to={course.content_url} target="_blank">
                      <Text className="underline underline-offset-[2px]">
                        Course Content
                      </Text>
                    </Link>
                  ) : null}
                  <Text>|</Text>

                  <Text>
                    Launch Details:{" "}
                    {course.start?.date ? (
                      <Time timeStamp={course.start.date} />
                    ) : (
                      <Text as="span">
                        {course.start?.isRecorded ? "Recorded" : "Live"}
                      </Text>
                    )}
                  </Text>
                </Inline>
              </Stack>
            </Inline>
            {course.ratings?.length ? (
              <Suspense fallback="Loader...">
                <Reviews
                  user={user}
                  reviews={reviews}
                  ratings={course.ratings}
                  averageRating={course.averageRatings}
                />
              </Suspense>
            ) : (
              <Stack alignItems="center" gap="6">
                <Stack alignItems="center" gap="3">
                  <Text fontSize="s1" as="h5">
                    No ratings and reviews yet!
                  </Text>
                  <Text color="textLow">
                    Be the first one to rate & review this course!
                  </Text>
                </Stack>
                <RateButton
                  courseId={courseId}
                  ratings={course?.ratings}
                  user={user}
                  onSuccess={() => {
                    reload();
                    reloadReviews();
                  }}
                />
              </Stack>
            )}
          </Stack>
        ) : null}
        {course?.ratings?.length ? (
          <Box position="fixed" bottom="0" right="0" padding="12">
            <RateButton
              courseId={courseId}
              user={user}
              ratings={course?.ratings}
              onSuccess={() => {
                reload();
                reloadReviews();
              }}
            />
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export function RateButton({
  user,
  courseId,
  ratings,
  onSuccess,
}: {
  courseId: string;
  user: User | null;
  ratings?: CourseRatings;
  onSuccess?: () => void;
}) {
  const isAlreadySubmitted = ratings?.find((el) => el.uid === user?.uid)?.uid;
  return isAlreadySubmitted ? null : (
    <RateAndReviewCourseInModal
      courseId={courseId}
      user={user}
      onSuccess={onSuccess}
    >
      {({ rate }) => (
        <Button
          size="lg"
          rounded="full"
          level="primary"
          status="success"
          iconPlacement="left"
          onClick={() => {
            if (!user?.uid) {
              return toast.error(
                "You can rate & review only when you are logged in!"
              );
            } else {
              rate();
            }
          }}
        >
          <ThumbsUpIcon />
          Rate this course
        </Button>
      )}
    </RateAndReviewCourseInModal>
  );
}

function Reviews({
  user: authUser,
  ratings,
  reviews,
  averageRating,
}: {
  user: User | null;
  reviews: Review[];
  averageRating: number;
  ratings: CourseRatings;
}) {
  const numberOfReviews = ratings?.length;
  return ratings?.length ? (
    <Stack gap="12" className="max-w-[90%]">
      <Stack gap="6">
        <Box borderBottomWidth="1" borderColor="borderOutline">
          <Text fontSize="h5" as="h5" className="pb-2">
            Ratings
          </Text>
        </Box>
        <Box gap="8" className="grid grid-cols-2 gap-8">
          <Stack
            gap="6"
            rounded="md"
            paddingY="3"
            alignItems="center"
            justifyContent="center"
            backgroundColor="surfaceBase"
            width="full"
          >
            <Stack gap="2" alignItems="center">
              {averageRating ? (
                <Stars rating={Number(averageRating)} size="4" />
              ) : null}
              <Text className="text-[44px] tracking-[4px] font-semibold">
                {averageRating}
              </Text>
              <Text fontSize="c1" color="textLow">
                Out of 5
              </Text>
            </Stack>

            <Text color="textLow" fontSize="s3">
              {numberOfReviews} {pluralize("Review", numberOfReviews)}
            </Text>
          </Stack>
          <Stack
            gap="6"
            rounded="md"
            paddingY="3"
            alignItems="center"
            justifyContent="center"
            backgroundColor="surfaceBase"
            width="full"
            paddingX="8"
          >
            <ProgressBars ratings={ratings} />
          </Stack>
        </Box>
      </Stack>
      {reviews?.length ? (
        <Stack gap="6">
          <Box borderBottomWidth="1" borderColor="borderOutline">
            <Inline
              paddingBottom="2"
              alignItems="center"
              justifyContent="between"
            >
              <Text fontSize="h5" as="h5">
                Reviews
              </Text>
            </Inline>
          </Box>
          <Box as="ul" className="grid grid-cols-2 gap-8">
            {reviews.map(
              ({ user, title, rating, description, created_at, id }) => (
                <Box
                  key={id}
                  paddingY="3"
                  paddingX="6"
                  rounded="lg"
                  backgroundColor="surfaceBase"
                >
                  <Stack gap="6">
                    <Stack gap="2">
                      <Inline alignItems="end" gap="4" justifyContent="between">
                        <Text fontSize="b3">{title}</Text>
                        {created_at ? (
                          <Time
                            fontSize="c2"
                            color="textLow"
                            timeStamp={created_at}
                          />
                        ) : null}
                      </Inline>
                      <Inline alignItems="center" justifyContent="between">
                        <Stars rating={rating} size="3" />
                        <Inline gap="2" alignItems="center">
                          <Avatar
                            id={user.uid}
                            size="6"
                            fontSize="c4"
                            initials={getInitials(user.name)}
                            image={user.photoUrl || undefined}
                          />
                          <Text fontSize="c2" color="textLow">
                            {authUser?.uid === user.uid ? "You" : user.name}
                          </Text>
                        </Inline>
                      </Inline>
                    </Stack>
                    <Text fontSize="c2">
                      {description || "Description not available!"}
                    </Text>
                  </Stack>
                </Box>
              )
            )}
          </Box>
        </Stack>
      ) : null}
    </Stack>
  ) : null;
}
