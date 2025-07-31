const router = require('express').Router();
const { createTodo, getTodos, updateTodo, deleteTodo, getSingleTodo } = require('../controller/todo.controller');

router.post('/api/item', createTodo);
router.get('/api/items', getTodos);
router.get('/api/items/:id', getSingleTodo);
router.put('/api/item/:id', updateTodo);
router.delete('/api/item/:id', deleteTodo);

module.exports = router;
