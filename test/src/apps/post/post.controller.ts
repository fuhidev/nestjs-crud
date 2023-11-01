import { Controller } from '@nestjs/common';
import { Crud } from 'nest-crud-server';
import { PostService } from './post.service';

@Crud({
  params: {
    primaryKey: 'postId',
  },
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'updateOneBase',
      'deleteOneBase',
      'createOneBase',
    ],
  },
  query: {
    persist: ['physicalPath'],
  },
})
@Controller('post')
export class PostController {
  constructor(private service: PostService) {}
}
