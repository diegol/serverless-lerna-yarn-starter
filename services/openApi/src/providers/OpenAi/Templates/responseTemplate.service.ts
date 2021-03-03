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
${responseString}"""
Given the above statements, answer the following questions:

1. In your opinion, how could Farmers improve their range of products?
2. In your opinion, what additional products should Farmers be offering?
3. In your opinion, which departments in Farmers should be offering a wider range?
4. In your opinion, what extra range of products should those departments be selling?

Answers:`;
  }
}
