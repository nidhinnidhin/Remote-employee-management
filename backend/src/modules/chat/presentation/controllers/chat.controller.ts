import { Controller, Post, Get, Body, Param, Query, UseGuards, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiResponse } from 'src/common/response/api-response.util';
import { CreateConversationDto } from '../../application/dto/create-conversation.dto';
import type { 
  ICreateConversationUseCase, 
  IGetUserConversationsUseCase, 
  IGetConversationMessagesUseCase 
} from '../../application/interfaces/chat-use-cases.interface';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    @Inject('ICreateConversationUseCase')
    private readonly _createConversationUseCase: ICreateConversationUseCase,
    @Inject('IGetUserConversationsUseCase')
    private readonly _getUserConversationsUseCase: IGetUserConversationsUseCase,
    @Inject('IGetConversationMessagesUseCase')
    private readonly _getConversationMessagesUseCase: IGetConversationMessagesUseCase,
  ) {}

  @Post('conversations')
  async createConversation(@Req() req: Request, @Body() dto: CreateConversationDto) {
    const { companyId, userId } = req.user as any;
    const conversation = await this._createConversationUseCase.execute(companyId, userId, dto);
    return ApiResponse.success(conversation, 'Conversation created successfully');
  }

  @Get('conversations')
  async getUserConversations(@Req() req: Request) {
    const { companyId, userId } = req.user as any;
    const conversations = await this._getUserConversationsUseCase.execute(companyId, userId);
    return ApiResponse.success(conversations, 'Conversations retrieved successfully');
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Param('id') conversationId: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    const messages = await this._getConversationMessagesUseCase.execute(
      conversationId,
      limit ? Number(limit) : undefined,
      before ? new Date(before) : undefined,
    );
    return ApiResponse.success(messages, 'Messages retrieved successfully');
  }
}
