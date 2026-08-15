import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
});

const COURSES = [
  {
    title: "Web Development Fundamentals",
    category: "Development",
    description: "Learn HTML, CSS, and JavaScript from scratch and build your first responsive website.",
    price: 4900,
    lessons: ["How the web works", "HTML structure and semantics", "Styling with CSS", "JavaScript basics", "Your first project"],
  },
  {
    title: "React from Zero to Hero",
    category: "Development",
    description: "Master modern React with hooks, context, and component patterns used in production apps.",
    price: 7900,
    lessons: ["Components and JSX", "State and props", "Hooks deep dive", "Context and global state", "Building a full app"],
  },
  {
    title: "Python for Data Analysis",
    category: "Data",
    description: "Use pandas, NumPy, and matplotlib to clean, analyze, and visualize real datasets.",
    price: 6900,
    lessons: ["Python refresher", "NumPy arrays", "pandas DataFrames", "Cleaning messy data", "Plotting results"],
  },
  {
    title: "SQL and Database Design",
    category: "Data",
    description: "Write efficient queries and design normalized schemas that scale with your application.",
    price: 5900,
    lessons: ["SELECT basics", "Joins explained", "Aggregations and grouping", "Indexes and performance", "Schema normalization"],
  },
  {
    title: "UI/UX Design Principles",
    category: "Design",
    description: "Understand layout, typography, color, and usability to design interfaces people love.",
    price: 5400,
    lessons: ["Design thinking", "Layout and grids", "Typography", "Color theory", "Usability testing"],
  },
  {
    title: "Machine Learning Basics",
    category: "Data",
    description: "A practical introduction to supervised learning, model evaluation, and scikit-learn.",
    price: 8900,
    lessons: ["What is ML?", "Linear regression", "Classification", "Model evaluation", "Avoiding overfitting"],
  },
  {
    title: "Digital Marketing Essentials",
    category: "Business",
    description: "Grow an audience with SEO, content strategy, email funnels, and paid ads that convert.",
    price: 4400,
    lessons: ["Marketing fundamentals", "SEO basics", "Content strategy", "Email marketing", "Running paid ads"],
  },
  {
    title: "Business English Communication",
    category: "Communication",
    description: "Write clear emails, run confident meetings, and present your ideas professionally.",
    price: 3900,
    lessons: ["Professional email writing", "Meeting vocabulary", "Presentation skills", "Negotiation phrases", "Cross-cultural etiquette"],
  },
  {
    title: "Graphic Design with Figma",
    category: "Design",
    description: "Go from blank canvas to polished design system using Figma's modern workflow.",
    price: 5900,
    lessons: ["Figma interface tour", "Frames and layers", "Components and variants", "Auto layout", "Prototyping"],
  },
  {
    title: "Mobile App Development with React Native",
    category: "Development",
    description: "Build and ship cross-platform iOS and Android apps from a single codebase.",
    price: 8400,
    lessons: ["Environment setup", "Core components", "Navigation", "Working with APIs", "Publishing your app"],
  },
  {
    title: "Cybersecurity Awareness",
    category: "Security",
    description: "Recognize phishing, secure your accounts, and understand the basics of staying safe online.",
    price: 3400,
    lessons: ["Threat landscape", "Passwords and 2FA", "Phishing red flags", "Safe browsing", "Incident response basics"],
  },
  {
    title: "Public Speaking Masterclass",
    category: "Communication",
    description: "Beat stage fright and deliver talks that hold an audience from first line to last.",
    price: 4900,
    lessons: ["Managing nerves", "Structuring a talk", "Voice and body language", "Handling questions", "Practice and feedback"],
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@edu.local" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@edu.local",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "student@edu.local" },
    update: {},
    create: {
      name: "Sample Student",
      email: "student@edu.local",
      passwordHash: studentPassword,
      role: "STUDENT",
    },
  });

  for (const course of COURSES) {
    const existing = await prisma.course.findFirst({ where: { title: course.title } });
    if (existing) {
      // Keep categories in sync for databases seeded before they existed.
      await prisma.course.update({
        where: { id: existing.id },
        data: { category: course.category },
      });
      continue;
    }

    await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        published: true,
        createdById: admin.id,
        lessons: {
          create: course.lessons.map((title, index) => ({
            title,
            content: `Lesson content for "${title}". Replace this with a video URL or lesson text.`,
            order: index + 1,
          })),
        },
      },
    });
  }

  const count = await prisma.course.count();
  console.log(`Seed complete. ${count} courses in database.`);
  console.log("Admin login:   admin@edu.local / admin123");
  console.log("Student login: student@edu.local / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
