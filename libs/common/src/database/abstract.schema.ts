import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

// 데이터베이스 작업을 추상화, 일관된 인터페이스 제공을 위한 패턴 구현화한 것.
// 정확히는 MongoDB, NestJS 를 함께 사용할 때 반복 코드를 줄이기 위한 추상클래스를 정의한 것

@Schema()
export class AbstractDocument {
    @Prop({type: SchemaTypes.ObjectId })
    _id: Types.ObjectId
}