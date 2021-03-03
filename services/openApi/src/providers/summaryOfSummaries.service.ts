import { Injectable } from "@nestjs/common";

import { CompletionService } from "./OpenAi/Services/completion.service";
import { ResponseTemplateService } from "./OpenAi/Templates/responseTemplate.service";
import { SummaryTemplateService } from "./OpenAi/Templates/summaryTemplate.service";

import { ResponseService } from "./response.service";
import { ResultsService } from "./results.service";

@Injectable()
export class SummaryOfSummaries {
  constructor(
    private readonly responseService: ResponseService,
    private readonly summaryTemplateService: SummaryTemplateService,
    private readonly resultsService: ResultsService,
    private readonly completionService: CompletionService
  ) {}

  async summarize(): Promise<any> {
    let isFinished = 0;
    for (let level = 0; isFinished === 0; level += 1) {
      console.log(`--Level--${level}`);
      const responses = await this.responseService.getResponses(
        `input-summary-${level}.csv`
      );
      console.log("responses", responses);

      let stringData = "";
      let partialArray = [];
      let count = 0;

      for (let i = 0; i < responses.length; i += 1) {
        stringData = stringData.concat("\n", responses[i]);
        partialArray.push(responses[i]);
        count += 1;
        console.log("------------", i);
        if (count == 6 || i == responses.length - 1) {
          count = 0;
          await this.processResponses(partialArray, level);

          partialArray = [];
          if (i == responses.length - 1) {
            isFinished = 1;
          }
        }
      }
    }
  }

  async processResponses(partialArray, level): Promise<any> {
    const prompt = this.summaryTemplateService.getPrompt(partialArray);
    const responses = await this.completionService.getResponses(prompt);
    console.log("RESSS", responses.choices[0].text);

    await this.resultsService.write(
      `input-summary-${level + 1}.csv`,
      responses.choices[0].text,
      prompt
    );
  }
}
