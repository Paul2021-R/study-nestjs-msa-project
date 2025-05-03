import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'LOCAL') { // 2번 패러미터는 없어도 됨. 있으면 커스텀 설정

    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            usernameField: 'email',
        })
    }

    async validate(email: string, password: string) {
        try{
            return this.usersService.verifyUser(email, password);  
        } catch (error) {
            throw error;
        }

    }

}