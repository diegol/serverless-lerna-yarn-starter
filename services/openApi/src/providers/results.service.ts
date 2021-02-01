import { Injectable } from "@nestjs/common";

import { createObjectCsvWriter } from "csv-writer";

const fs = require("fs");

const AWS = require("aws-sdk");
//const S3 = require("aws-sdk").S3;
const S3S = require("s3-streams");
@Injectable()
export class ResultsService {
  private csvWriter;
  private fileName;

  constructor() {}
  async write(fileName: string, response: string, prompt: string) {
    console.log("write-----");
    this.fileName = fileName;

    this.csvWriter = createObjectCsvWriter({
      append: true,
      alwaysQuote: true,
      path: `/tmp/${this.fileName}`,
      header: [
        { id: "response", title: "Response" },
        { id: "prompt", title: "Prompt" },
      ],
    });

    const dataWrite = [
      {
        response: response.replace(/['"]+/g, "").trim(),
        prompt: prompt,
      },
    ];

    await this.csvWriter.writeRecords(dataWrite);

    await this.uploadS3("some.csv", "diego-openai-test", this.fileName);
  }

  async uploadS3(file, bucket, name): Promise<any> {
    console.log("filename", this.fileName);
    file = `/tmp/${this.fileName}`;
    console.log("filename", file);
    const fileContent = fs.readFileSync(file);
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: fileContent,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err.message);
        }
        console.log(data);
        resolve(data);
      });
    });
  }

  getS3(): any {
    console.log("envvvvvvvdfvdsvffdvdfvdfv", process.env.ENV);
    console.log("envvvvvvvdfvdsvffdvdfvdfv", process.env.OPEN_AI_BUCKET);
    return new AWS.S3({
      s3ForcePathStyle: true,
      // accessKeyId: "test", // This specific key is required when working offline
      //  secretAccessKey: "test",
      endpoint: new AWS.Endpoint(process.env.OPEN_AI_BUCKET),
    });
  }
}
