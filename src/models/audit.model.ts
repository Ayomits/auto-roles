import { Schema, model } from "mongoose";

export type AuditDocument = Document & {
  guildId: string;
  nextClear: Date;
}

export const AuditSchema = new Schema<AuditDocument>({
  guildId: {
    type: String,
    required: true
  },
  nextClear: {
    type: Date,
    required: true
  }
});

export const AuditModel = model<AuditDocument>(`audit`, AuditSchema);
