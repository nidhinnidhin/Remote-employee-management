// src/modules/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './presentation/controllers/chat.controller';
import { ChatGateway } from './presentation/gateways/chat.gateway';
import { Conversation, ConversationSchema } from './infrastructure/database/mongoose/schemas/conversation.schema';
import { Message, MessageSchema } from './infrastructure/database/mongoose/schemas/message.schema';
import { MongoConversationRepository } from './infrastructure/database/repositories/mongo-conversation.repository';
import { MongoMessageRepository } from './infrastructure/database/repositories/mongo-message.repository';
import { SendMessageUseCase } from './application/use-cases/send-message.usecase';
import { CreateConversationUseCase } from './application/use-cases/create-conversation.usecase';
import { GetUserConversationsUseCase } from './application/use-cases/get-user-conversations.usecase';
import { GetConversationMessagesUseCase } from './application/use-cases/get-conversation-messages.usecase';
import { UpdateConversationUseCase } from './application/use-cases/update-conversation.usecase';
import { DeleteConversationUseCase } from './application/use-cases/delete-conversation.usecase';
import { LeaveConversationUseCase } from './application/use-cases/leave-conversation.usecase';
import { EditMessageUseCase } from './application/use-cases/edit-message.usecase';
import { DeleteMessageUseCase } from './application/use-cases/delete-message.usecase';
import { AuthModule } from '../auth/presentation/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    AuthModule, // Required for ICompanyRepository in WsJwtGuard
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    {
      provide: 'IConversationRepository',
      useClass: MongoConversationRepository,
    },
    {
      provide: 'IMessageRepository',
      useClass: MongoMessageRepository,
    },
    {
      provide: 'ISendMessageUseCase',
      useClass: SendMessageUseCase,
    },
    {
      provide: 'ICreateConversationUseCase',
      useClass: CreateConversationUseCase,
    },
    {
      provide: 'IGetUserConversationsUseCase',
      useClass: GetUserConversationsUseCase,
    },
    {
      provide: 'IGetConversationMessagesUseCase',
      useClass: GetConversationMessagesUseCase,
    },
    {
      provide: 'IUpdateConversationUseCase',
      useClass: UpdateConversationUseCase,
    },
    {
      provide: 'IDeleteConversationUseCase',
      useClass: DeleteConversationUseCase,
    },
    {
      provide: 'ILeaveConversationUseCase',
      useClass: LeaveConversationUseCase,
    },
    {
      provide: 'IEditMessageUseCase',
      useClass: EditMessageUseCase,
    },
    {
      provide: 'IDeleteMessageUseCase',
      useClass: DeleteMessageUseCase,
    },
  ],
  exports: ['ICreateConversationUseCase', ChatGateway],
})
export class ChatModule {}
