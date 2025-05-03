import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
    // imports: [ MongooseModule.forRoot(
    //     'mongodb://hansol:ryuryu0314@localhost'
    // )]
    // 하드 코딩 할 때
    imports: [MongooseModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
            uri: configService.get('MONGODB_URI'),
        }),
        inject: [ConfigService]
    })]
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]){
        return MongooseModule.forFeature(models);
    }
}
