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
    1. How do customers describe their shopping experience at PAK'nSAVE?
    2. What do customers like about shopping at PAK'nSAVE? Give examples.
    3. What do customers dislike about shopping at PAK'nSAVE? Give examples.
    Answers:`;
  }
}
