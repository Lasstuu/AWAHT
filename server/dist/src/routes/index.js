"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Column_1 = require("../models/Column");
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
router.post("/column", validateToken_1.validateToken, async (req, res) => {
    try {
        const title = req.body.title;
        const userId = req.body.userId;
        const newColumn = new Column_1.Column({ title, userId });
        await newColumn.save();
        res.status(201).json(newColumn);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/columns", validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.query.userId;
        const columns = await Column_1.Column.find({ userId });
        res.status(200).json(columns);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete("/column/:id", validateToken_1.validateToken, async (req, res) => {
    try {
        await Column_1.Column.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Column deleted" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/column/:id/card", validateToken_1.validateToken, async (req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const column = await Column_1.Column.findById(req.params.id);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const newCard = { title, content };
        column.cards.push(newCard);
        await column.save();
        res.status(201).json(column);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put("/column/:id", validateToken_1.validateToken, async (req, res) => {
    try {
        const title = req.body.title;
        const column = await Column_1.Column.findOne({ _id: req.params.id });
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        column.title = title;
        await column.save();
        res.status(201).json(column);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put("/move-card-up", validateToken_1.validateToken, async (req, res) => {
    try {
        const columnId = req.body.columnId;
        const cardId = req.body.cardId;
        const column = await Column_1.Column.findById(columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const cardIndex = column.cards.findIndex((card) => card._id == cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        const card = column.cards.splice(cardIndex, 1)[0];
        if (cardIndex == 0) {
            column.cards.splice(column.cards.length, 0, card);
        }
        else {
            column.cards.splice(cardIndex + 1, 0, card);
        }
        await column.save();
        res.status(201).json(column);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put("/move-card-down", validateToken_1.validateToken, async (req, res) => {
    try {
        const columnId = req.body.columnId;
        const cardId = req.body.cardId;
        const column = await Column_1.Column.findById(columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const cardIndex = column.cards.findIndex((card) => card._id == cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        const card = column.cards.splice(cardIndex, 1)[0];
        if (cardIndex == column.cards.length) {
            column.cards.splice(0, 0, card);
        }
        else {
            column.cards.splice(cardIndex + 1, 0, card);
        }
        await column.save();
        res.status(201).json(column);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put("/column/:columnId/card/:cardId", validateToken_1.validateToken, async (req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const column = await Column_1.Column.findById(req.params.columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const editCard = column.cards.find((card) => card._id == req.params.cardId);
        if (!editCard) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        editCard.title = title;
        editCard.content = content;
        await column.save();
        res.status(201).json(column);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put("/move-card", validateToken_1.validateToken, async (req, res) => {
    try {
        const { cardId, sourceColumnId, targetColumnId } = req.body;
        const sourceColumn = await Column_1.Column.findById(sourceColumnId);
        const targetColumn = await Column_1.Column.findById(targetColumnId);
        if (!sourceColumn || !targetColumn) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const cardIndex = sourceColumn.cards.findIndex((card) => card._id == cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: "Card not found in source column" });
            return;
        }
        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        targetColumn.cards.push(card);
        await sourceColumn.save();
        await targetColumn.save();
        res.status(200).json({ sourceColumn, targetColumn });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete("/column/:columnId/card/:cardId", validateToken_1.validateToken, async (req, res) => {
    try {
        const column = await Column_1.Column.findById(req.params.columnId);
        if (!column) {
            res.status(404).json({ message: "Column not asd found" });
            return;
        }
        const deleteCard = column.cards.findIndex((card) => card._id == req.params.cardId);
        column.cards.splice(deleteCard, 1);
        await column.save();
        res.status(201).json(column);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
