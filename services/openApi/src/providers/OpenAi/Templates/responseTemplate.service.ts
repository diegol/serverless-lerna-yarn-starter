import { Injectable } from "@nestjs/common";

@Injectable()
export class ResponseTemplateService {
  getPrompt(responses: Array<string>): string {
    let responseString = "";
    for (const response of responses) {
      responseString += `${response}\n`;
    }
    return `Read these survey responses and then answer the following questions:
    """
    ${responseString}
    """
    Questions:
    1. How many times do customers mention price? What are they saying about price?
    2. Why do customers feel that they are getting fair value everyday when they shop at New World? Give examples.
    3. Why do customers not feel they are getting fair value everyday when they shop at New World? Give examples.
    Answers:`;
  }
}
