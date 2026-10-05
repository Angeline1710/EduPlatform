import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { desiredCourses: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const topics = user.desiredCourses.map((dc) => dc.topic.toLowerCase());

    if (topics.length === 0) {
      return NextResponse.json({ success: true, data: { courses: [], internships: [] } });
    }

    // SQLite stores topics as comma-separated string — filter in JS
    const allCourses = await prisma.course.findMany();
    const allInternships = await prisma.internship.findMany();

    const courses = allCourses.filter((c) =>
      c.topics
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .some((t) => topics.includes(t))
    );

    const internships = allInternships.filter((i) =>
      i.topics
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .some((t) => topics.includes(t))
    );

    return NextResponse.json({ success: true, data: { courses, internships } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
