import express from 'express';
import { auth } from '../middleware/auth.js';
// import { checkRole } from '../middleware/roleAuth.js';
import Todo from '../models/Todo.js';

const router = express.Router();

// Get all todos for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route: Get all todos from all users
// router.get('/all', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const todos = await Todo.find().populate('user', 'name' , 'email').sort({ createdAt: -1 });
//     res.json(todos);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const todo = new Todo({
      title,
      description,
      dueDate,
      user: req.userId
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    Object.assign(todo, req.body);
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route: Update any todo
// router.put('/admin/:id', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) {
//       return res.status(404).json({ message: 'Todo not found' });
//     }

//     Object.assign(todo, req.body);
//     await todo.save();
//     res.json(todo);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route: Delete any todo
// router.delete('/admin/:id', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const todo = await Todo.findByIdAndDelete(req.params.id);
//     if (!todo) {
//       return res.status(404).json({ message: 'Todo not found' });
//     }
//     res.json({ message: 'Todo deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

export default router;