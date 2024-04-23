import { Form, Formik } from "formik";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dropdown,
  FormField,
  Inline,
  Modal,
  ModalBody,
  ModalFooter,
  SearchSelect,
  Stack,
  Text,
  useOverlayTriggerState,
} from "../components";
import * as Validator from "yup";
import {
  FormImageFileField,
  FormTextArea,
  InputLabel,
  formikOnSubmitWithErrorHandling,
} from "../components/Form";
import { ImageValidator, getInitials } from "../utils";
import { Author, AuthorSocial, Socials, useAddAuthor } from "../data/authors";
import { ArrowDownIcon, PlusIcon } from "../components/Icons";
import toast from "react-hot-toast";
import { TSelectableBaseOption } from "../components/Select";
import { useMemo } from "react";

export function AddAuthorInModal({
  children,
  ...props
}: React.ComponentProps<typeof AddAuthorForm> & {
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
        title="Add new author"
        placement="right"
        onClose={state.close}
      >
        <AddAuthorForm {...props} close={state.close} />
      </Modal>
    </>
  );
}

const newAuthorValidation = Validator.object().shape({
  name: Validator.string().required("Please add a valid name!"),
  image: ImageValidator.required(
    "Please add only image/png, image/jpeg or image/jpg type of images under 5MB"
  ),
});

const social_constants: Array<{ id: Socials; label: string }> = [
  { id: "email", label: "Email" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "github", label: "Github" },
  { id: "twitter", label: "Twitter/X" },
];

function getSocialTitle(id: Socials): string {
  switch (id) {
    case "email":
      return "Email";
    case "facebook":
      return "Facebook";
    case "github":
      return "Github";
    case "instagram":
      return "Instagram";
    case "linkedin":
      return "LinkedIn";
    case "twitter":
      return "Twitter";
    default:
      return "Unknown";
  }
}

const MAX_AUTHOR_BIO_LENGTH = 500;

function AddAuthorForm({ close }: { close?: () => void }) {
  const addNewAuthor = useAddAuthor();
  return (
    <Formik
      initialValues={{
        name: "" as string,
        socials: [] as AuthorSocial[],
        description: undefined as string | undefined,
        image: undefined as File | undefined,
      }}
      validationSchema={newAuthorValidation}
      onSubmit={formikOnSubmitWithErrorHandling(
        async (values, { setFieldError }) => {
          if (values.socials?.length) {
            let foundError = false;
            values.socials.forEach((social, i) => {
              if (!social.id || !social.value?.length) {
                setFieldError(`social_${i}`, "Please enter a valid link/email");
                foundError = true;
                return;
              }
            });
            if (foundError) {
              return;
            }
          }
          await addNewAuthor({
            name: values.name,
            socials: values.socials,
            imageFile: values.image,
            description: values.description,
          });
          close?.();
          toast.success("Author saved successfully!");
        }
      )}
      validateOnBlur={false}
      validateOnMount={false}
      validateOnChange={false}
    >
      {({ values, status, isSubmitting, setFieldValue }) => (
        <Form
          noValidate
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <ModalBody>
            <Stack>
              <FormField
                label="Name"
                name="name"
                required
                placeholder="Eg. Geeks For Geeks "
              />
              <FormTextArea
                label="Description"
                name="description"
                help={`${
                  MAX_AUTHOR_BIO_LENGTH - (values.description?.length || 0)
                } Characters left`}
                maxLength={MAX_AUTHOR_BIO_LENGTH}
                placeholder="Add short brief about the author."
              />
              {values.socials?.length ? (
                <Stack as="ul">
                  {values.socials.map((social, i) => (
                    <Inline
                      as="li"
                      key={i}
                      alignItems="start"
                      gap="4"
                      width="full"
                    >
                      <Stack gap="1">
                        <InputLabel fieldId="platform">Platform</InputLabel>
                        <Dropdown
                          value={social?.id}
                          labelButton={
                            <Inline
                              borderWidth="1"
                              rounded="md"
                              paddingX="3"
                              className="h-[40px]"
                              alignItems="center"
                            >
                              <Text fontSize="b3">
                                {social?.id
                                  ? getSocialTitle(social.id)
                                  : "Select"}
                              </Text>
                              <ArrowDownIcon />
                            </Inline>
                          }
                          alternateBase
                          removeActionButtons
                          onChange={(e) => {
                            if (e?.id) {
                              const socials = values.socials;
                              socials[i].id = e.id as Socials;
                              setFieldValue("socials", socials);
                            }
                          }}
                          control="button"
                          options={social_constants}
                        />
                      </Stack>
                      <FormField
                        fullWidth
                        name={`social_${i}`}
                        label="Social"
                        value={social.value}
                        onChange={(e) => {
                          const socials = values.socials;
                          socials[i].value = e.currentTarget.value;
                          setFieldValue("socials", socials);
                        }}
                        placeholder={
                          social.id === "email"
                            ? "Eg. author@gmail.com"
                            : "Enter a valid url"
                        }
                      />
                    </Inline>
                  ))}
                  {values.socials.length < 6 && values.socials.length > 0 ? (
                    <Box marginBottom="6">
                      <Button
                        iconPlacement="left"
                        level="primary"
                        onClick={() =>
                          setFieldValue("socials", [
                            ...values.socials,
                            { id: "", value: "" },
                          ])
                        }
                      >
                        <PlusIcon /> Add Socials
                      </Button>
                    </Box>
                  ) : null}
                </Stack>
              ) : (
                <Box marginBottom="6">
                  <Button
                    level="primary"
                    iconPlacement="left"
                    onClick={() =>
                      setFieldValue("socials", [{ id: "", value: "" }])
                    }
                  >
                    <PlusIcon /> Add Socials
                  </Button>
                </Box>
              )}
              <Stack gap="1">
                <InputLabel fieldId="image_label" secondaryLabel="Required">
                  Author Display Picture
                </InputLabel>
                <FormImageFileField name="image" />
              </Stack>
            </Stack>
            {status ? <Alert status="error">{status}</Alert> : null}
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="lg" loading={isSubmitting}>
              Save Author
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

export function SelectAuthor({
  authors,
  onChange,
  value,
  focusInputOnKey,
}: {
  authors: Author[];
  onChange: (
    value: TSelectableBaseOption | null,
    fromSuggestions?: boolean
  ) => void;
  value: TSelectableBaseOption | null;
  focusInputOnKey?: string;
}) {
  const authorsAsOptions: TSelectableBaseOption[] = useMemo(() => {
    return authors.map((author) => {
      return {
        id: author.uid,
        label: author.name,
      };
    });
  }, [authors]);
  return (
    <SearchSelect
      searchPlaceholder="Search or Select"
      control="input"
      label="Select Author"
      value={value}
      focusInputOnKey={focusInputOnKey}
      onChange={(option) => {
        onChange(option);
      }}
      options={authorsAsOptions}
    />
  );
}

export function AuthorCard({ author }: { author: Author }) {
  const { name, uid, displayPicture } = author;
  return (
    <Box backgroundColor="surfaceBase" rounded="lg" padding="3">
      <Inline gap="3" paddingRight="6">
        <Avatar
          id={uid}
          size="24"
          initials={getInitials(name)}
          image={displayPicture || undefined}
        />
        <Text fontSize="b1">{name}</Text>
      </Inline>
    </Box>
  );
}
