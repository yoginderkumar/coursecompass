import React from "react";
import { Form, Formik } from "formik";
import * as Validator from "yup";
import {
  Button,
  FormField,
  Modal,
  ModalBody,
  ModalFooter,
  useOverlayTriggerState,
} from "../components";
import { useAddCategory } from "../data";
import { formikOnSubmitWithErrorHandling } from "../components/Form";
import toast from "react-hot-toast";
import {
  ArtificialIntelligenceIcon,
  DesigningIcon,
  IconProps,
  MusicIcon,
  NetworkAndSecurityIcon,
  SoftwareDevelopmentIcon,
} from "../components/Icons";

export function AddCategoryInModal({
  children,
  ...props
}: React.ComponentProps<typeof AddCategoryForm> & {
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
        onClose={state.close}
      >
        <AddCategoryForm {...props} close={state.close} />
      </Modal>
    </>
  );
}

const newCategoryValidation = Validator.object().shape({
  id: Validator.string()
    .min(5)
    .max(50)
    .matches(
      /^[A-Za-z_]*$/,
      "Other than underscore, no special characters or spaces allowed!"
    )
    .required("Please add a valid category id!"),
  title: Validator.string()
    .min(5)
    .max(60)
    .matches(/^[A-Za-z ]*$/, "No special characters allowed!")
    .required("Please add a valid name!"),
});

function AddCategoryForm({
  close,
  onSuccess,
}: {
  onSuccess?: () => void;
  close?: () => void;
}) {
  const addCategory = useAddCategory();
  return (
    <Formik
      initialValues={{
        id: "" as string,
        title: "" as string,
      }}
      validationSchema={newCategoryValidation}
      onSubmit={formikOnSubmitWithErrorHandling(async (values) => {
        await addCategory({ ...values });
        close?.();
        onSuccess?.();
        toast.success("Category added successfully!");
      })}
    >
      {() => (
        <Form
          noValidate
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <ModalBody>
            <FormField
              label="Category ID"
              name="id"
              required
              placeholder="Eg. software_development"
            />
            <FormField
              label="Title"
              name="title"
              required
              placeholder="Eg. Software Development"
            />
          </ModalBody>
          <ModalFooter>
            <Button size="lg" type="submit">
              Save
            </Button>
            <Button onClick={close} size="lg">
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

export function CategoryIcon({ id, ...props }: IconProps & { id: string }) {
  switch (id) {
    case "software_development":
      return <SoftwareDevelopmentIcon {...props} />;
    case "software_design":
      return <DesigningIcon {...props} />;
    case "music":
      return <MusicIcon {...props} />;
    case 'artificial_intelligence': return <ArtificialIntelligenceIcon {...props} />;
    case 'network_security': return <NetworkAndSecurityIcon {...props} />
    default:
      return null;
  }
}
