import e from "express";
import mongoose, { Document, Schema } from "mongoose";

interface ICard extends Document {
    title: string;
    content: string;
}

interface IColumn extends Document {
    title: string;
    userId: string;
    cards: ICard[];
}

const CardSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
});

const ColumnSchema: Schema = new Schema({
    title: { type: String, required: true },
    userId: { type: String, required: false },
    cards: { type: [CardSchema], default: [] }
});

const Column = mongoose.model<IColumn>("Column", ColumnSchema);

export { Column, IColumn, ICard };