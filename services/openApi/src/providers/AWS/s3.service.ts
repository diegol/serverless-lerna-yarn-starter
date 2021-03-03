import { Injectable } from "@nestjs/common";

const fs = require("fs");

const AWS = require("aws-sdk");

const s3Streams = require("s3-streams");

class Entity {
  foo: string;
  bar: string;
}

@Injectable()
export class S3Service {
  async getReadStream(bucket: string, fileName: string): Promise<any> {
    console.log("bucket", bucket);

    console.log("filename", fileName);

    const awsS3 = await this.getS3();
    console.log("read stream");
    return s3Streams.ReadStream(awsS3, {
      Bucket: bucket,
      Key: fileName,
      // Any other AWS SDK options
    });
  }

  private getS3(): Promise<any> {
    console.log("getS3!!");
    const config = {
      s3ForcePathStyle: true,
      //accessKeyId: null,
      //secretAccessKey: null,
      accessKeyId: "test", // This specific key is required when working offline
      secretAccessKey: "test",
      endpoint: new AWS.Endpoint(process.env.OPEN_AI_BUCKET),
    };

    if (process.env.ACCESS_KEY_ID !== undefined) {
      config.accessKeyId = process.env.ACCESS_KEY_ID;
      config.secretAccessKey = process.env.SECRET_ACCESS_KEY;
    }
    console.log("config", config);
    return new AWS.S3(config);
  }

  async delete(bucket: string, fileName: string): any {
    console.log(`Delete S3!! ${bucket} ${fileName}`);
    const awsS3 = this.getS3();

    const s3 = new AWS.S3(awsS3);
    console.log("read stream");
    return s3
      .deleteObject({
        Bucket: bucket,
        Key: fileName,
        // Any other AWS SDK options
      })
      .promise();
  }
  async upload(
    bucket: string,
    fileName: string,
    fileContent: string
  ): Promise<any> {
    console.log("Upload S3!!");
    console.log("buket", bucket);
    console.log("fileName", fileName);
    console.log("content", fileContent);

    const params = {
      Bucket: bucket,
      Key: String(fileName),
      Body: fileContent,
    };
    const awsS3 = await this.getS3();
    return new Promise((resolve, reject) => {
      awsS3.upload(params, (err, data) => {
        if (err) {
          console.log("upload s3 error");
          console.log(err);
          reject(err.message);
        }
        console.log("data s3", data);
        resolve(data);
      });
    });
  }
}
