import { Controller } from '@nestjs/common';

import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // TODO: implement api get all tags

  // TODO: implement api get tag by id

  // TODO: implement api create tag

  // TODO: implement api update tag

  // TODO: implement api delete tag
}
