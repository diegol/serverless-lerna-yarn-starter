import { Injectable } from "@nestjs/common";
import { CsvParser } from "nest-csv-parser";

const fs = require("fs");

const AWS = require("aws-sdk");

const S3S = require("s3-streams");

class Entity {
  foo: string;
  bar: string;
}

@Injectable()
export class ResponseService {
  private fileName;
  constructor(private readonly csvParser: CsvParser) {}
  async getResponses(fileName: string) {
    console.log("filename", fileName);
    this.fileName = fileName;
    const awsS3 = this.getS3();
    const s3Stream = this.getReadStream(awsS3);
    return this.parse(s3Stream);
  }

  private async parse(s3Stream) {
    console.log("ResponseService:parse");
    const entities = await this.csvParser.parse(s3Stream, Entity);
    console.log("ResponseService:parse:done");
    const data = [];
    entities.list.forEach(function (arrayItem) {
      console.log("qwqwqwqwq", arrayItem);
      data.push(arrayItem.Header);
    });
    console.log("ResponseService", data);
    return data;
  }

  private getReadStream(awsS3): any {
    console.log("getReadStream");
    return S3S.ReadStream(awsS3, {
      Bucket: "diego-openai-test",
      Key: this.fileName,
      // Any other AWS SDK options
    });
  }

  getS3(): any {
    console.log("getS3!!");
    const config = {
      s3ForcePathStyle: true,
      accessKeyId: null,
      secretAccessKey: null,
      //  accessKeyId: "test", // This specific key is required when working offline
      //  secretAccessKey: "test",
      endpoint: new AWS.Endpoint(process.env.OPEN_AI_BUCKET),
    };

    if (process.env.ACCESS_KEY_ID !== undefined) {
      config.accessKeyId = process.env.ACCESS_KEY_ID;
      config.secretAccessKey = process.env.SECRET_ACCESS_KEY;
    }
    console.log("config", config);
    return new AWS.S3(config);
  }
}
