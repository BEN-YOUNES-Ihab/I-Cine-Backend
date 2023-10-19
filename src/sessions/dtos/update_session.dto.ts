import { PartialType } from "@nestjs/mapped-types";
import { sessionDto } from "./session.dto";

export class updateSessionFormDto extends PartialType(sessionDto){}