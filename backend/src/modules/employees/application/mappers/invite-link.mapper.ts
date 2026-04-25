import { Types, FlattenMaps } from 'mongoose';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { InviteLinkDocument } from '../../infrastructure/schema/invite-link.schema';

export type LeanInviteLinkDocument = FlattenMaps<InviteLinkDocument> & {
  _id?: Types.ObjectId;
};

export class InviteLinkMapper {
  static toDomain(
    doc: InviteLinkDocument | LeanInviteLinkDocument,
  ): InviteLinkToken {
    return new InviteLinkToken(
      doc.token,
      doc.employeeId?.toString(),
      doc.expiresAt,
      !!doc.used,
    );
  }

  static toPersistence(token: InviteLinkToken): Partial<InviteLinkDocument> {
    return {
      token: token.token,
      employeeId: new Types.ObjectId(
        token.employeeId,
      ) as unknown as Types.ObjectId,
      expiresAt: token.expiresAt,
      used: token.used,
    } as Partial<InviteLinkDocument>;
  }
}
