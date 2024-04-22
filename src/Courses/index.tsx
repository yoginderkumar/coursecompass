import { getColorForString } from "generate-colors";
import * as Validator from "yup";
import {
  Alert,
  Box,
  Button,
  Dropdown,
  FormField,
  Inline,
  Modal,
  ModalBody,
  ModalFooter,
  Stack,
  Text,
  Time,
  formikOnSubmitWithErrorHandling,
  useOverlayTriggerState,
} from "../components";
import { ArrowDownIcon, SpinnerIcon, StarIcon } from "../components/Icons";
import { Form, Formik } from "formik";
import toast from "react-hot-toast";
import {
  CURRENCY_TYPES,
  Course,
  TUser,
  USER_PERMISSIONS,
  checkIfUserCan,
  useAddNewCourse,
  useAddRatingAndReview,
  useAddRequest,
  useAuthorsOnce,
  useCategories,
} from "../data";
import {
  FormImageFileField,
  FormTextArea,
  InputLabel,
  Textarea,
} from "../components/Form";
import { ratingHelper } from "../common/constants";
import { User } from "firebase/auth";
import { dateToTimestamp, getLanguageValue, pluralize } from "../utils";
import { Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Amount } from "../common/Amount";
import PlaceholderImage from "../assets/images/placeholder.png";
import { SelectAuthor } from "../Authors";
import { CategoryIcon } from "../Categories";
import { useMemo } from "react";
import { SearchSelect } from "../components/Select";
import { DropdownOption } from "../components/Dropdown";

