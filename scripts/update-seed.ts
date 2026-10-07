import fs from 'fs';
import path from 'path';

const seedFile = path.join(__dirname, '../prisma/seed.ts');
const mdFile = path.join(__dirname, '../# Web Development Fundamentals.md');

let seedContent = fs.readFileSync(seedFile, 'utf8');

const mdContent = fs.readFileSync(mdFile, 'utf8');
const sections = mdContent.split(/(?=^# \d+\. )/m);

// First element might just be the `# Web Development Fundamentals` header
const titleSection = sections.shift();

const webDevLessons = sections.map((section, index) => {
  const lines = section.trim().split('\n');
  const titleLine = lines.shift();
  const titleMatch = titleLine?.match(/^# \d+\. (.*)$/);
  const title = titleMatch ? titleMatch[1] : `Lesson ${index + 1}`;
  
  const content = lines.join('\n').trim();
  // We can use a simple substring for description
  const description = content.substring(0, 100).replace(/\n/g, ' ') + '...';

  return { title, description, content };
});

const newCourses = `  const coursesData = [
    {
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript from scratch and build your first responsive website.",
      topics: "HTML,CSS,JavaScript,Web",
      internRole: "Frontend Development",
      lessons: ${JSON.stringify(webDevLessons, null, 8)}
    },
    {
      title: "React from Zero to Hero",
      description: "Master modern React with hooks, context, and component patterns used in production apps.",
      topics: "React,JavaScript,Frontend",
      internRole: "Frontend Development",
      lessons: []
    },
    {
      title: "Python for Data Analysis",
      description: "Use pandas, NumPy, and matplotlib to clean, analyze, and visualize real datasets.",
      topics: "Python,Data,Pandas,Numpy",
      internRole: "Data Science",
      lessons: []
    },
    {
      title: "SQL and Database Design",
      description: "Write efficient queries and design normalized schemas that scale with your application.",
      topics: "SQL,Database,Design",
      internRole: "Backend Development",
      lessons: []
    },
    {
      title: "UI/UX Design Principles",
      description: "Understand layout, typography, color, and usability to design interfaces people love.",
      topics: "UI,UX,Design",
      internRole: "UI/UX Design",
      lessons: []
    },
    {
      title: "Machine Learning Basics",
      description: "A practical introduction to supervised learning, model evaluation, and scikit-learn.",
      topics: "Machine Learning,Python,AI",
      internRole: "Data Science",
      lessons: []
    },
    {
      title: "Digital Marketing Essentials",
      description: "Grow an audience with SEO, content strategy, email funnels, and paid ads that convert.",
      topics: "Marketing,SEO,Ads",
      internRole: "Marketing",
      lessons: []
    },
    {
      title: "Business English Communication",
      description: "Write clear emails, run confident meetings, and present your ideas professionally.",
      topics: "English,Business,Communication",
      internRole: "Business",
      lessons: []
    },
    {
      title: "Graphic Design with Figma",
      description: "Go from blank canvas to polished design system using Figma's modern workflow.",
      topics: "Figma,Design,Graphics",
      internRole: "Graphic Design",
      lessons: []
    },
    {
      title: "Mobile App Development with React Native",
      description: "Build and ship cross-platform iOS and Android apps from a single codebase.",
      topics: "React Native,Mobile,iOS,Android",
      internRole: "Mobile Development",
      lessons: []
    },
    {
      title: "Cybersecurity Awareness",
      description: "Recognize phishing, secure your accounts, and understand the basics of staying safe online",
      topics: "Security,Cybersecurity",
      internRole: "Security",
      lessons: []
    },
    {
      title: "Public Speaking Masterclass",
      description: "Beat stage fright and deliver talks that hold an audience from first line to last.",
      topics: "Speaking,Communication,Public Speaking",
      internRole: "Communication",
      lessons: []
    }
  ];`;

seedContent = seedContent.replace(/const coursesData = \[[\s\S]*?\];/, newCourses);

fs.writeFileSync(seedFile, seedContent);
console.log('seed.ts updated successfully.');
