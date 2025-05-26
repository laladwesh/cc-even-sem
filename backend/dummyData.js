// dummydata.js

const mongoose = require('mongoose');
const Course = require('./models/Course'); // adjust path if needed

async function seed() {
  try {
    // 1️⃣ connect
    await mongoose.connect('mongodb://localhost:27017/companygrow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // 2️⃣ clear out old data
    await Course.deleteMany({});
    console.log('🗑️  Cleared Course collection');

    // 3️⃣ define a larger set of courses
    const courses = [
      {
        thumbnail: 'https://picsum.photos/id/13/400/200',
        title: 'Cybersecurity Fundamentals',
        description: 'Learn threat modeling, network security, and best practices.',
        category: 'IT & Security',
        skillTags: ['Cybersecurity', 'Network Security'],
        mediaUrl: 'https://example.com/media/cybersec.mp4',
        duration: 4,
        sections: [
          { title: 'Intro to Cybersecurity', link: 'https://example.com/sec1', duration: 30 },
          { title: 'Network Threats', link: 'https://example.com/sec2', duration: 40 },
          { title: 'Secure Architectures', link: 'https://example.com/sec3', duration: 50 },
          { title: 'Incident Response', link: 'https://example.com/sec4', duration: 60 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/8/400/200',
        title: 'Machine Learning Introduction',
        description: 'Hands-on primer on ML workflows, algorithms, and Python libraries.',
        category: 'Data Science',
        skillTags: ['Machine Learning', 'Python'],
        mediaUrl: 'https://example.com/media/ml_intro.mp4',
        duration: 5,
        sections: [
          { title: 'ML Concepts & Terminology', link: 'https://example.com/sec1', duration: 45 },
          { title: 'Data Preprocessing', link: 'https://example.com/sec2', duration: 50 },
          { title: 'Training Models', link: 'https://example.com/sec3', duration: 60 },
          { title: 'Evaluation & Tuning', link: 'https://example.com/sec4', duration: 55 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/7/400/200',
        title: 'Financial Literacy for Employees',
        description: 'Master budgeting, investing basics, and understanding benefits.',
        category: 'Finance',
        skillTags: ['Budgeting', 'Investing'],
        mediaUrl: 'https://example.com/media/finance.mp4',
        duration: 3.5,
        sections: [
          { title: 'Personal Budgeting 101', link: 'https://example.com/sec1', duration: 40 },
          { title: 'Corporate Benefits', link: 'https://example.com/sec2', duration: 35 },
          { title: 'Intro to Investing', link: 'https://example.com/sec3', duration: 45 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/11/400/200',
        title: 'UI/UX Design Principles',
        description: 'Design thinking, wireframing, prototyping for web & mobile.',
        category: 'Design',
        skillTags: ['UI Design', 'UX Research'],
        mediaUrl: 'https://example.com/media/uiux.mp4',
        duration: 2.5,
        sections: [
          { title: 'Design Thinking', link: 'https://example.com/sec1', duration: 35 },
          { title: 'Wireframing Basics', link: 'https://example.com/sec2', duration: 40 },
          { title: 'Interactive Prototypes', link: 'https://example.com/sec3', duration: 45 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/6/400/200',
        title: 'Advanced SQL Techniques',
        description: 'Window functions, CTEs, performance tuning, and more.',
        category: 'Data Engineering',
        skillTags: ['SQL', 'Databases'],
        mediaUrl: 'https://example.com/media/sql_adv.mp4',
        duration: 4,
        sections: [
          { title: 'Window Functions', link: 'https://example.com/sec1', duration: 50 },
          { title: 'CTEs & Subqueries', link: 'https://example.com/sec2', duration: 45 },
          { title: 'Indexing & Optimization', link: 'https://example.com/sec3', duration: 60 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/12/400/200',
        title: 'Cloud Computing Basics',
        description: 'Introduction to AWS, Azure, GCP, and core cloud services.',
        category: 'Cloud',
        skillTags: ['AWS', 'Azure', 'GCP'],
        mediaUrl: 'https://example.com/media/cloud.mp4',
        duration: 3,
        sections: [
          { title: 'Cloud Fundamentals', link: 'https://example.com/sec1', duration: 40 },
          { title: 'Compute & Storage', link: 'https://example.com/sec2', duration: 50 },
          { title: 'Networking in the Cloud', link: 'https://example.com/sec3', duration: 45 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/5/400/200',
        title: 'Leadership Skills for Managers',
        description: 'Communicating, motivating teams, and conflict resolution.',
        category: 'Management',
        skillTags: ['Leadership', 'Communication'],
        mediaUrl: 'https://example.com/media/leadership.mp4',
        duration: 4.5,
        sections: [
          { title: 'Effective Communication', link: 'https://example.com/sec1', duration: 45 },
          { title: 'Motivation Techniques', link: 'https://example.com/sec2', duration: 50 },
          { title: 'Conflict Resolution', link: 'https://example.com/sec3', duration: 55 },
          { title: 'Performance Reviews', link: 'https://example.com/sec4', duration: 40 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/4/400/200',
        title: 'Effective Project Management',
        description: 'Agile, Scrum, Waterfall, risk management, and planning.',
        category: 'Project Management',
        skillTags: ['Agile', 'Scrum', 'Planning'],
        mediaUrl: 'https://example.com/media/pm.mp4',
        duration: 5,
        sections: [
          { title: 'Project Lifecycle', link: 'https://example.com/sec1', duration: 50 },
          { title: 'Agile vs Waterfall', link: 'https://example.com/sec2', duration: 60 },
          { title: 'Risk & Issue Management', link: 'https://example.com/sec3', duration: 55 },
          { title: 'Stakeholder Communication', link: 'https://example.com/sec4', duration: 45 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/1/400/200',
        title: 'Data Analysis with Python',
        description: 'Pandas, NumPy, data visualization, and basic stats.',
        category: 'Data Science',
        skillTags: ['Python', 'Pandas'],
        mediaUrl: 'https://example.com/media/data_py.mp4',
        duration: 4,
        sections: [
          { title: 'NumPy Basics', link: 'https://example.com/sec1', duration: 45 },
          { title: 'Pandas DataFrames', link: 'https://example.com/sec2', duration: 50 },
          { title: 'Visualization with Matplotlib', link: 'https://example.com/sec3', duration: 55 },
          { title: 'Basic Statistical Analysis', link: 'https://example.com/sec4', duration: 40 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/3/400/200',
        title: 'Advanced React Patterns',
        description: 'Hooks, context, render props, and performance tips.',
        category: 'Web Development',
        skillTags: ['React', 'JavaScript'],
        mediaUrl: 'https://example.com/media/react_adv.mp4',
        duration: 5,
        sections: [
          { title: 'Custom Hooks', link: 'https://example.com/sec1', duration: 45 },
          { title: 'Context API', link: 'https://example.com/sec2', duration: 50 },
          { title: 'Render Props', link: 'https://example.com/sec3', duration: 55 },
          { title: 'Performance Optimization', link: 'https://example.com/sec4', duration: 60 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/9/400/200',
        title: 'Business Communication Essentials',
        description: 'Emails, presentations, and interpersonal skills.',
        category: 'Communication',
        skillTags: ['Writing', 'Presentations'],
        mediaUrl: 'https://example.com/media/comm.mp4',
        duration: 3,
        sections: [
          { title: 'Professional Emailing', link: 'https://example.com/sec1', duration: 40 },
          { title: 'Effective Presentations', link: 'https://example.com/sec2', duration: 45 },
          { title: 'Interpersonal Skills', link: 'https://example.com/sec3', duration: 50 },
        ],
      },
      {
        thumbnail: 'https://picsum.photos/id/10/400/200',
        title: 'Ethical Hacking Basics',
        description: 'Penetration testing, vulnerability scanning, and tools.',
        category: 'IT & Security',
        skillTags: ['Ethical Hacking', 'Pen Testing'],
        mediaUrl: 'https://example.com/media/ethical_hack.mp4',
        duration: 4,
        sections: [
          { title: 'Pen Testing Workflow', link: 'https://example.com/sec1', duration: 45 },
          { title: 'Vulnerability Scanning', link: 'https://example.com/sec2', duration: 50 },
          { title: 'Common Tools Overview', link: 'https://example.com/sec3', duration: 55 },
        ],
      },
    ];

    // 4️⃣ insert them
    await Course.insertMany(courses);
    console.log(`✅ Seeded ${courses.length} courses`);

  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    // 5️⃣ disconnect
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

seed();
