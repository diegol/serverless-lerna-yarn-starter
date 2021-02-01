import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { CompletionService } from "./src/providers/OpenAi/Services/completion.service";
import { ResponseTemplateService } from "./src/providers/OpenAi/Templates/responseTemplate.service";
import { SummaryTemplateService } from "./src/providers/OpenAi/Templates/summaryTemplate.service";

import { ResponseService } from "./src/providers/response.service";
import { ResultsService } from "./src/providers/results.service";
import { INestApplication } from "@nestjs/common/interfaces/nest-application.interface";
import { ValidationPipe } from "@nestjs/common/pipes";

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

export async function hello(event, context): Promise<HttpReturn> {
  const app = await bootstrap();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      validationError: { target: false },
    })
  );

  const responseService = app.get(ResponseService);

  const responses = await responseService.getResponses("input-responses.csv");
  console.log("responses", responses);

  const templateService = app.get(ResponseTemplateService);

  const completionService = app.get(CompletionService);
  let stringData = "";
  let partialArray = [];
  let count = 0;
  for (let i = 0; i < responses.length; i += 1) {
    stringData = stringData.concat("\n", responses[i]);
    partialArray.push(responses[i]);
    count += 1;
    console.log("------------", i);
    if (count == 30 || i == responses.length - 1) {
      count = 0;

      //console.log("strData", stringData);

      //console.log(stringData, data3);
      const prompt = templateService.getPrompt(partialArray);
      const responses = await completionService.getResponses(prompt);
      console.log("RESSS", responses.choices[0].text);

      const summaryService = app.get(ResultsService);
      await summaryService.write(
        "output-responses.csv",
        responses.choices[0].text,
        prompt
      );
      partialArray = [];
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

  const responses = await responseService.getResponses("input-summary.csv");
  console.log("responses", responses);

  const templateService = app.get(SummaryTemplateService);

  const completionService = app.get(CompletionService);
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

      //console.log("strData", stringData);

      //console.log(stringData, data3);
      const prompt = templateService.getPrompt(partialArray);
      const responses = await completionService.getResponses(prompt);
      console.log("RESSS", responses.choices[0].text);

      const summaryService = app.get(ResultsService);
      await summaryService.write(
        "output-summary.csv",
        responses.choices[0].text,
        prompt
      );
      partialArray = [];
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
