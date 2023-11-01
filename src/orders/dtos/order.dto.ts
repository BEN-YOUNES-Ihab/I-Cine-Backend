import { IsString, IsNotEmpty, IsInt, IsOptional } from "class-validator";

export class orderDto {
    @IsInt()
    @IsNotEmpty()
    places 

    @IsInt()
    @IsNotEmpty()
    amount 

    @IsInt()
    @IsNotEmpty()
    sessionId 
   
    @IsInt()
    @IsNotEmpty()
    userId 
    
}
export class FilterDto {
    @IsNotEmpty()
    sessionId: string;

    @IsOptional()
    keyword?: string;

    @IsOptional()
    page?: string;
  
    @IsOptional()
    size?: string;
  }

  export class orderFiltrobyUserDTO {
    @IsNotEmpty()
    userId?: string;

    @IsNotEmpty()
    year?: string;

    @IsNotEmpty()
    archived?: string;
  }
