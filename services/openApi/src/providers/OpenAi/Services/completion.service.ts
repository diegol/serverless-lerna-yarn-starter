import { HttpService, Injectable, HttpException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ConfigurationService } from "../configuration.service";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";
import { Validate, validateOrReject } from "class-validator";
import { UsePipes } from "@nestjs/common";

@Injectable()
@UsePipes(new ValidationPipe())
export class CompletionService {
  readonly openApiUrl = "https://api.openai.com/v1/";

  constructor(
    private httpService: HttpService,
    private configurationService: ConfigurationService
  ) {}

  async getResponses(prompt: string): any {
    console.log("CompletionService:getResponses:start");
    /*
    return {
      choices: [
        {
          text: "texttttt",
        },
      ],
    };
    */
    const headersRequest = this.getHeaders();

    // const dataC = { prompt: prompt, max_tokens: 458, temperature: 0.1 };
    //this.configurationService.max_tokens = 458;

    // await validateOrReject(this.configurationService);
    console.log("-------------------");
    console.log("config", this.configurationService);
    console.log("prompt", prompt);
    const data = { prompt: prompt, ...this.configurationService };

    return this.httpService
      .post(
        `${this.openApiUrl}engines/davinci-instruct-beta/completions`,
        data,
        headersRequest
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          //throw new HttpException
          console.log("errrorororororrrrrrr", error);
          console.log(error.response.data, error.response.status);
          throw new HttpException(error.response.data, error.response.status);
        })
      )
      .toPromise();
  }

  private getHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer sk-Pg9gPHq1cFVaHxBCtKht06Ws9Uecift3XzneSltH`,
      },
    };
  }
}
