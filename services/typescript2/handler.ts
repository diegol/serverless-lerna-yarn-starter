import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  return app;
}


export async function hello(event, context) {
  const app = await bootstrap();
  const appService = app.get(AppService);
  await appService.getHello();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v2.0! Your function executed successfully! type",
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