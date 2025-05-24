// backend/controllers/pdfController.js
const { PDFDocument, rgb } = require('pdf-lib');
const User = require('../models/User');

exports.exportPerformancePDF = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses.courseId assignedProjects.projectId');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    page.drawText(`Performance Report for ${user.name}`, { x: 50, y: 750, size: 18 });

    let y = 700;
    page.drawText(`Courses:`, { x: 50, y });
    y -= 20;

    user.enrolledCourses.forEach(course => {
      page.drawText(`- ${course.courseId?.title || 'Unknown'}: ${course.progress}%`, { x: 60, y });
      y -= 20;
    });

    y -= 10;
    page.drawText(`Projects:`, { x: 50, y });
    y -= 20;

    user.assignedProjects.forEach(project => {
      page.drawText(`- ${project.projectId?.title || 'Unknown'}: ${project.progress}%`, { x: 60, y });
      y -= 20;
    });

    y -= 10;
    page.drawText(`Badges Earned: ${user.badges.length}`, { x: 50, y });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=performance_report.pdf');
    res.send(pdfBytes);
  } catch (err) {
    res.status(500).json({ msg: 'PDF export failed', error: err.message });
  }
};
