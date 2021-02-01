import { Module, HttpModule } from "@nestjs/common";
import { CsvModule } from "nest-csv-parser";
//import { AppController } from './app.controller';
import { CompletionService } from "./src/providers/OpenAi/Services/completion.service";
import { ConfigurationService } from "./src/providers/OpenAi/configuration.service";
import { ResponseTemplateService } from "./src/providers/OpenAi/Templates/responseTemplate.service";
import { SummaryTemplateService } from "./src/providers/OpenAi/Templates/summaryTemplate.service";

import { ResponseService } from "./src/providers/response.service";

import { ResultsService } from "./src/providers/results.service";

//.createObjectCsvWriter

@Module({
  imports: [HttpModule, CsvModule],
  controllers: [],
  providers: [
    ResultsService,
    ResponseService,
    CompletionService,
    ResponseTemplateService,
    SummaryTemplateService,
    ConfigurationService,
  ],
})
export class AppModule {}
