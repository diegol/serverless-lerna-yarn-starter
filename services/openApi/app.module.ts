import { Module, HttpModule } from "@nestjs/common";
import { CsvModule } from "nest-csv-parser";
//import { AppController } from './app.controller';
import { S3Service } from "./src/providers/AWS/s3.service";
import { CompletionService } from "./src/providers/OpenAi/Services/completion.service";
import { ConfigurationService } from "./src/providers/OpenAi/configuration.service";
import { ResponseTemplateService } from "./src/providers/OpenAi/Templates/responseTemplate.service";
import { SummaryTemplateService } from "./src/providers/OpenAi/Templates/summaryTemplate.service";

import { ResponseService } from "./src/providers/response.service";

import { ResultsService } from "./src/providers/results.service";
import { ResponseProcesorService } from "./src/providers/OpenAi/Services/responseProcesor.service";
//.createObjectCsvWriter

@Module({
  imports: [HttpModule, CsvModule],
  controllers: [],
  providers: [
    S3Service,
    ResultsService,
    ResponseService,
    CompletionService,
    ResponseTemplateService,
    SummaryTemplateService,
    ConfigurationService,
    ResponseProcesorService,
  ],
})
export class AppModule {}
