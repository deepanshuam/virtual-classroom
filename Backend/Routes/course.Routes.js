import { Router } from 'express';
import Course from '../Model/course.Model.js';
import { verifyJWT, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Create new course (admin only)
router.post('/book', verifyJWT, isAdmin, async (req, res) => {
    const { title, units } = req.body;
    const course = new Course({ title, units, instructor: req.user._id });
    await course.save();
    res.json(course);
});

// Get courses (for students)
router.get('/new', verifyJWT, async (req, res) => {
    try {
        const courses = await Course.find({}).populate('instructor');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving courses" });
    }
});

export default router;
