const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, projectController.getMyProjects);
router.post('/', protect, projectController.createProject);
router.put('/:id', protect, projectController.updateProject);
router.delete('/:id', protect, projectController.deleteProject);

router.post('/:id/assign', protect, projectController.assignProject);
router.put('/:id/progress', protect, projectController.updateProgress);

module.exports = router;
