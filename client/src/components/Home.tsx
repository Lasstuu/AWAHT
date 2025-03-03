import React, { useEffect, useState } from "react";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Dehaze from "@mui/icons-material/Dehaze";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { Menu, MenuItem, TextField } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ICard {
    title: string;
    content: string;
    _id: string;
}

interface IColumn {
    title: string;
    cards: ICard[];
    _id: string;
}

const createColumnn = async (title: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch("http://localhost:8001/column", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                userId: localStorage.getItem("userId")
            }),
        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const createCard = async (title: string, content: string, id: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/column/${id}/card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                content: content,
                id: id
            }),
        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const updateColumn = async (id: string, title: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/column/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
            }),
        });
        if (!response.ok) {
            throw new Error("Error updating data");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const updateCard = async (columnId: string, cardId: string, title: string, content: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/column/${columnId}/card/${cardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                content: content,
            }),
        });
        if (!response.ok) {
            throw new Error("Error updating data");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const deleteColumn = async (id: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/column/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};


const deleteCard = async (columnId: string, cardId: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/column/${columnId}/card/${cardId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

        });
        if (!response.ok) {
            console.log(response.json());
            
            throw new Error("Error fetching data");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const moveCard = async (cardId: string, sourceColumnId: string, targetColumnId: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/move-card`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                cardId,
                sourceColumnId,
                targetColumnId,
            }),
        });
        if (!response.ok) {
            throw new Error("Error moving card");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const moveCardUp = async ( columnId: string, cardId: string,) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/move-card-up`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                columnId,
                cardId,
            }),
        });
        if (!response.ok) {
            throw new Error("Error moving card");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};
const moveCardDown = async (columnId: string, cardId: string) => {
    const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`http://localhost:8001/move-card-down`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                columnId,
                cardId,
            }),
        });
        if (!response.ok) {
            throw new Error("Error moving card");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};
