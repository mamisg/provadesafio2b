import { IsString, Length } from "class-validator";
import { IsNumber } from "../../decorators/validators/isNumber.decorator";
import { Required } from "../required.dto";

export class Post extends Required {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @Length(1, 500)
  body: string;

  @IsNumber()
  userId?: number;
}
