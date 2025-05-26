const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { ensureAdmin } = require('../middleware/auth');

router.get('/my', ClerkExpressRequireAuth(), projectController.getMyProjects);
router.patch('/:id', ClerkExpressRequireAuth(), ensureAdmin ,projectController.editProjectAdmin);
router.get('/admin', ClerkExpressRequireAuth(), ensureAdmin, projectController.getAllProjectsAdmin);
router.post('/', ClerkExpressRequireAuth() ,ensureAdmin , projectController.createProject);
// router.put('/:id', protect, projectController.updateProject);
// router.delete('/:id', protect, projectController.deleteProject);

// router.post('/:id/assign', protect, projectController.assignProject);
// router.put('/:id/progress', protect, projectController.updateProgress);

module.exports = router;