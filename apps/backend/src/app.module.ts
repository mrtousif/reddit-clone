import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { SdkModule } from "./sdk/sdk.module";
import { ItemModule } from "./item/item.module";

import { EmailModule } from "./email/email.module";
import { HasuraModule, HasuraModuleConfig } from "@golevelup/nestjs-hasura";
import { join } from "path";
import { ReportingModule } from "./reporting/reporting.module";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        SdkModule,
        ItemModule,
        EmailModule,
        ReportingModule,
        GraphQLModule.forRoot<MercuriusDriverConfig>({
            driver: MercuriusDriver,
            graphiql: true,
            autoSchemaFile: true,
        }),
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        HasuraModule.forRootAsync(HasuraModule, {
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const webhookSecret = configService.get<string>(
                    "NESTJS_EVENT_WEBHOOK_SHARED_SECRET"
                );

                const environment = configService.get<string | undefined>("NODE_ENV");

                return {
                    webhookConfig: {
                        secretFactory: webhookSecret,
                        secretHeader: "nestjs-event-webhook",
                    },
                    managedMetaDataConfig:
                        environment === undefined || environment === "development"
                            ? {
                                  metadataVersion: "v3",
                                  dirPath: join(process.cwd(), "hasura/metadata"),
                                  nestEndpointEnvName: "NESTJS_EVENT_WEBHOOK_ENDPOINT",
                                  secretHeaderEnvName: "NESTJS_EVENT_WEBHOOK_SHARED_SECRET",
                                  defaultEventRetryConfig: {
                                      numRetries: 3,
                                      timeoutInSeconds: 100,
                                      intervalInSeconds: 30,
                                      toleranceSeconds: 21600,
                                  },
                              }
                            : undefined,
                };
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
