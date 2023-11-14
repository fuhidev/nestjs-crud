import { Controller } from '@nestjs/common';
import { Crud } from 'nest-crud-server';
import { PostService } from './post.service';

@Crud({
  params: {
    primaryKey: 'postId',
  },
  routes: {
    exclude: ['getCountBase'],
    updateOneBase: {
      // allowParamsOverride: true,
    },
  },
})
@Controller('post')
export class PostController {
  constructor(private service: PostService) {}
}
