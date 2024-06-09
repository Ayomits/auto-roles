import { Schema, model } from "mongoose";
export type managersDoc = Document & {
  guildId: string;
  piarId: string;

  piars: {
    weekly: number;
    alltime: number;
  };
  date: Date;
  vigovor: number;
};

const managersSchem = new Schema<managersDoc>({
  guildId: {
    type: String,
    required: true,
  },
  piarId: {
    type: String,
    required: true,
  },

  piars: {
    weekly: {
      type: Number,
      default: 0,
    },
    alltime: {
      type: Number,
      default: 0,
    },
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },

  vigovor: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const ManagersSchema = model("managers", managersSchem);
