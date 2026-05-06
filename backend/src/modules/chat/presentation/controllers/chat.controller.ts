import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Inject, Req, UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiResponse } from 'src/common/response/api-response.util';
import { CreateConversationDto } from '../../application/dto/create-conversation.dto';
import type { 
  ICreateConversationUseCase, 
  IGetUserConversationsUseCase, 
  IGetConversationMessagesUseCase,
  IUpdateConversationUseCase,
  IDeleteConversationUseCase,
  ILeaveConversationUseCase,
  IEditMessageUseCase,
  IDeleteMessageUseCase
} from '../../application/interfaces/chat-use-cases.interface';
import { ChatGateway } from '../gateways/chat.gateway';
import type { ICloudinaryService } from 'src/shared/services/cloudinary/interfaces/icloudinary.service';
import { CLOUDINARY_PATH } from 'src/shared/constants/path/cloudinary.path';

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
    @Inject('IUpdateConversationUseCase')
    private readonly _updateConversationUseCase: IUpdateConversationUseCase,
    @Inject('IDeleteConversationUseCase')
    private readonly _deleteConversationUseCase: IDeleteConversationUseCase,
    @Inject('ILeaveConversationUseCase')
    private readonly _leaveConversationUseCase: ILeaveConversationUseCase,
    @Inject('IEditMessageUseCase')
    private readonly _editMessageUseCase: IEditMessageUseCase,
    @Inject('IDeleteMessageUseCase')
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
    private readonly _chatGateway: ChatGateway,
  ) {}

  @Post('conversations')
  async createConversation(@Req() req: Request, @Body() dto: CreateConversationDto) {
    const { companyId, userId } = req.user as any;
    const conversation = await this._createConversationUseCase.execute(companyId, userId, dto);
    
    this._chatGateway.notifyConversationUpdate(conversation);
    
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
    @Req() req: Request,
    @Param('id') conversationId: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    const { userId } = req.user as any;
    const messages = await this._getConversationMessagesUseCase.execute(
      conversationId,
      limit ? Number(limit) : undefined,
      before ? new Date(before) : undefined,
      userId
    );
    return ApiResponse.success(messages, 'Messages retrieved successfully');
  }

  @Patch('conversations/:id')
  async updateConversation(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: { name?: string, avatar?: string, participants?: string[], admins?: string[] }
  ) {
    const { userId } = req.user as any;
    const conversation = await this._updateConversationUseCase.execute(id, userId, dto);
    
    this._chatGateway.notifyConversationUpdate(conversation);
    
    return ApiResponse.success(conversation, 'Conversation updated successfully');
  }

  @Delete('conversations/:id')
  async deleteConversation(@Req() req: Request, @Param('id') id: string) {
    const { userId } = req.user as any;
    
    await this._deleteConversationUseCase.execute(id, userId);
    
    this._chatGateway.notifyConversationDeletion(id);
    
    return ApiResponse.success(null, 'Conversation deleted successfully');
  }

  @Post('conversations/:id/leave')
  @HttpCode(HttpStatus.OK)
  async leaveConversation(@Req() req: Request, @Param('id') id: string) {
    const { userId } = req.user as any;
    await this._leaveConversationUseCase.execute(id, userId);
    
    this._chatGateway.notifyUserLeft(id, userId);
    
    return ApiResponse.success(null, 'Left conversation successfully');
  }

  @Patch('messages/:id')
  async editMessage(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('content') content: string
  ) {
    const { userId } = req.user as any;
    const message = await this._editMessageUseCase.execute(id, userId, content);
    
    // Notify room
    this._chatGateway.notifyMessageUpdate(message);
    
    return ApiResponse.success(message, 'Message edited successfully');
  }

  @Delete('messages/:id')
  async deleteMessage(
    @Req() req: Request,
    @Param('id') id: string,
    @Query('type') type: 'me' | 'everyone'
  ) {
    const { userId } = req.user as any;
    const message = await this._deleteMessageUseCase.execute(id, userId, type);
    
    if (type === 'everyone') {
        this._chatGateway.notifyMessageDeletion(message.conversationId, id);
    } else {
        this._chatGateway.notifyMessageDeletedForMe(message.conversationId, id, userId);
    }
    
    return ApiResponse.success(null, 'Message deleted successfully');
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGroupImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadResult = await this._cloudinaryService.uploadFile(
      file,
      CLOUDINARY_PATH.UPLOAD_CHAT_PATH,
    );

    return ApiResponse.success({
      imageUrl: uploadResult.secure_url,
    }, 'Group image uploaded successfully');
  }
}
