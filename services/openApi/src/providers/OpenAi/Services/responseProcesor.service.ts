import { Injectable } from "@nestjs/common";

import { CompletionService } from "./completion.service";
import { ResponseTemplateService } from "../Templates/responseTemplate.service";

import { ResponseService } from "../../response.service";
import { ResultsService } from "../../results.service";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
@Injectable()
export class ResponseProcesorService {
  readonly inputFileNName = "input-responses.csv";
  readonly outputFileName = `input-summary-0.csv`;
  constructor(
    private responseService: ResponseService,
    private summaryService: ResultsService,
    private templateService: ResponseTemplateService,
    private completionService: CompletionService
  ) {}
  async process(): Promise<any> {
    console.log("ResponseProcesorService:process");
    const responses = await this.responseService.getResponses(
      this.inputFileNName
    );
    console.log("responses", responses);
    await this.initalizeFile();
    let partialArray = [];
    let count = 0;
    for (let i = 0; i < responses.length; i += 1) {
      partialArray.push(responses[i]);
      count += 1;
      console.log("response count", i);
      if (count == 30 || i == responses.length - 1) {
        count = 0;

        const prompt = this.templateService.getPrompt(partialArray);
        const responses = await this.completionService.getResponses(prompt);
        console.log("Response", responses.choices[0].text);

        await this.writeSummary(responses.choices[0].text, prompt);

        partialArray = [];
      }
    }
  }
  private async initalizeFile(): Promise<any> {
    console.log("ResponseProcesorService:initalizeFile");
    await this.summaryService.delete(this.outputFileName);

    await this.summaryService.write(this.outputFileName, "Header", "");
  }

  private async writeSummary(summary, prompt): Promise<any> {
    await this.summaryService.write(this.outputFileName, summary, prompt);
    console.log("dynamo");
    /*
    await dynamoDb
      .put({
        TableName: "openAIResponseProcesor",
        Item: {
          id: uuid.v1(),
          summary: summary,
          prompt: prompt,
        },
      })
      .promise();
  */
  }
}
