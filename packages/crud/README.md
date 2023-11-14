# Ví dụ

Sử dụng Crud và TypeormCrudService để tạo RestfulAPI

**File `.controller`**

```ts
import { Controller } from "@nestjs/common";
import { Crud } from "nest-crud-server";
import { PostService } from "./post.service";

@Crud({
 params: {
  primaryKey: "postId",
 },
 routes: {
  exclude: ["getCountBase"],
  updateOneBase: {
   // allowParamsOverride: true,
  },
 },
})
@Controller("post")
export class PostController {
 constructor(private service: PostService) {}
}
```

**File `.service`**

```ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "nest-crud-server";
import { Repository } from "typeorm";
import { PostEntity } from "./post.entity";

@Injectable()
export class PostService extends TypeOrmCrudService<PostEntity> {
 constructor(@InjectRepository(PostEntity) repo: Repository<PostEntity>) {
  super(repo);
 }
}
```

**File `.entity`**

```ts
import {
 Column,
 CreateDateColumn,
 Entity,
 PrimaryColumn,
 UpdateDateColumn,
} from "typeorm";

@Entity({ name: "Post" })
export class PostEntity {
 @PrimaryColumn({ generated: "increment" })
 postId: number;
 @Column()
 title: string;
 avatarSrc: string;
 @Column({ default: "" })
 description: string;
 @Column({ default: "" })
 shortDescription: string;

 @CreateDateColumn() createDate: Date;
 @UpdateDateColumn() updateDate: Date;
}
```

# Mô tả

## Cách sử dụng Crud

**Tham số truyền vào**

- `params.primaryKey`: kiểu `string` là khóa chính của `Entity`. Ví dụ `PostEntity` có khóa chính là `postId`
- `routes` gồm nhiều tham số khác nhau

  - `only`: kiểu `string[]` bao gồm các giá trị: `"getManyBase" | "getOneBase" | "createOneBase" | "createManyBase" | "updateOneBase" | "replaceOneBase" | "deleteOneBase" | "recoverOneBase" | "getCountBase" | "getSumBase"`

  Ví dụ Controller chỉ muốn cung cấp API để `getMany` và `createOne` thì truyền

  ```ts
  routes: {
   only: ["getManyBase", "createOneBase"];
  }
  ```

  Với ví dụ trên thì chỉ request đến `Controller` với 2 phương thức là `GET` (để lấy danh sách) và `POST` (để tạo)

  - `exclude`: kiểu `string[]` tương tự `only` nhưng ngược lại

  Ví dụ `Controller` có tất cả phương thức: `getMany` (lấy danh sách), `getOne` (lấy một đối tượng), `createOne` (tạo đối tượng), `updateOne` (cập nhật đối tượng), `deleteOne` (xóa đối tượng)... và bạn muốn bỏ phương thức `createMany` (tạo nhiều đối tượng) thì thực hiện như sau

  ```ts
  routes: {
   exclude: ["createManyBase"];
  }
  ```
