import { Module, HttpModule } from "@nestjs/common";
import { CsvModule } from "nest-csv-parser";
//import { AppController } from './app.controller';

//.createObjectCsvWriter

@Module({
  imports: [HttpModule, CsvModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
