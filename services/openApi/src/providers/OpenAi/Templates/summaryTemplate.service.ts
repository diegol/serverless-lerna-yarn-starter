import { Injectable } from "@nestjs/common";

@Injectable()
export class SummaryTemplateService {
  getPrompt(responses: Array<string>): string {
    console.log("getPrompt");
    let responseString = "";
    for (const response of responses) {
      responseString += `
        """${response}
        """
        `;
    }

    return `Read the following text and then provide a summary of the most important parts:
    ${responseString}
    Summary:`;
  }
}
