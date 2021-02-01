import { HttpService, Injectable, HttpException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  /**
 * curl https://api.openai.com/v1/engines/davinci/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer sk-Pg9gPHq1cFVaHxBCtKht06Ws9Uecift3XzneSltH" \
-d '{"prompt": "This is a test", "max_tokens": 5}'
 */
  async getHello(): Promise<AxiosResponse> {
    const headersRequest = {
      headers: {
        "Content-Type": "application/json", // afaik this one is not needed
        Authorization: `Bearer sk-Pg9gPHq1cFVaHxBCtKht06Ws9Uecift3XzneSltH`,
      },
    };

    //const data = {"prompt": "This is a test", "max_tokens": 5};
    const data = {
      documents: ["Argentina", "Italy", "France", "Spain"],
      query: "spanish",
    };
    return this.httpService
      .post(
        "https://api.openai.com/v1/engines/davinci/search",
        data,
        headersRequest
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          //throw new HttpException
          console.log(error.response.data, error.response.status);
          throw new HttpException(error.response.data, error.response.status);
        })
      )
      .toPromise();
  }

  async getData(data3): Promise<AxiosResponse> {
    const headersRequest = {
      headers: {
        "Content-Type": "application/json", // afaik this one is not needed
        Authorization: `Bearer sk-Pg9gPHq1cFVaHxBCtKht06Ws9Uecift3XzneSltH`,
      },
    };
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
    const data = { prompt: data3, max_tokens: 458, temperature: 0.1 };

    return this.httpService
      .post(
        "https://api.openai.com/v1/engines/davinci/completions",
        data,
        headersRequest
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          //throw new HttpException
          console.log(error.response.data, error.response.status);
          throw new HttpException(error.response.data, error.response.status);
        })
      )
      .toPromise();
  }
}
