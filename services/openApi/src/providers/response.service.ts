import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { CsvParser } from "nest-csv-parser";
import { S3Service } from "./AWS/s3.service";

const fs = require("fs");

const AWS = require("aws-sdk");

const S3S = require("s3-streams");
class Entity {
  foo: string;
  bar: string;
}

@Injectable()
export class ResponseService {
  readonly bucket = process.env.INTERNAL_BUCKET; //"diego-openai-test";
  private fileName;
  constructor(
    private readonly s3Service: S3Service,
    private readonly csvParser: CsvParser
  ) {
    console.log("ResponseService.bucket", this.bucket);
  }
  async getResponses(fileName: string): Promise<any> {
    console.log("filename", fileName);

    this.fileName = fileName;
    const s3Stream = await this.s3Service.getReadStream(this.bucket, fileName);
    return this.parse(s3Stream);
  }

  private async parse(s3Stream): Promise<any> {
    console.log("ResponseService:parse");
    const entities = await this.csvParser.parse(s3Stream, Entity);
    console.log("ResponseService:parse:done");
    const data = [];
    entities.list.forEach(function (arrayItem) {
      console.log("qwqwqwqwq", arrayItem);
      if (arrayItem.Header === undefined) {
        console.log("HEADER undefined");
        throw new HttpException("HEADER undefined", HttpStatus.FORBIDDEN);
      }
      data.push(arrayItem.Header);
    });
    console.log("ResponseService", data);
    return data;
  }
}
