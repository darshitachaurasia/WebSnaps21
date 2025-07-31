import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoApp = () => {
    const [title, setTitle] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [editId, setEditId] = useState(null);
    const [searchItem, setSearchItem] = useState('');

    // Fetch todos
    const fetchItems = async () => {
        try {
            const res = await axios.get('http://localhost:3400/api/items');
            setTodoList(res.data.todos || []);
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Add or update todo
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            if (editId) {
                await axios.put(`http://localhost:3400/api/item/${editId}`, { title });
                setEditId(null);
            } else {
                await axios.post('http://localhost:3400/api/item', { title, description: '' });
            }
            setTitle('');
            fetchItems();
        } catch (err) {
            console.error('Error saving todo:', err);
        }
    };

    const startEdit = (id, value) => {
        setTitle(value);
        setEditId(id);
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:3400/api/item/${id}`);
            fetchItems();
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    const filteredList = todoList.filter(todo =>
        todo.title.toLowerCase().includes(searchItem.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    ✅ Todo App
                </h2>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="🔍 Search Todo..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Add / Edit Form */}
                <form onSubmit={handleSubmit} className="flex mb-6">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Todo"
                        className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 rounded-r-lg hover:bg-indigo-700 transition-all"
                    >
                        {editId ? 'Update' : 'Add'}
                    </button>
                </form>

                {/* Todo List */}
                <ul className="space-y-3">
                    {filteredList.length > 0 ? (
                        filteredList.map((todo) => (
                            <li
                                key={todo._id}
                                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition-all"
                            >
                                <span className="text-gray-800 font-medium">{todo.title}</span>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => startEdit(todo._id, todo.title)}
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => deleteItem(todo._id)}
                                        className="text-red-600 hover:text-red-800 font-semibold"
                                    >
                                        ❌
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No matching todos found</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TodoApp;