export function CourseBox({
  title,
  courseId,
  thumbnail,
  size,
  avgRatings,
  ratingCount,
}: {
  courseId: string;
  title: string;
  thumbnail?: string;
  size?: "sm" | "md" | "lg";
  avgRatings?: number;
  ratingCount?: number;
}) {
  const [r, g, b] = getColorForString(courseId);
  return (
    <Box
      style={{
        background: `url(${thumbnail || PlaceholderImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      rounded="lg"
      position="relative"
      width="full"
      height="full"
      className="group"
      cursor="pointer"
    >
      {size === "sm" && avgRatings ? (
        <Box
          gap="1"
          position="absolute"
          paddingX="2"
          paddingY="1"
          rounded="lg"
          right="0"
          margin="2"
          className="hidden group-hover:flex"
          backgroundColor="surfaceBase"
          alignItems="center"
        >
          <StarIcon size="4" color="iconPrimary" />
          <Text fontSize="c3">{avgRatings}</Text>
        </Box>
      ) : null}

      <Box
        position="absolute"
        bottom="0"
        right="0"
        paddingY="3"
        paddingX="4"
        style={{
          width: "100%",
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
        }}
        roundedBottom="lg"
        className={`${size === "sm" ? "hidden" : "block"} group-hover:block`}
      >
        <Inline gap="6" alignItems="center" justifyContent="between">
          <Text fontSize="c1" className="line-clamp-1">
            {title}
          </Text>
          <Inline className="min-w-fit" alignItems="center">
            {size !== "sm" ? (
              <Inline gap="1" alignItems="center">
                <StarIcon size="4" color="iconPrimary" />
                <Text fontSize="c1">{avgRatings}</Text>
              </Inline>
            ) : null}

            <span className="w-1 h-1 mx-1.5 bg-[white] rounded-full dark:bg-gray-400"></span>
            <Text fontSize="c1" className="underline">
              {ratingCount || 0} {pluralize(`review`, ratingCount || 0)}
            </Text>
          </Inline>
        </Inline>
      </Box>
    </Box>
  );
}

export function RateAndReviewCourseInModal({
  children,
  ...props
}: {
  children: (props: { rate: () => void }) => React.ReactNode;
} & React.ComponentProps<typeof RateAndReviewCourseForm>) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({
        rate: state.open,
      })}
      <Modal
        isOpen={state.isOpen}
        isDismissable
        title="Rate & Review"
        onClose={state.close}
      >
        <RateAndReviewCourseForm {...props} onClose={state.close} />
      </Modal>
    </>
  );
}

const MAX_DESCRIPTION = 500;

const rateAndReviewCourseValidation = Validator.object().shape({
  ratingValue: Validator.number().required("Please add a valid rating!"),
  title: Validator.string()
    .min(4)
    .max(100)
    .required("Please enter title for your review!"),
  description: Validator.string().max(
    MAX_DESCRIPTION,
    "You can add upto 500 characters maximum!"
  ),
});

function RateAndReviewCourseForm({
  user,
  courseId,
  onClose,
  onSuccess,
}: {
  courseId: string;
  user: User | null;
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const addRateAndReview = useAddRatingAndReview(courseId);
  return (
    <Formik
      initialValues={{
        ratingValue: undefined as number | undefined,
        title: "" as string,
        description: "" as string,
      }}
      validationSchema={rateAndReviewCourseValidation}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        if (values.ratingValue && user?.uid) {
          await addRateAndReview({
            title: values.title,
            rating: values.ratingValue,
            description: values.description,
            user: {
              uid: user.uid,
              name: user?.displayName || "",
              photoUrl: user?.photoURL,
              isVerified: user.emailVerified,
            },
          });
          onSuccess?.();
          onClose?.();
          toast.success("Thanks for your valuable feedback!");
        }
      })}
    >
      {({
        values: { ratingValue, description },
        errors,
        isSubmitting,
        status,
        setFieldValue,
      }) => (
        <Form
          noValidate
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <ModalBody>
            <Stack gap="8">
              {status ? (
                <Alert status="error" margin="0">
                  {status}
                </Alert>
              ) : null}
              <Stack gap="2">
                <Inline gap="4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Button
                      key={i}
                      inline
                      onClick={() => {
                        setFieldValue("ratingValue", i);
                      }}
                    >
                      {!ratingValue || ratingValue < i ? (
                        <StarIcon
                          color="transparent"
                          className="stroke-2 stroke-[#ffe234] hover:text-[#ffe234]"
                        />
                      ) : (
                        <StarIcon color="ratingColor" />
                      )}
                    </Button>
                  ))}
                </Inline>
                {errors.ratingValue?.length ? (
                  <Text className="text-red-900 text-xs">
                    {errors.ratingValue}
                  </Text>
                ) : ratingValue ? (
                  <Text fontSize="c2">
                    {ratingHelper?.[ratingValue]?.text ||
                      "Please select a valid rating!"}
                  </Text>
                ) : null}
              </Stack>
              <FormField
                name="title"
                noMargin
                required
                label="Review Title"
                placeholder="Eg. I recommend this course"
              />
              <Stack gap="1">
                <Textarea
                  rows={5}
                  label="Review Description"
                  name="description"
                  maxLength={MAX_DESCRIPTION}
                  placeholder="Eg. I took this course and it changed my career forever."
                  onChange={(e) =>
                    setFieldValue("description", e.currentTarget.value)
                  }
                />
                <Text fontSize="c2">
                  {description.length}/{MAX_DESCRIPTION}
                </Text>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="lg" loading={isSubmitting}>
              Send Your Review
            </Button>
            <Button size="lg" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

export function AddCourseInModal({
  children,
  ...props
}: React.ComponentProps<typeof AddNewCourseForm> & {
  children: (props: { add: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({
        add: state.open,
      })}
      <Modal
        isOpen={state.isOpen}
        isDismissable
        title="Add new course"
        placement="right"
        onClose={state.close}
      >
        <AddNewCourseForm {...props} close={state.close} />
      </Modal>
    </>
  );
}

const languages = [
  { id: "en", label: "English" },
  { id: "hi", label: "Hindi" },
  { id: "fr", label: "French" },
  { id: "es", label: "Spanish" },
  { id: "de", label: "German" },
];

const currencies: Array<{ id: CURRENCY_TYPES; label: string }> = [
  { id: "INR", label: "INR" },
  { id: "USD", label: "USD" },
  { id: "EUR", label: "EUR" },
];

const MAX_DESCRIPTION_LENGTH = 500;

type TAuthorForPayload = {
  uid: string;
  name: string;
  isVerified?: boolean;
  photoUrl?: string | null;
  reference_uid?: string;
};

type TStartPayload = {
  date?: Timestamp;
  isRecorded?: boolean;
  isLive?: boolean;
};

function AddNewCourseForm({
  user,
  close,
}: {
  user: TUser;
  close?: () => void;
}) {
  const canMentionAuthor = checkIfUserCan(
    user.role,
    USER_PERMISSIONS.MENTION_OTHER_AUTHOR
  );
  const { authors } = useAuthorsOnce();
  const addNewCourse = useAddNewCourse();
  const { categories } = useCategories();

  const categoryOptions: DropdownOption[] = useMemo(() => {
    return categories.map((category) => {
      return {
        id: category.id,
        label: category.title,
      };
    });
  }, [categories]);

  return (
    <Formik
      initialValues={{
        language: "" as string,
        content_url: "" as string,
        currency: "INR" as CURRENCY_TYPES,
        description: "" as string,
        price: 0 as number,
        thumbnail: undefined as File | undefined,
        title: "" as string,
        category: null as { id: string; title: string } | null,
        author: undefined as TAuthorForPayload | undefined,
        start: undefined as TStartPayload | undefined,
      }}
      onSubmit={formikOnSubmitWithErrorHandling(
        async (values, { resetForm }) => {
          if (!values.thumbnail)
            throw new Error("Please upload a valid image!");
          let author: TAuthorForPayload | undefined = undefined;
          if (user.role === "admin") {
            author = {
              uid: user.uid,
              name: user.name,
              isVerified: user.emailVerified,
              photoUrl: user.displayPicture,
              reference_uid: user.uid,
            };
          } else {
            author = values.author;
          }
          if (!author?.uid) {
            throw new Error("Please select a valid author for the course!");
          }
          if (!values.start) {
            throw new Error("Please select a start period for the course!");
          }
          if (!values.category?.id) {
            throw new Error("Please select a category for the course!");
          }
          await addNewCourse({
            ...values,
            author,
            category: { ...values.category },
            image: values.thumbnail,
            start: { ...values.start },
          });
          close?.();
          toast.success("Course added successfully!");
          resetForm();
        }
      )}
    >
      {({ values, isSubmitting, status, setFieldValue, submitForm }) => (
        <Form
          noValidate
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <ModalBody>
            <FormField
              required
              name="title"
              placeholder="Enter title"
              label="Title"
            />
            <FormTextArea
              label="Description"
              placeholder="Description for the course"
              name="description"
              rows={3}
              maxLength={MAX_DESCRIPTION_LENGTH}
              help={`${values.description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
            />
            <Stack gap="6" marginBottom="6">
              <SearchSelect
                searchPlaceholder="Search or Select"
                control="input"
                label="Category"
                value={
                  values.category?.id
                    ? { id: values.category.id, label: values.category.title }
                    : null
                }
                onChange={(option) => {
                  if (option?.id) {
                    setFieldValue("category", {
                      id: option.id,
                      title: option.label,
                    });
                  }
                }}
                options={categoryOptions}
              />
              <Dropdown
                value={values?.language}
                control="input"
                label="Select Language"
                searchPlaceholder="Select any language"
                onChange={(e) => {
                  if (e?.id) {
                    setFieldValue("language", e?.id);
                  }
                }}
                alternateBase
                options={languages}
              />
            </Stack>
            <Inline gap="6">
              <FormField
                required
                fullWidth
                name="content_url"
                placeholder="Enter content url"
                label="Content URL"
              />
            </Inline>
            <Stack gap="1">
              <InputLabel fieldId="thumbnail_label">Thumbnail</InputLabel>
              <FormImageFileField name="thumbnail" />
            </Stack>

            {canMentionAuthor ? (
              <Box marginBottom="6">
                <SelectAuthor
                  authors={authors}
                  value={
                    values.author?.uid
                      ? { id: values.author?.uid, label: values.author.name }
                      : null
                  }
                  onChange={(option) => {
                    if (option?.id) {
                      const foundAuthor = authors.find(
                        (author) => author.uid === option.id
                      );
                      if (foundAuthor) {
                        setFieldValue("author", {
                          uid: foundAuthor.uid,
                          name: foundAuthor.name,
                          isVerified: true,
                          photoUrl: foundAuthor.displayPicture,
                          reference_uid: foundAuthor.reference_uid,
                        });
                      }
                    }
                  }}
                />
              </Box>
            ) : null}
            <Inline gap="6" alignItems="center">
              <FormField
                required
                fullWidth
                name="started_at"
                placeholder="DD/MM/YYYY"
                type="date"
                label="Starts On/Started On"
                onChange={(e) => {
                  if (values.start) {
                    setFieldValue("start", {
                      ...values.start,
                      isRecorded: false,
                      date: dateToTimestamp(new Date(e.currentTarget.value)),
                    });
                  } else {
                    setFieldValue("start", {
                      date: dateToTimestamp(new Date(e.currentTarget.value)),
                    });
                  }
                }}
              />
              <Box
                backgroundColor={
                  values?.start?.isRecorded
                    ? "surfacePrimaryLowest"
                    : "surfaceNeutralLowest"
                }
                fontSize="c1"
                className="h-[40px]"
                paddingY="2"
                paddingX="3"
                rounded="md"
                display="flex"
                alignItems="center"
                cursor="pointer"
                onClick={() => {
                  setFieldValue("start", {
                    isRecorded: true,
                  });
                }}
                color={values?.start?.isRecorded ? "textPrimary" : "textMedium"}
              >
                Recorded
              </Box>
              <Box
                cursor="pointer"
                backgroundColor={
                  values?.start?.isLive
                    ? "surfacePrimaryLowest"
                    : "surfaceNeutralLowest"
                }
                fontSize="c1"
                className="h-[40px]"
                display="flex"
                alignItems="center"
                paddingY="2"
                paddingX="3"
                rounded="md"
                color={values?.start?.isLive ? "textPrimary" : "textMedium"}
                onClick={() => {
                  if (values.start) {
                    setFieldValue("start", {
                      ...values.start,
                      isRecorded: false,
                      isLive: true,
                    });
                  } else {
                    setFieldValue("start", {
                      isLive: true,
                    });
                  }
                }}
              >
                Live
              </Box>
            </Inline>
            <Inline gap="8">
              <Inline
                gap="4"
                alignItems="center"
                onClick={() => {
                  window.scrollTo(0, document.body.scrollHeight);
                }}
              >
                <FormField
                  name="price"
                  type="number"
                  label="Price"
                  placeholder="Enter course price"
                />
                <Dropdown
                  value={values?.currency}
                  labelButton={
                    <Inline
                      borderWidth="1"
                      rounded="md"
                      paddingX="3"
                      className="h-[40px]"
                      alignItems="center"
                    >
                      <Text fontSize="b3">{values.currency}</Text>
                      <ArrowDownIcon />
                    </Inline>
                  }
                  alternateBase
                  removeActionButtons
                  onChange={(e) => {
                    if (e?.id) {
                      setFieldValue("currency", e?.id);
                    }
                  }}
                  control="button"
                  options={currencies}
                />
              </Inline>
            </Inline>
            {status ? <Alert status="error">{status}</Alert> : null}
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              onClick={submitForm}
            >
              Add This Course
            </Button>
            <Button size="lg" disabled={isSubmitting} onClick={close}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const {
    thumbnail,
    title,
    id,
    author,
    currency,
    price,
    description,
    category,
    language,
    ratings,
    start,
    averageRatings,
  } = course;
  return (
    <Box
      as={Link}
      to={`/courses/${id}`}
      height="full"
      className="w-full relative max-w-[320px] min-w-[320px] "
    >
      <Stack
        width="full"
        height="full"
        backgroundColor="surfaceBase"
        rounded="lg"
        gap="3"
      >
        <Inline
          gap="1"
          paddingX="2"
          paddingY="1"
          rounded="lg"
          backgroundColor="white"
          alignItems="center"
          position="absolute"
          top="0"
          margin="4"
          left="0"
        >
          <StarIcon size="4" color="iconPrimary" />
          <Text fontSize="c1" color="textHigh">
            {averageRatings}
          </Text>
        </Inline>
        <Box rounded="lg" paddingY="2" paddingX="2" className="h-[42%]">
          <img
            className="rounded-lg h-[180px] w-full object-cover"
            src={thumbnail || PlaceholderImage}
            alt={title}
          />
        </Box>
        <Stack gap="3" paddingX="2" paddingBottom="6">
          <Inline gap="8" justifyContent="between">
            <Stack gap="1">
              <Text fontSize="b1" className="break-words line-clamp-1 mr-4">
                {title}
              </Text>
              <Text fontSize="c3">By: {author.name}</Text>
            </Stack>
            <Stack gap="1">
              <Text fontSize="b1" className="break-words line-clamp-1 mr-4">
                Price
              </Text>
              <Amount fontSize="c3" currency={currency} amount={price} />
            </Stack>
          </Inline>
          <Text fontSize="c1" height="8" className="line-clamp-2 mr-4">
            {description}
          </Text>
          <Inline gap="2" alignItems="center">
            <CategoryIcon id={course.category.id} size="4" />
            <Text as="span" fontSize="c1">
              {category.title}
            </Text>
          </Inline>
          <Inline
            rounded="md"
            paddingX="2"
            paddingY="1"
            gap="2"
            className="bg-[#1A1B25]"
            fontSize="c1"
          >
            {language ? (
              <Stack gap="1" borderRightWidth="1" className="w-[33%]">
                <Text>Language</Text>
                <Text className="line-clamp-1">
                  {getLanguageValue(language)}
                </Text>
              </Stack>
            ) : null}
            <Stack gap="1" borderRightWidth="1" className="w-[33%]">
              <Text>Reviews</Text>
              <Text className="line-clamp-1">{ratings?.length || 0} </Text>
            </Stack>
            <Stack gap="1" className="w-[33%]">
              <Text>Launch</Text>
              {start?.date ? (
                <Time timeStamp={start.date} />
              ) : (
                <Text>{start.isRecorded ? "Recorded" : "Live"}</Text>
              )}
            </Stack>
          </Inline>
        </Stack>
      </Stack>
    </Box>
  );
}

export function RequestCourseInModal({
  children,
  ...props
}: React.ComponentProps<typeof RequestCourseForm> & {
  children: (props: { add: () => void }) => React.ReactNode;
}) {
  const state = useOverlayTriggerState({});
  return (
    <>
      {children({
        add: state.open,
      })}
      <Modal
        isOpen={state.isOpen}
        isDismissable
        title="Request a course"
        onClose={state.close}
      >
        <RequestCourseForm {...props} close={state.close} />
      </Modal>
    </>
  );
}

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
function RequestCourseForm({ close }: { close?: () => void }) {
  const addRequest = useAddRequest();
  return (
    <Formik
      initialValues={{ course_url: "" as string }}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        await addRequest(values.course_url);
        close?.();
        toast.success("We have raised a request for this course!");
      })}
      validationSchema={Validator.object({}).shape({
        course_url: Validator.string()
          .min(10)
          .max(200)
          .matches(urlRegex, "Please enter a valid url/course link.")
          .required(
            "Please enter this course URL that you would want to add on our platform!"
          ),
      })}
    >
      {({ status, isSubmitting }) => (
        <Form
          noValidate
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <ModalBody>
            <FormField
              name="course_url"
              label="Course URL"
              placeholder="Eg. https://www.scaler.com/courses/data-structures-and-algorithms/"
              required
            />
            {status ? <Alert status="error">{status}</Alert> : null}
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="lg" loading={isSubmitting}>
              {isSubmitting ? <SpinnerIcon /> : null} Request
            </Button>
            <Button onClick={close} size="lg" disabled={isSubmitting}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}
