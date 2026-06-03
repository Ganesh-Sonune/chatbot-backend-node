import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AnalyticsController } from './controller/analytics.controller';
import { AuthController } from './controller/auth.controller';
import { BotConfigController } from './controller/bot-config.controller';
import { ChatController } from './controller/chat.controller';
import { CourseController } from './controller/course.controller';
import { FaqController } from './controller/faq.controller';
import { IntentController } from './controller/intent.controller';
import { LeadController } from './controller/lead.controller';
import { TrainerController } from './controller/trainer.controller';
import { ReferralController } from './controller/referral.controller';

import { BotConfigService } from './service/bot-config.service';
import { CourseService } from './service/course.service';
import { FaqService } from './service/faq.service';
import { IntentService } from './service/intent.service';
import { IntentDetectorService } from './service/intent-detector.service';
import { LeadService } from './service/lead.service';
import { TrainerService } from './service/trainer.service';
import { ChatService } from './service/chat.service';
import { DurationParserService } from './service/duration-parser.service';
import { ReferralService } from './service/referral.service';

import { BotConfigServiceImpl } from './service/impl/bot-config.service.impl';
import { CourseServiceImpl } from './service/impl/course.service.impl';
import { FaqServiceImpl } from './service/impl/faq.service.impl';
import { IntentServiceImpl } from './service/impl/intent.service.impl';
import { IntentDetectorServiceImpl } from './service/impl/intent-detector.service.impl';
import { LeadServiceImpl } from './service/impl/lead.service.impl';
import { TrainerServiceImpl } from './service/impl/trainer.service.impl';
import { ChatServiceImpl } from './service/impl/chat.service.impl';
import { DurationParserServiceImpl } from './service/impl/duration-parser.service.impl';
import { ReferralServiceImpl } from './service/impl/referral.service.impl';

import { BotConfigRepository } from './repository/bot-config.repository';
import { CourseRepository } from './repository/course.repository';
import { FaqRepository } from './repository/faq.repository';
import { IntentRepository } from './repository/intent.repository';
import { LeadRepository } from './repository/lead.repository';
import { TrainerRepository } from './repository/trainer.repository';
import { UserRepository } from './repository/user.repository';
import { ReferralRepository } from './repository/referral.repository';

import { BotConfigRepositoryImpl } from './repository/impl/bot-config.repository.impl';
import { CourseRepositoryImpl } from './repository/impl/course.repository.impl';
import { FaqRepositoryImpl } from './repository/impl/faq.repository.impl';
import { IntentRepositoryImpl } from './repository/impl/intent.repository.impl';
import { LeadRepositoryImpl } from './repository/impl/lead.repository.impl';
import { TrainerRepositoryImpl } from './repository/impl/trainer.repository.impl';
import { UserRepositoryImpl } from './repository/impl/user.repository.impl';
import { ReferralRepositoryImpl } from './repository/impl/referral.repository.impl';

import { BotConfig } from './entity/bot-config.entity';
import { Course } from './entity/course.entity';
import { FaqEntry } from './entity/faq-entry.entity';
import { Intent } from './entity/intent.entity';
import { Lead } from './entity/lead.entity';
import { Trainer } from './entity/trainer.entity';
import { User } from './entity/user.entity';
import { Referral } from './entity/referral.entity';

import { JwtUtil } from './security/jwt.util';
import { JwtAuthGuard } from './security/jwt-auth.guard';
import { RolesGuard } from './security/roles.guard';

import { DataSeeder } from './seeder/data.seeder';
import { WhatsAppService } from './service/whatsapp.service';

@Module({

    imports: [

        ConfigModule.forRoot({ isGlobal: true }),

        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'Lasan@123',
            database: 'chatbot_db',
            entities: [
                BotConfig,
                Course,
                FaqEntry,
                Intent,
                Lead,
                Trainer,
                User,
                Referral,
            ],
            synchronize: true,
        }),

        TypeOrmModule.forFeature([
            BotConfig,
            Course,
            FaqEntry,
            Intent,
            Lead,
            Trainer,
            User,
            Referral,
        ]),
    ],

    controllers: [
        AppController,
        AnalyticsController,
        AuthController,
        BotConfigController,
        ChatController,
        CourseController,
        FaqController,
        IntentController,
        LeadController,
        TrainerController,
        ReferralController,
    ],

    providers: [

        AppService,
        WhatsAppService,
        JwtUtil,
        DataSeeder,
        JwtAuthGuard,
        RolesGuard,

        { provide: BotConfigRepository,    useClass: BotConfigRepositoryImpl,    },
        { provide: BotConfigService,        useClass: BotConfigServiceImpl,        },
        { provide: CourseRepository,        useClass: CourseRepositoryImpl,        },
        { provide: CourseService,           useClass: CourseServiceImpl,           },
        { provide: FaqRepository,           useClass: FaqRepositoryImpl,           },
        { provide: FaqService,              useClass: FaqServiceImpl,              },
        { provide: IntentRepository,        useClass: IntentRepositoryImpl,        },
        { provide: IntentDetectorService,   useClass: IntentDetectorServiceImpl,   },
        { provide: IntentService,           useClass: IntentServiceImpl,           },
        { provide: LeadRepository,          useClass: LeadRepositoryImpl,          },
        { provide: LeadService,             useClass: LeadServiceImpl,             },
        { provide: TrainerRepository,       useClass: TrainerRepositoryImpl,       },
        { provide: TrainerService,          useClass: TrainerServiceImpl,          },
        { provide: UserRepository,          useClass: UserRepositoryImpl,          },
        { provide: ChatService,             useClass: ChatServiceImpl,             },
        { provide: DurationParserService,   useClass: DurationParserServiceImpl,   },
        { provide: ReferralRepository,      useClass: ReferralRepositoryImpl,      },
        { provide: ReferralService,         useClass: ReferralServiceImpl,         },
    ],
})

export class AppModule {}