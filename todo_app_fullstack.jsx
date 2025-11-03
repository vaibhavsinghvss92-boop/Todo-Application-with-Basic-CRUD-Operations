// ============================================
// FULL STACK TODO APPLICATION (Single Code)
// React + Node.js + Express + MongoDB
// ============================================

// ----- server.js (Backend) -----
// Create file: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({ text: req.body.text, completed: false });
  await todo.save();
  res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));


// ----- React Frontend (client/src/App.js) -----
// In terminal:
// npx create-react-app client
// cd client && npm install axios
// Then replace src/App.js with below code

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get('http://localhost:5000/todos');
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!text) return;
    await axios.post('http://localhost:5000/todos', { text });
    setText('');
    fetchTodos();
  };

  const toggleTodo = async (id, completed) => {
    await axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    fetchTodos();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Todo Application</h1>
      <div className="flex mb-4">
        <input
          className="border p-2 rounded-l"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
          >
            <span
              onClick={() => toggleTodo(todo._id, todo.completed)}
              className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
            >
              {todo.text}
            </span>
            <button
              className="text-red-500"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


// ----- Run Instructions -----
// 1. Start MongoDB locally (or use MongoDB Atlas)
// 2. Run backend: node server.js
// 3. In /client folder: npm start
// 4. Open http://localhost:3000
