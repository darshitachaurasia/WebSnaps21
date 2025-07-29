const todoModel = require('../models/todo.model');

const createTodo = async (req, res) => {
    const { title } = req.body;
    if (!title ) {
        return res.status(400).json({ message: "title missing" });
    }
    try {
        const todo = await todoModel.create({ title });
        return res.status(201).json({ message: "Todo created successfully", todo });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTodos = async (req, res) => {
    try {
        const todos = await todoModel.find();
        if (!todos.length) {
            return res.status(404).json({ message: "No todos found" });
        }
        return res.status(200).json({ message: "Todos fetched", todos });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const getSingleTodo = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "id required" });
    }
    try {
        const todo = await todoModel.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo fetched successfully", todo });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title,  completed } = req.body;
    try {
        const todo = await todoModel.findByIdAndUpdate(id, { title,  completed }, { new: true });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo updated successfully", todo });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await todoModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createTodo,
    getTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo
};
