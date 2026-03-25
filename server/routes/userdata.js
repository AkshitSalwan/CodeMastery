import express from 'express';
import { Question, Contest, Test, Activity } from '../models/UserDataModels.js';
import { requireAuth, getOrCreateUser } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check auth and load user
router.use(requireAuth);
router.use(getOrCreateUser);

// ===== QUESTIONS =====
router.post('/questions', async (req, res) => {
  try {
    const { title, description, difficulty, tags, test_cases } = req.body;
    const question = await Question.create({
      user_id: req.dbUser.id,
      title,
      description,
      difficulty,
      tags: tags || [],
      test_cases: test_cases || [],
    });
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { user_id: req.dbUser.id },
    });
    res.json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!question) return res.status(404).json({ error: 'Not found' });
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!question) return res.status(404).json({ error: 'Not found' });
    
    await question.update(req.body);
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!question) return res.status(404).json({ error: 'Not found' });
    
    await question.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== CONTESTS =====
router.post('/contests', async (req, res) => {
  try {
    const { title, description, problem_ids, duration_minutes } = req.body;
    const contest = await Contest.create({
      user_id: req.dbUser.id,
      title,
      description,
      problem_ids: problem_ids || [],
      duration_minutes: duration_minutes || 60,
    });
    res.json(contest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/contests', async (req, res) => {
  try {
    const contests = await Contest.findAll({
      where: { user_id: req.dbUser.id },
    });
    res.json(contests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/contests/:id', async (req, res) => {
  try {
    const contest = await Contest.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!contest) return res.status(404).json({ error: 'Not found' });
    res.json(contest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/contests/:id', async (req, res) => {
  try {
    const contest = await Contest.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!contest) return res.status(404).json({ error: 'Not found' });
    
    await contest.update(req.body);
    res.json(contest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/contests/:id', async (req, res) => {
  try {
    const contest = await Contest.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!contest) return res.status(404).json({ error: 'Not found' });
    
    await contest.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== TESTS =====
router.post('/tests', async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const test = await Test.create({
      user_id: req.dbUser.id,
      title,
      description,
      questions: questions || [],
    });
    res.json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.findAll({
      where: { user_id: req.dbUser.id },
    });
    res.json(tests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tests/:id', async (req, res) => {
  try {
    const test = await Test.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!test) return res.status(404).json({ error: 'Not found' });
    res.json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/tests/:id', async (req, res) => {
  try {
    const test = await Test.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!test) return res.status(404).json({ error: 'Not found' });
    
    await test.update(req.body);
    res.json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/tests/:id', async (req, res) => {
  try {
    const test = await Test.findOne({
      where: { id: req.params.id, user_id: req.dbUser.id },
    });
    if (!test) return res.status(404).json({ error: 'Not found' });
    
    await test.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== ACTIVITIES =====
router.post('/activities', async (req, res) => {
  try {
    const { type, description, metadata } = req.body;
    const activity = await Activity.create({
      user_id: req.dbUser.id,
      type,
      description,
      metadata: metadata || {},
    });
    res.json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/activities', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const activities = await Activity.findAll({
      where: { user_id: req.dbUser.id },
      limit,
      order: [['created_at', 'DESC']],
    });
    res.json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
