import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';
import { Type } from 'class-transformer';

export class CreateChargeDto {
  // 'card' 속성이 요청 본문에 반드시 포함되어야 함 (값이 undefined나 null이 아니어야 함)
  @IsDefined()
  // 'card' 속성이 제공되어야 하며, 빈 값(예: 빈 객체 {})이 아니어야 함을 보장
  // (객체의 경우, IsDefined와 함께 사용하여 존재 유무를 명확히 합니다)
  @IsNotEmpty()
  // 'card' 객체 내부에 정의된 유효성 검사 규칙(CardDto 클래스 내의 데코레이터)을
  // 재귀적으로 검사하도록 지시함. 이 데코레이터가 없으면 CardDto 내부의 유효성 검사는 무시됨.
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsNumber()
  amount: number;
}
