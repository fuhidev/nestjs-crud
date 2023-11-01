import { Controller, UseInterceptors } from '@nestjs/common';
import {
  Crud,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from 'nest-crud-server';
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

  @Override('createOneBase')
  @UseInterceptors(CrudRequestInterceptor)
  createOneBase(@ParsedRequest() req: CrudRequest, @ParsedBody() dto) {
    return this.service.createOne(req, dto);
  }
}
