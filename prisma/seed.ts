import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@eduplatform.com" },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL || "admin@eduplatform.com",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Courses (merged with previous internships)
  const coursesData = [
    {
      title: "Full-Stack Web Development",
      description: "Master modern web development from frontend to backend.",
      topics: "React,Node.js,JavaScript,TypeScript,CSS,HTML",
      internRole: "Full-Stack Development",
      lessons: [
        { title: "Introduction to HTML & CSS", description: "Learn the building blocks of the web.", content: "This is the full lesson content for HTML & CSS..." },
        { title: "JavaScript Fundamentals", description: "Master JS variables, loops, and functions.", content: "JavaScript makes things interactive..." },
        { title: "Asynchronous JavaScript", description: "Learn Promises and async/await.", content: "Fetching data from APIs..." },
        { title: "React Basics", description: "Learn components, state, and props.", content: "React lets you build UIs efficiently..." },
        { title: "React Hooks and State Management", description: "useEffect, useContext, and custom hooks.", content: "Managing state in complex apps..." },
        { title: "Node.js & Express API", description: "Build your first backend API.", content: "Creating RESTful services..." },
        { title: "Database Integration", description: "Connect your app to a database.", content: "Using Prisma and SQL databases..." },
        { title: "Authentication", description: "Secure your application.", content: "Implementing JWT and sessions..." },
      ]
    },
    {
      title: "Data Science & Machine Learning",
      description: "Learn to analyze data and build predictive models.",
      topics: "Python,Machine Learning,Data Science,TensorFlow,Pandas",
      internRole: "Data Science",
      lessons: [
        { title: "Python for Data Science", description: "Learn Python basics for data manipulation.", content: "Python is a powerful language..." },
        { title: "Pandas and DataFrames", description: "Analyze data using Pandas.", content: "Pandas helps you work with tabular data..." },
        { title: "Data Visualization", description: "Create stunning charts with Matplotlib and Seaborn.", content: "Visualizing trends in data..." },
        { title: "Statistical Foundations", description: "Probability, distributions, and hypothesis testing.", content: "The math behind data science..." },
        { title: "Intro to Machine Learning", description: "Supervised vs Unsupervised learning.", content: "Concepts of machine learning..." },
        { title: "Linear & Logistic Regression", description: "Build your first predictive models.", content: "Predicting continuous and categorical outcomes..." },
        { title: "Deep Learning with TensorFlow", description: "Neural networks and deep learning.", content: "Training neural networks..." },
      ]
    },
    {
      title: "UI/UX Design Fundamentals",
      description: "Learn the principles of user interface and user experience design.",
      topics: "Design,Figma,UX,UI,Prototyping",
      internRole: "UI/UX Design",
      lessons: [
        { title: "What is UX Design?", description: "Understand user experience.", content: "UX design is about solving user problems..." },
        { title: "User Research & Personas", description: "Learn about your users.", content: "Conducting interviews and creating personas..." },
        { title: "Information Architecture", description: "Organizing content logically.", content: "Sitemaps and user flows..." },
        { title: "Wireframing Basics", description: "Sketching out interfaces.", content: "Low-fidelity designs..." },
        { title: "UI Design Principles", description: "Color, typography, and spacing.", content: "Making designs look good..." },
        { title: "Prototyping in Figma", description: "Create interactive mockups.", content: "Connecting screens together..." },
        { title: "Usability Testing", description: "Test your designs with real users.", content: "Finding and fixing usability issues..." },
      ]
    },
    {
      title: "Frontend Engineering Internship prep",
      description: "Work with our core product team to build and refine the user interface using React and Next.js.",
      topics: "React,Next.js,TypeScript,Frontend,JavaScript",
      internRole: "Frontend Engineering",
      lessons: [
        { title: "Advanced React", description: "Context, Hooks, Performance", content: "Learn advanced React concepts..." },
        { title: "Next.js Architecture", description: "SSR, SSG, and App Router", content: "Master Next.js for production..." },
        { title: "State Management with Zustand/Redux", description: "Handling global state.", content: "Complex state management..." },
        { title: "Component Testing", description: "Write tests for your UI components.", content: "Using Jest and React Testing Library..." },
        { title: "Web Accessibility (a11y)", description: "Make your apps usable by everyone.", content: "ARIA roles and keyboard navigation..." },
        { title: "Performance Optimization", description: "Make your React apps faster.", content: "Code splitting and lazy loading..." },
      ]
    },
    {
      title: "Data Science Internship prep",
      description: "Analyze user learning patterns and build recommendation models using Python and Pandas.",
      topics: "Python,Machine Learning,Data Science,Pandas",
      internRole: "Data Science",
      lessons: [
        { title: "Real-world Data Analysis", description: "Work with complex datasets", content: "Analyze large CSV files and extract insights..." },
        { title: "Building Recommendation Models", description: "Collaborative filtering", content: "Build a model to recommend courses to users..." },
        { title: "A/B Testing Methodologies", description: "Test product changes effectively.", content: "Designing and analyzing experiments..." },
        { title: "Natural Language Processing", description: "Analyze text data.", content: "Sentiment analysis and text classification..." },
        { title: "Model Deployment", description: "Serve your models via APIs.", content: "Using Flask or FastAPI..." },
        { title: "Dashboarding with Streamlit", description: "Build interactive data apps.", content: "Sharing insights with stakeholders..." },
      ]
    },
    {
      title: "Cloud Computing with AWS",
      description: "Deploy scalable, highly available web apps.",
      topics: "AWS,Cloud,DevOps,Docker",
      internRole: "Cloud Engineering",
      lessons: [
        { title: "Intro to Cloud", description: "What is cloud computing?", content: "Learn the basics of AWS..." },
        { title: "Compute Services (EC2)", description: "Run virtual servers in the cloud.", content: "Provisioning and managing EC2 instances..." },
        { title: "Storage Solutions (S3)", description: "Store files and assets.", content: "Buckets, permissions, and lifecycle rules..." },
        { title: "Databases on AWS (RDS & DynamoDB)", description: "Managed relational and NoSQL databases.", content: "Setting up databases in the cloud..." },
        { title: "Docker & Containers", description: "Containerize your apps", content: "Learn how to use Docker..." },
        { title: "Serverless Architecture", description: "Build apps without managing servers.", content: "Using AWS Lambda and API Gateway..." },
        { title: "CI/CD Pipelines", description: "Automate your deployments.", content: "Using GitHub Actions and CodePipeline..." },
      ]
    }
  ];

  // We need to delete old lessons first if we run upsert on courses, 
  // because nested create won't update existing lessons correctly.
  await prisma.lesson.deleteMany();

  for (const c of coursesData) {
    const courseId = c.title.replace(/[\s\/]+/g, "-").toLowerCase();
    await prisma.course.upsert({
      where: { id: courseId },
      update: {
        description: c.description,
        topics: c.topics,
        internRole: c.internRole,
        lessons: {
          create: c.lessons.map((l, index) => ({
            title: l.title,
            description: l.description,
            content: l.content,
            order: index + 1
          }))
        }
      },
      create: {
        id: courseId,
        title: c.title,
        description: c.description,
        topics: c.topics,
        internRole: c.internRole,
        lessons: {
          create: c.lessons.map((l, index) => ({
            title: l.title,
            description: l.description,
            content: l.content,
            order: index + 1
          }))
        }
      },
    });
  }
  console.log(`✅ ${coursesData.length} courses seeded with 6-8 lessons each`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
