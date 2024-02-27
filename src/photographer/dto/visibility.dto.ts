import { IsArray, IsString } from "class-validator";
export class VisibilityDto {
    @IsArray()
    @IsString({ each: true })
    testimonialId: string[];
}