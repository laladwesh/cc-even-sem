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
router.patch(
  '/:id/complete',
  ClerkExpressRequireAuth(),   // custom middleware that checks req.auth.userId or admin
  projectController.completeProject
);
module.exports = router;