const CATEGORY_BY_TITLE: Record<string, string> = {
  "web development fundamentals": "Development",
  "react from zero to hero": "Development",
  "mobile app development with react native": "Development",
  "dsa for beginners": "Development",
  "python for data analysis": "Data",
  "sql and database design": "Data",
  "machine learning basics": "Data",
  "ui/ux design principles": "Design",
  "graphic design with figma": "Design",
  "digital marketing essentials": "Business",
  "cybersecurity awareness": "Security",
  "business english communication": "Communication",
  "public speaking masterclass": "Communication",
};

export function getCourseCategory(course: {
  title: string;
  category: string;
  categoryCustomized: boolean;
}): string {
  if (course.categoryCustomized) return course.category;
  return CATEGORY_BY_TITLE[course.title.trim().toLowerCase()] ?? course.category;
}
