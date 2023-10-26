import { IsNotEmpty } from "class-validator";

export class queryCheckoutDto {
    @IsNotEmpty()
    places: string;

    @IsNotEmpty()
    sessionIdFront: string;

    @IsNotEmpty()
    userId: string;
}
