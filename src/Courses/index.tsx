import { getColorForString } from "generate-colors";
import * as Validator from "yup";
import {
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
import { ArrowDownIcon, StarIcon } from "../components/Icons";
import { Form, Formik } from "formik";
import toast from "react-hot-toast";
import {
  CURRENCY_TYPES,
  CategoryIds,
  Course,
  useAddNewCourse,
  useAddRatingAndReview,
} from "../data";
import { FormTextArea, Textarea } from "../components/Form";
import {
  categories,
  categoryTitlesMapped,
  ratingHelper,
} from "../common/constants";
import { User } from "firebase/auth";
import { getLanguageValue, pluralize } from "../utils";
import { Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Amount } from "../common/Amount";
import { getCategoryIcon } from "../common";

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
        background: thumbnail?.length
          ? `url(${thumbnail})`
          : `rgba(${r}, ${g}, ${b}, .8)`,
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
  title: Validator.string().required("Please enter title for your review!"),
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
}: {
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
        <AddNewCourseForm close={state.close} />
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

const categoriesForOptions = categories.map((category) => {
  return {
    id: category.id,
    label: category.title,
  };
});

function AddNewCourseForm({ close }: { close: () => void }) {
  const addNewCourse = useAddNewCourse();
  return (
    <Formik
      initialValues={{
        language: "" as string,
        content_url: "" as string,
        creator: "" as string,
        currency: "INR" as CURRENCY_TYPES,
        description: "" as string,
        price: 0 as number,
        started_at: new Date() as Date,
        thumbnail: "" as string | undefined,
        title: "" as string,
        category: "" as CategoryIds,
      }}
      onSubmit={formikOnSubmitWithErrorHandling(
        async (values, { resetForm }) => {
          await addNewCourse({
            ...values,
            started_at: Timestamp.fromDate(new Date(values.started_at)),
          });
          close();
          toast.success("Course added successfully!");
          resetForm();
        }
      )}
    >
      {({ values, isSubmitting, setFieldValue, submitForm }) => (
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
            <Inline justifyContent="between" gap="6" marginBottom="6">
              <Box width="full">
                <Dropdown
                  value={values?.category}
                  control="input"
                  label="Pick Category"
                  searchPlaceholder="Select any category"
                  onChange={(e) => {
                    if (e?.id) {
                      setFieldValue("category", e?.id);
                    }
                  }}
                  alternateBase
                  options={categoriesForOptions}
                />
              </Box>
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
            </Inline>
            <Inline gap="6">
              <FormField
                required
                fullWidth
                name="content_url"
                placeholder="Enter content url"
                label="Content URL"
              />
              <FormField
                required
                fullWidth
                name="thumbnail"
                placeholder="Enter thumbnail url"
                label="Thumbnail URL"
              />
            </Inline>
            <Inline gap="6">
              <FormField
                required
                fullWidth
                name="creator"
                placeholder="Enter creator"
                label="Created By ?"
              />
              <FormField
                required
                fullWidth
                name="started_at"
                placeholder="DD/MM/YYYY"
                type="date"
                label="Started On"
              />
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
    creator,
    currency,
    price,
    description,
    category,
    averageRatings,
    language,
    started_at,
    ratings,
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
            src={thumbnail}
            alt={title}
          />
        </Box>
        <Stack gap="3" paddingX="2" paddingBottom="6">
          <Inline gap="8" justifyContent="between">
            <Stack gap="1">
              <Text fontSize="b1" className="break-words line-clamp-1 mr-4">
                {title}
              </Text>
              <Text fontSize="c3">By: {creator}</Text>
            </Stack>
            <Stack gap="1">
              <Text fontSize="b1" className="break-words line-clamp-1 mr-4">
                Price
              </Text>
              <Amount fontSize="c3" currency={currency} amount={price} />
            </Stack>
          </Inline>
          <Text fontSize="c1" className="line-clamp-2 mr-4">
            {description}
          </Text>
          <Inline gap="2" alignItems="center">
            {getCategoryIcon({ id: course.category, size: "4" })}
            <Text as="span" fontSize="c1">
              {categoryTitlesMapped[category]}
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
              <Text>Launch Date</Text>
              <Time timeStamp={started_at} />
            </Stack>
          </Inline>
        </Stack>
      </Stack>
    </Box>
  );
}
