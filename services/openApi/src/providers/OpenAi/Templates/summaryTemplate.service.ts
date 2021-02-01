import { Injectable } from "@nestjs/common";

@Injectable()
export class SummaryTemplateService {
  getPrompt(responses: Array<string>): string {
    console.log("getPrompt");
    let responseString = "";
    for (const response of responses) {
      responseString += `Answers:
        """${response}
        """
        `;
    }

    return `Read each of the following answers, and then answer the following questions:
    ${responseString}
    Questions:
    """
    1. Add up the number of times price is mentioned in each answer. How many times in total is price mentioned? What are they saying about price?
    2. Why do customers feel that they are getting fair value everyday when they shop at New World? Give examples.
    3. Why do customers not feel they are getting fair value everyday when they shop at New World? Give examples.
    Answers:`;
  }
}
