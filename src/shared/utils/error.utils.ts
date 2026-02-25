export enum applicationErrorCodes {
  UnknownException,
}

export const applicationErrorsMessage: {
  [id in applicationErrorCodes]: string;
} = {
  [applicationErrorCodes.UnknownException]: "אירעה שגיאה, נסה שנית מאוחר יותר",
};

export type PayloadValidationError<T> = {
  [key in keyof T]: string[];
};

export type APIFunctionalityError = {
  code?: number;
  message: string;
};

export interface IError {
  id: string;
  message: string;
}

export function getFieldErrors<T>(
  field: keyof T,
  errors?: PayloadValidationError<T>
) {
  if (!errors || errors[field]?.length === 0) return;
  return errors[field]?.join(`; `);
}

export const didErrorOccurred = <T>(errors?: PayloadValidationError<T>) => {
  if (!errors) return false;
  return Object.keys(errors).some((k) => errors[k as keyof T].length > 0);
};

export const getErrorMessage = (error: any): IError[] => {
  let errorMessage = "קרתה תקלה השמירה לא הצליחה";

  const errDetails = JSON.parse(error.responseText).error.innererror
    .errordetails as Array<any>;

  if (errDetails.length === 0) {
    return JSON.parse(error.responseText).error.message.value ?? errorMessage;
  } else {
    return errDetails.map((err) => ({ id: err.code, message: err.message }));
  }
};
