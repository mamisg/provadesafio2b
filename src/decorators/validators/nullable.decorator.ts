import { CustomValidator } from "../../err/custom/Validator.filter";
import { CustomCreateValidator } from "../custom/create-validator.decorator";

export const Nullable = () => {
  return CustomCreateValidator({
    name: "nullable",
    validationFunction: (value: string | null | undefined, { property }) => {
      const validation = value === null || value === undefined || value === "";
      if (!validation) throw new CustomValidator(`${property} is nullable`);
      return validation;
    },
  });
};
