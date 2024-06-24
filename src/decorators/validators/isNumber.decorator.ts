import { CustomValidator } from "../../err/custom/Validator.filter";
import { CustomCreateValidator } from "../custom/create-validator.decorator";

export const IsNumber = () => {
  return CustomCreateValidator({
    name: "isNumber",
    validationFunction: (value: number, { property }) => {
      const validation = typeof value === "number" && !isNaN(value);
      if (!validation) throw new CustomValidator(`${property} is not a Number`);
      return validation;
    },
  });
};
