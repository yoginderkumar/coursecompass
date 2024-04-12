import * as Validator from "yup";

export const EmailValidator = Validator.string()
  .email("Please provide a valid email address")
  .nullable();

export const ImageValidator = Validator.mixed()
  .test(
    "type-is-correct",
    "Only image files (png/jpeg/jpg) are supported.",
    checkFileTypes(["image/png", "image/jpeg", "image/jpg"])
  )
  .test(
    "size-not-big",
    "Please select the image that is less then 5 MB in size",
    checkFileSize(5000)
  );

function checkFileTypes(types: Array<string>) {
  return function checkTypesForFiles(files?: unknown | File | [File]): boolean {
    let valid = true;
    if (files) {
      if (!Array.isArray(files)) {
        files = [files];
      }
      if (Array.isArray(files)) {
        files.every((file) => {
          if (!types.includes(file.type)) {
            valid = false;
          }
          return valid;
        });
      }
    }
    return valid;
  };
}

function checkFileSize(max: number) {
  return function checkFilesForSize(files?: unknown | File | [File]): boolean {
    let valid = true;
    if (files) {
      if (!Array.isArray(files)) {
        files = [files];
      }
      if (Array.isArray(files)) {
        files.every((file) => {
          const size = file.size / 1024;
          if (size > max) {
            valid = false;
          }
          return valid;
        });
      }
    }
    return valid;
  };
}
