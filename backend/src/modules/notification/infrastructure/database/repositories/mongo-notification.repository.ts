import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../mongoose/schemas/notification.schema';
import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import {
  NotificationEntity,
  NotificationType,
} from '../../../domain/entities/notification.entity';

@Injectable()
export class MongoNotificationRepository implements INotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  private mapToEntity(doc: any): NotificationEntity {
    return new NotificationEntity(
      doc._id.toString(),
      doc.companyId,
      doc.recipientId,
      doc.message,
      doc.type as NotificationType,
      doc.isRead,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(
    notification: Partial<NotificationEntity>,
  ): Promise<NotificationEntity> {
    const newNotification = new this.notificationModel(notification);
    const savedNotification = await newNotification.save();
    return this.mapToEntity(savedNotification);
  }

  async findById(
    id: string,
    companyId: string,
  ): Promise<NotificationEntity | null> {
    const doc = await this.notificationModel
      .findOne({ _id: id, companyId })
      .exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByUser(
    userId: string,
    companyId: string,
  ): Promise<NotificationEntity[]> {
    const docs = await this.notificationModel
      .find({ recipientId: userId, companyId })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async getUnreadCount(userId: string, companyId: string): Promise<number> {
    return this.notificationModel
      .countDocuments({
        recipientId: userId,
        companyId,
        isRead: false,
      })
      .exec();
  }

  async markAsRead(
    id: string,
    companyId: string,
  ): Promise<NotificationEntity | null> {
    const doc = await this.notificationModel
      .findOneAndUpdate(
        { _id: id, companyId },
        { $set: { isRead: true } },
        { new: true },
      )
      .exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async markAllAsRead(userId: string, companyId: string): Promise<boolean> {
    const result = await this.notificationModel
      .updateMany(
        { recipientId: userId, companyId, isRead: false },
        { $set: { isRead: true } },
      )
      .exec();

    return result.acknowledged;
  }

  async delete(id: string, companyId: string): Promise<boolean> {
    const result = await this.notificationModel
      .deleteOne({ _id: id, companyId })
      .exec();
    return result.deletedCount > 0;
  }
}
