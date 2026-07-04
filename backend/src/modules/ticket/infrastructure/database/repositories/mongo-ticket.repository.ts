import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import {
  ITicketRepository,
  TicketFilter,
} from '../../../domain/repositories/iticket.repository';
import { TicketEntity } from '../../../domain/entities/ticket.entity';
import {
  TicketSchemaClass,
  TicketDocument,
} from '../mongoose/schemas/ticket.schema';
import { TicketMapper } from '../../../application/mappers/ticket.mapper';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';

@Injectable()
export class MongoTicketRepository implements ITicketRepository {
  constructor(
    @InjectModel(TicketSchemaClass.name)
    private readonly _ticketModel: Model<TicketDocument>,
  ) {}

  async create(ticket: TicketEntity): Promise<TicketEntity> {
    const created = await this._ticketModel.create({
      companyId: new Types.ObjectId(ticket.companyId),
      raisedBy: new Types.ObjectId(ticket.raisedBy),
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
    });
    return TicketMapper.toDomain(created);
  }

  async findById(id: string): Promise<TicketEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._ticketModel.findById(id).lean().exec();
    return doc
      ? TicketMapper.toDomain(
          doc as unknown as Parameters<typeof TicketMapper.toDomain>[0],
        )
      : null;
  }

  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<TicketDocument> = {
      companyId: new Types.ObjectId(companyId),
    };

    this._applyFilters(query, filter);

    const [data, total] = await Promise.all([
      this._ticketModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this._ticketModel.countDocuments(query).exec(),
    ]);

    return {
      data: data.map((doc) =>
        TicketMapper.toDomain(
          doc as unknown as Parameters<typeof TicketMapper.toDomain>[0],
        ),
      ),
      total,
    };
  }

  async findAll(
    page: number,
    limit: number,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<TicketDocument> = {};

    this._applyFilters(query, filter);

    const [data, total] = await Promise.all([
      this._ticketModel
        .find(query)
        .populate('companyId', 'name') // Populates reference models safely
        .populate('raisedBy', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this._ticketModel.countDocuments(query).exec(),
    ]);

    return {
      data: data.map((doc: any) => {
        // Formats populated documents to adapt cleanly to the TicketMapper structure
        const formattedDoc = {
          ...doc,
          companyName: doc.companyId?.name || 'Unknown Organization',
          userEmail: doc.raisedBy?.email || 'System User',
          companyId: doc.companyId?._id || doc.companyId,
          raisedBy: doc.raisedBy?._id || doc.raisedBy,
        };
        return TicketMapper.toDomain(
          formattedDoc as unknown as Parameters<typeof TicketMapper.toDomain>[0],
        );
      }),
      total,
    };
  }

  async updateStatus(
    id: string,
    status: TicketStatus,
    statusNote?: string,
  ): Promise<TicketEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const updated = await this._ticketModel
      .findByIdAndUpdate(
        id,
        {
          status,
          ...(statusNote !== undefined && { statusNote }),
        },
        { new: true },
      )
      .populate('companyId', 'name') // Prevents details from vanishing upon update execution
      .populate('raisedBy', 'email')
      .lean()
      .exec();

    if (!updated) return null;

    const formattedDoc = {
      ...updated,
      companyName: (updated.companyId as any)?.name || 'Unknown Organization',
      userEmail: (updated.raisedBy as any)?.email || 'System User',
      companyId: (updated.companyId as any)?._id || updated.companyId,
      raisedBy: (updated.raisedBy as any)?._id || updated.raisedBy,
    };

    return TicketMapper.toDomain(
      formattedDoc as unknown as Parameters<typeof TicketMapper.toDomain>[0],
    );
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private _applyFilters(
    query: FilterQuery<TicketDocument>,
    filter?: TicketFilter,
  ): void {
    if (!filter) return;

    // Status filter
    if (filter.status) {
      query.status = filter.status;
    }

    // Priority filter
    if (filter.priority) {
      query.priority = filter.priority;
    }

    // Search: regex match on title OR description (case-insensitive)
    if (filter.search && filter.search.trim() !== '') {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }
  }
}