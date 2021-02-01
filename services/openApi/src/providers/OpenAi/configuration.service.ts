import { Injectable, UsePipes } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";
import { IsEmail, IsNotEmpty } from "class-validator";

@Injectable()
@UsePipes(new ValidationPipe())
/**
 * Configuration Service for Open API
 */
export class ConfigurationService {
  /*
    
    const data = {"prompt": data3, 
      "max_tokens": 458,
      "temperature": 0.1,
      "top_p": 0.8,
     
      "frequency_penalty": 1,
      "presence_penalty": 0,
      "best_of": 1,

    
  };
  */
  @IsEmail()
  @IsNotEmpty()
  public max_tokens = 255;

  @IsNotEmpty()
  public temperature = 0.3;
  public top_p = 0.6;
  public frequency_penalty = 0.9;
  public presence_penalty = 0;
  public best_of = 1;
}