const Home = () => {
    const [columns, setColumns] = useState<IColumn[]>([]);
    const [selectedColumnId, setSelectedColumnId] = useState<string>("");
    const [editColumnId, setEditColumnId] = useState<string>("");
    const [editTitle, setEditTitle] = useState<string>("");
    const [editCardId, setEditCardId] = useState<string>("");
    const [editCardTitle, setEditCardTitle] = useState<string>("");
    const [editCardContent, setEditCardContent] = useState<string>("");

    const fetchColumns = async () => { // Fetch columns from the server and update the state
        const token = localStorage.getItem("auth_token");
        const userId = localStorage.getItem("userId");
        if (!token) return;
        
        try {
            const response = await fetch(`http://localhost:8001/columns?userId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching data");
            }
            const data: IColumn[] = await response.json();
            setColumns(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchColumns();
    }, []);

    const handleAddColumn = async () => {
        await createColumnn("Title");
        fetchColumns(); // update columns
    };

    const handleDeleteColumn = async (id: string) => {
        await deleteColumn(id);
        fetchColumns(); // update columns
        handleClose();
    };

    const handleEditColumn = (column: IColumn) => {
        setEditColumnId(column._id);
        setEditTitle(column.title);
    };

    const handleSaveColumn = async (id: string) => {
        await updateColumn(id, editTitle);
        setEditColumnId("");
        fetchColumns();
    };

    const handleAddCard = async (id: string) => {
        await createCard("Title", "Content", id);
        fetchColumns();
        handleClose();
    };

    const handleEditCard = (card: ICard) => {
        setEditCardId(card._id);
        setEditCardTitle(card.title);
        setEditCardContent(card.content);
    };

    const handleMoveCardUp = async (columnId: string, cardId: string) => {
        await moveCardUp(columnId, cardId);
        fetchColumns();
    };
    const handleMoveCardDown = async (columnId: string, cardId: string) => {
        await moveCardDown(columnId, cardId);
        fetchColumns();
    }

    const handleSaveCard = async (columnId: string, cardId: string) => {
        await updateCard(columnId, cardId, editCardTitle, editCardContent);
        setEditCardId("");
        fetchColumns();
    };
    const handleDeleteCard = async (columnId: string, cardId: string) => {
        await deleteCard(columnId, cardId);
        fetchColumns();
        
    };

    {/* Drag and drop functionality 
        https://kennethlange.com/drag-and-drop-in-pure-typescript-and-react/ */}
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedColumnId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedColumnId("");
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, cardId: string, columnId: string) => {
        event.dataTransfer.setData("text/plain", JSON.stringify({ cardId, columnId }));
        console.log(`Dragging card ${cardId} from column ${columnId}`);
    }
    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        const { cardId, columnId } = JSON.parse(data);
        if (columnId !== targetColumnId){
            const card = columns.find(col => col._id === columnId)?.cards.find(card => card._id === cardId);
            if (card){
                await moveCard(cardId, columnId, targetColumnId);
                fetchColumns();
            }
        }
        console.log(`Dropped card ${cardId} into column ${targetColumnId}`);
    }

    return (
        <div>
            <Grid container spacing={2} sx={{ padding: "16px" }}>
                {columns.map((column: IColumn) => (
                    <Grid onDragOver={enableDropping} onDrop={(event)=>handleDrop(event, column._id)} item xs={12} sm={6} md={4} lg={3} key={column._id} sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <Box sx={{ border: "1px solid black", padding: "10px", margin: "10px", height: "100%", position: "relative" }}>
                            <IconButton size="small"
                                onClick={(e) => handleClick(e, column._id)}
                                aria-controls="basic-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                sx={{ position: "absolute", top: 20, right: 5 }}
                            >
                                <Dehaze sx={{ fontSize: 30 }} />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <MenuItem onClick={() => handleAddCard(selectedColumnId)}>Add Card</MenuItem>
                                <MenuItem onClick={() => handleDeleteColumn(selectedColumnId)}>Delete Column</MenuItem>
                                <MenuItem onClick={() => handleEditColumn(columns.find((col) => col._id === selectedColumnId) as IColumn)}>Edit Column</MenuItem>
                            
                            </Menu>
                            {editColumnId === column._id ? (
                                <Box >
                                    <TextField
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onBlur={() => handleSaveColumn(column._id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSaveColumn(column._id);
                                            }
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box onDoubleClick={() => handleEditColumn(column)}>
                                    <h2>{column.title}</h2>
                                </Box>
                            )}
                            {column.cards.map((card) => (
                                <Box id={card._id} draggable="true" onDragStart={(event) => handleDragStart(event, card._id, column._id)} key={card._id} sx={{ border: "1px solid black", padding: "10px", margin: "10px", position: "relative" }}>
                                    {editCardId === card._id ? (
                                        <Box>

                                            <TextField
                                                value={editCardTitle}
                                                onChange={(e) => setEditCardTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleSaveCard(column._id, card._id);
                                                    }
                                                }}
                                                
                                            />
                                            <TextField
                                                value={editCardContent}
                                                onChange={(e) => setEditCardContent(e.target.value)}                                                                                    
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleSaveCard(column._id, card._id);
                                                    }
                                                }}
                                            />
                                            <IconButton size="small" onClick={() => handleSaveCard(column._id, card._id)}>
                                                Save
                                            </IconButton>
                                        </Box>
                                    ) : (
                                        <Box onDoubleClick={() => handleEditCard(card)} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <h3>{card.title}</h3>
                                            <p>{card.content}</p>
                                            <Box sx={{ display: "flex", alignItems:"center" , flexDirection: "column", justifyContent: "space-between", position: "absolute", right: 0, top: 0 }}>
                                                <IconButton size="small" onClick={() => handleMoveCardUp(column._id, card._id)}>
                                                    <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteCard(column._id, card._id)}>
                                                    <Delete sx={{ fontSize: 20 }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleMoveCardDown(column._id, card._id)}>
                                                    <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleEditCard(card)}>
                                                    <Dehaze sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Box>
                                            
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                ))}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20%", padding: "12px", margin: "20px" }}>
                    <IconButton size="medium" onClick={handleAddColumn}>
                        <Add sx={{ fontSize: 200 }} />
                    </IconButton>
                </Box>
            </Grid>
        </div>
    );
};

export default Home;
