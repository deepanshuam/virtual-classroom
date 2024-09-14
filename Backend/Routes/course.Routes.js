import { Router } from 'express';
import Course  from '../Model/course.Model.js';
import { verifyJWT, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Create new course (admin only)
router.post('/book', verifyJWT, isAdmin, async (req, res) => {
    const { title, units } = req.body;
    const course = new Course({ title, units, instructor: req.user.id });
    await course.save();
    res.json(course);
});

// Get courses (for students)
router.get('/new', verifyJWT, async (req, res) => {
    const courses = await find({}).populate('instructor');
    res.json(courses);
});

export default router;
