import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

import { INestApplication } from "@nestjs/common/interfaces/nest-application.interface";
import { ValidationPipe } from "@nestjs/common/pipes";
const AWS = require("aws-sdk");

interface HttpReturn {
  statusCode: number;
  headers: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: string;
}

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

export async function handler(event, context): Promise<HttpReturn> {
  const app = await bootstrap();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      validationError: { target: false },
    })
  );

  console.log(event.queryStringParameters.name);
  const s3 = new AWS.S3();

  const myBucket = process.env.EXPORT_BUCKET;
  // const myKey = `exports/${event.queryStringParameters.name}`;

  const myKey = `${event.queryStringParameters.name}`;
  const signedUrlExpireSeconds = 60 * 5;

  const params = {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
  };
  console.log("params", params);
  let url = "";
  let headCode = "";
  try {
    headCode = await s3
      .headObject({
        Bucket: myBucket,
        Key: myKey,
      })
      .promise();
    console.log("headCode", headCode);
    url = s3.getSignedUrl("getObject", {
      Bucket: myBucket,
      Key: myKey,
      Expires: signedUrlExpireSeconds,
    });
    console.log("url!!!", url);
  } catch (headErr) {
    console.log("headCode", headCode);
    console.log(headErr);
    if (headErr.code === "NotFound") {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "File not found.",
          // context,
          //event,
        }),
      };
    }
  }
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      url: url,
      // context,
      //event,
    }),
  };
}
