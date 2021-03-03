import { Injectable } from "@nestjs/common";
import { S3Service } from "./AWS/s3.service";
import { createObjectCsvWriter } from "csv-writer";
import { CsvParser } from "nest-csv-parser";

const fs = require("fs");

const AWS = require("aws-sdk");

@Injectable()
export class ResultsService {
  private csvWriter;
  private fileName;
  readonly bucket = process.env.INTERNAL_BUCKET; //"diego-openai-test";
  constructor(
    private readonly s3Service: S3Service,
    private readonly csvParser: CsvParser
  ) {}
  async delete(fileName: string): Promise<any> {
    console.log("ResultService:delete:start");
    console.log("fileName", fileName);
    if (fs.existsSync(`/tmp/${fileName}`)) {
      await fs.unlinkSync(`/tmp/${fileName}`);
      await fs.unlinkSync(`/tmp/full-${fileName}`);
      await this.s3Service.delete(this.bucket, fileName);
      // await this.s3Service.delete(this.bucket, `full-${fileName}`);
    }
  }
  async write(
    fileName: string,
    response: string,
    prompt: string
  ): Promise<any> {
    console.log("ResultsService:write:start");
    this.fileName = fileName;

    await this.writeResponse(fileName, response);
    await this.writeResponseAndPrompt(fileName, response, prompt);

    console.log("ResultsService:write:end");
  }
  private async writeResponseAndPrompt(
    fileName: string,
    response: string,
    prompt: string
  ): Promise<any> {
    //response only file
    this.csvWriter = createObjectCsvWriter({
      append: true,
      alwaysQuote: true,
      path: `/tmp/full-${this.fileName}`,
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
    await this.uploadS3(
      `/tmp/full-${this.fileName}`,
      this.bucket,
      `full-${this.fileName}`
    );
  }
  private async writeResponse(
    fileName: string,
    response: string
  ): Promise<any> {
    //response only file
    this.csvWriter = createObjectCsvWriter({
      append: true,
      alwaysQuote: true,
      path: `/tmp/${this.fileName}`,
      header: [
        { id: "response", title: "Response" },
        // { id: "prompt", title: "Prompt" },
      ],
    });

    const dataWrite = [
      {
        response: response.replace(/['"]+/g, "").trim(),
        //   prompt: prompt,
      },
    ];

    await this.csvWriter.writeRecords(dataWrite);
    await this.uploadS3(`/tmp/${this.fileName}`, this.bucket, this.fileName);
  }

  async uploadS3(file, bucket, name): Promise<any> {
    console.log("ResultsService:uploadS3:start");
    console.log("filename", file);
    //  file = `/tmp/${this.fileName}`;
    console.log("filename", file);
    const fileContent = fs.readFileSync(file);
    console.log("uploading");
    await this.s3Service.upload(bucket, name, fileContent);
  }

  getS3(): any {
    console.log("getS3:env", process.env.ENV);
    console.log("envvvvvvvdfvdsvffdvdfvdfv", process.env.OPEN_AI_BUCKET);
    return new AWS.S3({
      s3ForcePathStyle: true,
      // accessKeyId: "test", // This specific key is required when working offline
      //  secretAccessKey: "test",
      endpoint: new AWS.Endpoint(process.env.OPEN_AI_BUCKET),
    });
  }
}
