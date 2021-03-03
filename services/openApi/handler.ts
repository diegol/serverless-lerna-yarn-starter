import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ResponseProcesorService } from "./src/providers/OpenAi/Services/responseProcesor.service";

import { AppModule } from "./app.module";
import { CompletionService } from "./src/providers/OpenAi/Services/completion.service";
import { ResponseTemplateService } from "./src/providers/OpenAi/Templates/responseTemplate.service";
import { SummaryTemplateService } from "./src/providers/OpenAi/Templates/summaryTemplate.service";

import { ResponseService } from "./src/providers/response.service";
import { ResultsService } from "./src/providers/results.service";
import { INestApplication } from "@nestjs/common/interfaces/nest-application.interface";
import { ValidationPipe } from "@nestjs/common/pipes";
const awsXRay = require("aws-xray-sdk");
const awsSdk = awsXRay.captureAWS(require("aws-sdk"));

async function bootstrap(): Promise<INestApplication> {
  // const app = await NestFactory.createApplicationContext(AppModule);
  const app = await NestFactory.create(AppModule);
  return app;
}
interface HttpReturn {
  statusCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: string;
}

export async function responseProcesor(event, context): Promise<HttpReturn> {
  const app = await bootstrap();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      validationError: { target: false },
    })
  );
  const responseProcesorService = app.get(ResponseProcesorService);
  await responseProcesorService.process();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Go Serverless v2.0! Your function executed successfully! typevx",
      context,
      event,
    }),
  };
}

async function summarizeResponses(app, partialArray, level) {
  const templateService = app.get(SummaryTemplateService);

  const completionService = app.get(CompletionService);
  const prompt = templateService.getPrompt(partialArray);
  const responses = await completionService.getResponses(prompt);
  console.log("RESSS", responses.choices[0].text);

  const summaryService = app.get(ResultsService);
  await summaryService.write(
    `input-summary-${level + 1}.csv`,
    responses.choices[0].text,
    prompt
  );
}

export async function summary(event, context): Promise<HttpReturn> {
  const app = await bootstrap();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      validationError: { target: false },
    })
  );

  const responseService = app.get(ResponseService);
  const summaryService = app.get(ResultsService);
  let isFinished = 0;

  for (let level = 0; level < 100; level += 1) {
    await summaryService.delete(`input-summary-${level + 1}.csv`);
  }

  for (let level = 0; isFinished === 0; level += 1) {
    console.log("level", level);
    const responsesToProcess = await responseService.getResponses(
      `input-summary-${level}.csv`
    );
    //If the file to process has only one reponse the work is done!
    if (1 >= responsesToProcess.length) {
      console.log("isFinished !!!");
      isFinished = 1;
      break;
    }
    console.log("wrting header", level + 1);

    await summaryService.write(`input-summary-${level + 1}.csv`, "Header", "");
    //console.log("responses", responses);
    console.log("responses.length", responsesToProcess.length);
    let stringData = "";
    let partialArray = [];
    let count = 0;
    for (let i = 0; i < responsesToProcess.length; i += 1) {
      stringData = stringData.concat("\n", responsesToProcess[i]);
      partialArray.push(responsesToProcess[i]);
      count += 1;
      console.log("- i", i);
      if (count == 6 || i == responsesToProcess.length - 1) {
        console.log(
          `-------------------------- processing ressponses reponse lenght ${responsesToProcess.length} count ${count} i ${i}`
        );
        count = 0;
        await summarizeResponses(app, partialArray, level);

        partialArray = [];
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Go Serverless v2.0! Your function executed successfully! typevx",
      context,
      event,
    }),
  };
}

/*
export async function hello(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {




  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v2.0! Your function executed successfully! type",
      context,
      event,
    }),
  };
}
*/
