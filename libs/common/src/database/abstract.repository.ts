import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";


// FilterQuery<T> : 쿼리 조건을 정의하는 타입
// UpdateQuery<T> : 업데이트 연산을 정의하는 타입
// Types.ObjectId : 고유 식별자 타입을 지정함 
// Model<T> : 추상화된 데이터베이스 작업을 수행하는 인터페이스(타입이 들어가는 순가, 해당 타입의 인터페이스가 되어줌)
// lean() : Mongoose 쿼리의 결과를 일반 JS 객체로 변환, 메모리 사용량 감소, 성능 향상을 위해 사용, 
//          순수한 JSON 객체로 반환되어 Mongoose 문서 메서드와 가상 속성은 사용 불가 

/**
 * 해당 방식의 이점
 * 코드 재사용성 향상 => CRUD 를 한꺼번에 생성하고, 그걸로 계속 사용 가능함 
 * 타입 안정성 - TypeScript 제네릭을 통한 구조이니 type Script의 강점을 그대로 활용함 
 * 일괄된 오류 처리 - 로깅 및 예외 발생 패턴 표준화 => 수십군데를 체킹할 필요 없어짐
 * 확장성 - 필요에 따라 하위 클래스에서 기능 확장 가능 
 */

/**
 * 현재 이 코드의 단점 
 * 1) lean 은 다 좋으나, 가상 속성, 인스턴스 메서드를 삭제함 => 순수한 JS 객체화 => 
 *      그러나 DB 데이터가 메서드가 필요한 것도 아니고, TDocument 타입에 따라 지정되어 있으면 큰 문제 없으리라 보임
 * 2) 예외처리 관련 부족 
 * 3) 타입 assertion (as unknown as TDocument) => 안정성이 위험이 있다고 보이나, 실질적으로 DB => 서버로 올 때의 확정된 타입이니 괜찮을지도...
 */

/**
 * Prisma + MongoDB 를 사용하는 우리의 경우 사용 가능한가?
 * 추상 레포지터리 형식으로 만드는 것은 가능 
 * 그러나 이 경우 단점이 다양한 Type 이 들어갈 수 있게 제네릭스 + Prisma 의 타입을 잘 활용해야 하고, 그렇지 않으면 any 도배가 될 수 있다. 
 * 더불어 막상 필요한 세부 설정들을 옵션으로 바로 사용이 어려워진다는 점에서, 다소 애매함은 갖고 있다. 
 * 따라서 반대로 상속을 활용하는게 나을 수 있는데, 추상 레포지터리 + Prisma 서비스 구현 => 특정 객체 스키마 레포지터리가 상속 받아사용 
 * 의 구조로 간다면 공통 구조는 이미 만들어진 상태에서, 특정 추가 기능만 필요시 사용 가능하다. 
 */

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger

    constructor(protected readonly model: Model<TDocument>) {}

    async create(document:Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        const result = await createdDocument.save();
        return result.toJSON() as unknown as TDocument;
    }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(filterQuery).lean<TDocument>(true);

        if (!document) {
            this.logger.warn(`Document was not found with filterQuery`, filterQuery);
            throw new NotFoundException(`Document was not found`);
        }

        return document;
    }

    async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            new: true
        }).lean<TDocument>(true);

        if (!document) {
            this.logger.warn(`Document was not found with filterQuery`, filterQuery);
            throw new NotFoundException(`Document was not found`);
        }

        return document;
    }

    async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
        return this.model.find(filterQuery).lean<TDocument[]>(true);
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true) as unknown as TDocument;
    }
}