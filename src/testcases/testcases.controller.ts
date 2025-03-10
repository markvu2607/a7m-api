import { Controller } from '@nestjs/common';

import { TestcasesService } from './testcases.service';

@Controller('testcases')
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}

  // TODO: implement api get all testcases

  // TODO: implement api get testcase by id

  // TODO: implement api create testcase

  // TODO: implement api update testcase

  // TODO: implement api delete testcase
}
