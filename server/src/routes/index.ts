import { Router, Request, Response } from 'express';
import { Column, IColumn, ICard } from "../models/Column";
import { validateToken } from '../middleware/validateToken';
const router : Router = Router();


router.post("/column", validateToken, async (req: Request, res: Response) => {
    try {
        const title: string = req.body.title;
        const userId: string = req.body.userId;
        const newColumn = new Column({ title , userId});
        await newColumn.save();
        res.status(201).json(newColumn);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/columns", validateToken, async (req: Request, res: Response) => {
    try {
        const userId: string = req.query.userId as string;
        const columns: IColumn[] = await Column.find({userId})
        res.status(200).json(columns);
    } catch (error: any) {
        res.status(400).json({ error: error.message});
    }
});

router.delete("/column/:id", validateToken, async (req: Request, res: Response) => {
    try {
        await Column.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Column deleted" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/column/:id/card", validateToken, async (req: Request, res: Response) => {
    try {
        const title: string = req.body.title;
        const content: string = req.body.content;
        const column = await Column.findById(req.params.id);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const newCard: ICard = { title, content } as ICard
        column.cards.push(newCard);
        await column.save();
        res.status(201).json(column);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/column/:id", validateToken, async (req: Request, res: Response) => {
    try {
        const title: string = req.body.title;
        const column = await Column.findOne({_id: req.params.id});
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        column.title = title
        await column.save();
        res.status(201).json(column);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/move-card-up", validateToken, async (req: Request, res: Response) => {
    try {
        const columnId: string = req.body.columnId;
        const cardId: string = req.body.cardId;
        const column: IColumn | null = await Column.findById(columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const cardIndex: number = column.cards.findIndex((card: ICard) => card._id == cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        const card: ICard = column.cards.splice(cardIndex, 1)[0];
        if(cardIndex == 0){
            column.cards.splice(column.cards.length, 0, card);
        } else {
            column.cards.splice(cardIndex + 1, 0, card);
        }
        await column.save();
        res.status(201).json(column);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/move-card-down", validateToken, async (req: Request, res: Response) => {
    try {
        const columnId: string = req.body.columnId;
        const cardId: string = req.body.cardId;
        const column: IColumn | null = await Column.findById(columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const cardIndex: number = column.cards.findIndex((card: ICard) => card._id == cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        const card: ICard = column.cards.splice(cardIndex, 1)[0];
        if(cardIndex == column.cards.length){
            column.cards.splice(0, 0, card);
        } else {
            column.cards.splice(cardIndex + 1, 0, card);
        }
        await column.save();
        res.status(201).json(column);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
router.put("/column/:columnId/card/:cardId", validateToken, async (req: Request, res: Response) => {
    try {
        const title: string = req.body.title;
        const content: string = req.body.content;
        const column = await Column.findById(req.params.columnId);
        
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        const editCard:ICard | undefined = column.cards.find((card:ICard) => card._id == req.params.cardId);
        if (!editCard) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        editCard.title = title;
        editCard.content = content;
        await column.save();
        res.status(201).json(column);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
    });

router.put("/move-card", validateToken, async (req: Request, res: Response) => {
    try {
        const { cardId, sourceColumnId, targetColumnId } = req.body;

        const sourceColumn = await Column.findById(sourceColumnId);
        const targetColumn = await Column.findById(targetColumnId);

        if (!sourceColumn || !targetColumn) {
            res.status(404).json({ message: "Column not found" });
            return;
        }

        const cardIndex = sourceColumn.cards.findIndex((card: ICard) => card._id == cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: "Card not found in source column" });
            return;
        }

        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        targetColumn.cards.push(card);

        await sourceColumn.save();
        await targetColumn.save();

        res.status(200).json({ sourceColumn, targetColumn });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/column/:columnId/card/:cardId", validateToken, async (req: Request, res: Response) => {
    try {
        const column = await Column.findById(req.params.columnId);
        
        if (!column) {
            res.status(404).json({ message: "Column not asd found" });
            return;
        }
        const deleteCard:number | undefined = column.cards.findIndex((card:ICard) => card._id == req.params.cardId);
        column.cards.splice(deleteCard, 1);
        await column.save();
        res.status(201).json(column);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
    });
export default router;