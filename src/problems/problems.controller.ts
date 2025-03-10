import { Controller } from '@nestjs/common';

import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  // TODO: implement api get all problems

  // TODO: implement api get problem by id

  // TODO: implement api create problem

  // TODO: implement api update problem

  // TODO: implement api delete problem
}
