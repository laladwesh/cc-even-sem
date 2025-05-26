// scripts/seedData.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const Project = require('./models/Project');
const Course  = require('./models/Course');
const User    = require('./models/User');

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/companygrow';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ MongoDB connected');

  // 1) Clear existing
  await Promise.all([
    Project.deleteMany({}),
    Course.deleteMany({}),
  ]);
  console.log('🗑️  Cleared Projects, Courses & Users');

  const O = () => new mongoose.Types.ObjectId();
  const now = new Date();

  // 2) Seed Projects
  const projectData = [
    {
      title: 'Website Redesign',
      description: 'Revamp corporate site with modern UI.',
      requiredSkills: ['HTML','CSS','JavaScript','React'],
      status: 'Pending', progress: 0,
      resources: [
        { title:'Figma Mockups', link:'https://figma.com', topics:['UI','UX'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()+1, 20),
    },
    {
      title: 'Mobile App API',
      description: 'REST API for iOS/Android.',
      requiredSkills: ['Node.js','Express','MongoDB'],
      status: 'In Progress', progress: 45,
      resources: [
        { title:'Express Guide', link:'https://expressjs.com/', topics:['Routing'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()+2, 5),
    },
    {
      title: 'Data Migration',
      description: 'SQL→MongoDB migration.',
      requiredSkills: ['SQL','ETL','Python'],
      status: 'Completed', progress: 100,
      resources: [
        { title:'ETL Patterns', link:'https://example.com/etl', topics:['Pipelines'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()-1, 28),
    },
    {
      title: 'Marketing Dashboard',
      description: 'Real-time marketing KPIs.',
      requiredSkills: ['React','D3.js','Node.js'],
      status: 'In Progress', progress: 60,
      resources: [
        { title:'D3 Tutorials', link:'https://d3js.org', topics:['Charts'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()+1, 10),
    },
    {
      title: 'Customer Chatbot',
      description: 'AI-driven support bot.',
      requiredSkills: ['Python','NLP','TensorFlow'],
      status: 'Pending', progress: 0,
      resources: [
        { title:'TensorFlow NLP', link:'https://tensorflow.org', topics:['Text'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()+3, 15),
    },
    {
      title: 'Security Audit',
      description: 'Full security & pen testing.',
      requiredSkills: ['Security','AWS','Network'],
      status: 'Pending', progress: 0,
      resources: [
        { title:'OWASP Guide', link:'https://owasp.org', topics:['Top10'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()+2, 28),
    },
    {
      title: 'Payment Integration',
      description: 'Stripe & PayPal checkout.',
      requiredSkills: ['Node.js','Stripe','PayPal API'],
      status: 'In Progress', progress: 30,
      resources: [
        { title:'Stripe API', link:'https://stripe.com/docs', topics:['Payments'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()+1, 25),
    },
    {
      title: 'Analytics Migration',
      description: 'GA → Matomo self-hosted.',
      requiredSkills: ['DevOps','Linux','Docker'],
      status: 'Completed', progress: 100,
      resources: [
        { title:'Matomo Docs', link:'https://matomo.org/docs', topics:['Setup'] },
      ],
      badge: O(), createdBy: O(),
      deadline: new Date(now.getFullYear(), now.getMonth()-2, 15),
    },
  ];
  const projectDocs = await Project.insertMany(projectData);
  console.log(`🌱 Seeded ${projectDocs.length} projects`);

  // 3) Seed Courses
  const courseData = [
    {
      thumbnail: '',
      title: 'React Fundamentals',
      description: 'Learn React from scratch.',
      category: 'Development',
      skillTags: ['React','JavaScript'],
      duration: 3,
      sections: [
        { title:'Intro to React',    link:'https://reactjs.org/docs/getting-started', duration: 20 },
        { title:'JSX & Props',       link:'https://reactjs.org/docs/jsx-in-depth',   duration: 30 },
        { title:'State & Lifecycle', link:'https://reactjs.org/docs/state-and-lifecycle', duration: 40 },
      ],
    },
    {
      thumbnail: '',
      title: 'Node.js API Design',
      description: 'Building scalable REST APIs.',
      category: 'Backend',
      skillTags: ['Node.js','Express'],
      duration: 2.5,
      sections: [
        { title:'Setup & Routing',  link:'https://expressjs.com/', duration: 25 },
        { title:'Middleware',       link:'https://expressjs.com/en/guide/writing-middleware.html', duration: 30 },
      ],
    },
    {
      thumbnail: '',
      title: 'Data Science with Python',
      description: 'Pandas, NumPy & Matplotlib.',
      category: 'Data',
      skillTags: ['Python','Pandas','NumPy'],
      duration: 4,
      sections: [
        { title:'NumPy Basics',        link:'https://numpy.org', duration: 30 },
        { title:'Pandas DataFrames',   link:'https://pandas.pydata.org', duration: 40 },
        { title:'Visualization',       link:'https://matplotlib.org', duration: 35 },
      ],
    },
    {
      thumbnail: '',
      title: 'AWS DevOps Essentials',
      description: 'CI/CD, Infrastructure as Code.',
      category: 'DevOps',
      skillTags: ['AWS','Terraform','CI/CD'],
      duration: 5,
      sections: [
        { title:'IAM & Security', link:'https://aws.amazon.com/iam', duration: 45 },
        { title:'Terraform Intro', link:'https://terraform.io',      duration: 50 },
      ],
    },
    {
      thumbnail: '',
      title: 'UI/UX Design Basics',
      description: 'Principles of user-centered design.',
      category: 'Design',
      skillTags: ['Figma','UX','UI'],
      duration: 2,
      sections: [
        { title:'User Research',    link:'https://www.nngroup.com/articles/user-research-methods/', duration: 30 },
        { title:'Wireframing',      link:'https://figma.com', duration: 25 },
      ],
    },
    {
      thumbnail: '',
      title: 'Marketing Analytics',
      description: 'Google Analytics & SEO.',
      category: 'Marketing',
      skillTags: ['SEO','Google Analytics'],
      duration: 3,
      sections: [
        { title:'GA4 Overview',    link:'https://analytics.google.com', duration: 35 },
        { title:'SEO Best Practices', link:'https://moz.com/beginners-guide-to-seo', duration: 40 },
      ],
    },
  ];
  const courseDocs = await Course.insertMany(courseData);
  console.log(`🌱 Seeded ${courseDocs.length} courses`);

  // 4) Seed Users
  const badgeIds = [O(), O(), O(), O(), O()]; // dummy badge references
  const userData = [
    // 10 users with varied enrollments & assignments
    {
      name:'Alice Johnson', email:'alice@example.com', password:'pass123',
      role:'employee', skills:['React','CSS'], experience:2,
      badges:[badgeIds[0]], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[
        { courseId:courseDocs[0]._id, progress:100, completedSections:[0,1,2] },
        { courseId:courseDocs[2]._id, progress: 75, completedSections:[0,1] }
      ],
      favouriteCourses:[{courseId:courseDocs[0]._id}],
      assignedProjects:[{projectId:projectDocs[0]._id,progress:0}]
    },
    {
      name:'Bob Williams', email:'bob@example.com', password:'pass123',
      role:'employee', skills:['Node.js','MongoDB'], experience:3,
      badges:[badgeIds[1]], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[
        {courseId:courseDocs[1]._id,progress:100,completedSections:[0,1]},
        {courseId:courseDocs[5]._id,progress: 60,completedSections:[0]}
      ],
      favouriteCourses:[{courseId:courseDocs[1]._id}],
      assignedProjects:[
        {projectId:projectDocs[1]._id,progress:45},
        {projectId:projectDocs[2]._id,progress:100}
      ]
    },
    {
      name:'Charlie Brown', email:'charlie@example.com', password:'pass123',
      role:'manager', skills:['Python','ETL'], experience:5,
      badges:[badgeIds[2]], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[], favouriteCourses:[],
      assignedProjects:[{projectId:projectDocs[2]._id,progress:100}]
    },
    {
      name:'Diana Miller', email:'diana@example.com', password:'pass123',
      role:'employee', skills:['Figma','UX'], experience:1,
      badges:[badgeIds[3]], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[
        {courseId:courseDocs[4]._id,progress:50,completedSections:[0]}
      ],
      favouriteCourses:[], assignedProjects:[{projectId:projectDocs[3]._id,progress:60}]
    },
    {
      name:'Ethan Smith', email:'ethan@example.com', password:'pass123',
      role:'employee', skills:['AWS','Terraform'], experience:4,
      badges:[badgeIds[4]], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[
        {courseId:courseDocs[3]._id,progress:30,completedSections:[]}
      ],
      favouriteCourses:[], assignedProjects:[{projectId:projectDocs[5]._id,progress:0}]
    },
    {
      name:'Fiona Zhang', email:'fiona@example.com', password:'pass123',
      role:'employee', skills:['SEO','Analytics'], experience:2,
      badges:[], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[
        {courseId:courseDocs[5]._id,progress:80,completedSections:[0]}
      ],
      favouriteCourses:[], assignedProjects:[{projectId:projectDocs[7]._id,progress:100}]
    },
    {
      name:'George Patel', email:'george@example.com', password:'pass123',
      role:'employee', skills:['DevOps','Linux'], experience:3,
      badges:[], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[], favouriteCourses:[],
      assignedProjects:[{projectId:projectDocs[6]._id,progress:30}]
    },
    {
      name:'Hannah Kim', email:'hannah@example.com', password:'pass123',
      role:'employee', skills:['D3.js','React'], experience:1,
      badges:[], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[
        {courseId:courseDocs[0]._id,progress:60,completedSections:[0]}
      ],
      favouriteCourses:[], assignedProjects:[{projectId:projectDocs[3]._id,progress:60}]
    },
    {
      name:'Isaac Lee', email:'isaac@example.com', password:'pass123',
      role:'manager', skills:['Security','AWS'], experience:6,
      badges:[], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[], favouriteCourses:[],
      assignedProjects:[{projectId:projectDocs[4]._id,progress:0}]
    },
    {
      name:'Julia Chen', email:'julia@example.com', password:'pass123',
      role:'employee', skills:['Python','Pandas'], experience:2,
      badges:[], clerkId:O().toHexString(), imageUrl:'',
      enrolledCourses:[
        {courseId:courseDocs[2]._id,progress:90,completedSections:[0,1]}
      ],
      favouriteCourses:[], assignedProjects:[{projectId:projectDocs[7]._id,progress:100}]
    },
  ];

  const insertedUsers = [];
  for (let u of userData) {
    u.password = await bcrypt.hash(u.password, 10);
    const doc = new User(u);
    await doc.save();
    insertedUsers.push(doc);
  }
  console.log(`🌱 Seeded ${insertedUsers.length} users`);

  // 5) Assign projects (update assignedTo arrays)
  await Promise.all([
    Project.findByIdAndUpdate(projectDocs[0]._id, { assignedTo: [insertedUsers[0]._id] }),
    Project.findByIdAndUpdate(projectDocs[1]._id, { assignedTo: [insertedUsers[1]._id] }),
    Project.findByIdAndUpdate(projectDocs[2]._id, { assignedTo: [insertedUsers[1]._id, insertedUsers[2]._id] }),
    Project.findByIdAndUpdate(projectDocs[3]._id, { assignedTo: [insertedUsers[3]._id, insertedUsers[7]._id] }),
    Project.findByIdAndUpdate(projectDocs[4]._id, { assignedTo: [insertedUsers[2]._id] }),
    Project.findByIdAndUpdate(projectDocs[5]._id, { assignedTo: [insertedUsers[4]._id] }),
    Project.findByIdAndUpdate(projectDocs[6]._id, { assignedTo: [insertedUsers[6]._id] }),
    Project.findByIdAndUpdate(projectDocs[7]._id, { assignedTo: [insertedUsers[5]._id, insertedUsers[9]._id] }),
  ]);

  console.log('🔗 Updated project assignments');

  // Done
  await mongoose.disconnect();
  console.log('👋 MongoDB disconnected');
}

main().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
