"use client";

import { useState } from "react";
import type { Lesson, Prisma } from "@prisma/client";
import { addCourse, updateCourse, deleteCourse, removeEnrollment, updateLesson } from "./actions";
import UserDetailsModal from "./UserDetailsModal";

type CourseWithDetails = Prisma.CourseGetPayload<{
  include: { lessons: true; enrollments: { include: { user: true } } };
}>;

type CourseFormData = {
  title: string;
  description: string;
  category: string;
  price: string;
  thumbnailUrl: string;
  gifUrl: string;
  published: boolean;
  topics: string;
  internRole: string;
};

const COURSE_CATEGORIES = [
  { name: "Development", icon: "<>" },
  { name: "Data", icon: "↗" },
  { name: "Design", icon: "◉" },
  { name: "Business", icon: "⚑" },
  { name: "Security", icon: "◇" },
  { name: "Communication", icon: "▱" },
  { name: "General", icon: "▣" },
];

const EMPTY_COURSE_FORM: CourseFormData = {
  title: "",
  description: "",
  category: "Development",
  price: "0",
  thumbnailUrl: "",
  gifUrl: "",
  published: true,
  topics: "",
  internRole: "Software Development",
};

export default function CourseManager({ courses }: { courses: CourseWithDetails[] }) {
  const [editingCourse, setEditingCourse] = useState<CourseWithDetails | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(EMPTY_COURSE_FORM);
  const [lessonFormData, setLessonFormData] = useState({ title: "", description: "", content: "" });
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [courseSaveError, setCourseSaveError] = useState("");

  const handleSaveCourse = async () => {
    setCourseSaveError("");
    setIsSavingCourse(true);
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        thumbnailUrl: formData.thumbnailUrl.trim() || null,
        gifUrl: formData.gifUrl.trim() || null,
      };
      if (editingCourse) {
        await updateCourse(editingCourse.id, data);
      } else {
        await addCourse(data);
      }
      setEditingCourse(null);
      setIsAdding(false);
      setFormData(EMPTY_COURSE_FORM);
    } catch (error) {
      setCourseSaveError(error instanceof Error ? error.message : "Unable to save the course.");
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleSaveLesson = async () => {
    if (editingLesson) {
      await updateLesson(editingLesson.id, lessonFormData);
      setEditingLesson(null);
    }
  };

  const handleEditCourse = (course: CourseWithDetails) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category ?? "Development",
      price: String(course.price ?? 0),
      thumbnailUrl: course.thumbnailUrl ?? "",
      gifUrl: course.gifUrl ?? "",
      published: course.published ?? true,
      topics: course.topics,
      internRole: course.internRole,
    });
    setCourseSaveError("");
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingCourse(null);
    setFormData(EMPTY_COURSE_FORM);
    setCourseSaveError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToGrid = () => {
    setEditingCourse(null);
    setIsAdding(false);
    setEditingLesson(null);
  };

  // 1. ADD / EDIT PANEL
  if (isAdding || editingCourse) {
    return (
      <div className="mt-8 mb-8 rounded-3xl border border-[#523b69] bg-[#241631] p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold">{editingCourse ? "Edit Course" : "Add New Course"}</h3>
          <button onClick={handleBackToGrid} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:border-white/30 hover:text-white">
            &larr; Back to Courses
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSaveCourse();
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="course-title" className="block text-sm font-semibold text-gray-200">Title</label>
            <input
              id="course-title"
              type="text"
              required
              className="w-full rounded-xl border border-[#49315d] bg-[#301d3d] px-3.5 py-3 text-white outline-none transition focus:border-[#a56bc3] focus:ring-2 focus:ring-[#a56bc3]/30"
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="course-description" className="block text-sm font-semibold text-gray-200">Description</label>
            <textarea
              id="course-description"
              required
              rows={4}
              className="w-full resize-y rounded-xl border border-[#49315d] bg-[#301d3d] px-3.5 py-3 text-white outline-none transition focus:border-[#a56bc3] focus:ring-2 focus:ring-[#a56bc3]/30"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            />
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-semibold text-gray-200">Category</legend>
            <div className="flex flex-wrap gap-2">
              {COURSE_CATEGORIES.map((category) => {
                const isSelected = formData.category === category.name;
                return (
                  <button
                    key={category.name}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setFormData({ ...formData, category: category.name })}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#8c55a4] bg-[#75428a] text-white shadow-[0_0_18px_rgba(145,80,171,0.25)]"
                        : "border-[#49315d] bg-transparent text-gray-300 hover:border-[#805994] hover:text-white"
                    }`}
                  >
                    <span aria-hidden="true" className="text-base leading-none">{category.icon}</span>
                    {category.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="course-price" className="block text-sm font-semibold text-gray-200">Price (INR)</label>
              <input
                id="course-price"
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full rounded-xl border border-[#49315d] bg-[#301d3d] px-3.5 py-3 text-white outline-none transition focus:border-[#a56bc3] focus:ring-2 focus:ring-[#a56bc3]/30"
                value={formData.price}
                onChange={(event) => setFormData({ ...formData, price: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="course-thumbnail" className="block text-sm font-semibold text-gray-200">
                Thumbnail URL <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="course-thumbnail"
                type="url"
                placeholder="https://example.com/course.jpg"
                className="w-full rounded-xl border border-[#49315d] bg-[#301d3d] px-3.5 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#a56bc3] focus:ring-2 focus:ring-[#a56bc3]/30"
                value={formData.thumbnailUrl}
                onChange={(event) => setFormData({ ...formData, thumbnailUrl: event.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[#573d70] p-4">
            {formData.thumbnailUrl ? (
              <div
                role="img"
                aria-label="Course thumbnail preview"
                className="h-14 w-14 shrink-0 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url("${formData.thumbnailUrl.replaceAll('"', '\\"')}")` }}
              />
            ) : (
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#9253a7] to-[#542768] text-xl font-bold">
                {COURSE_CATEGORIES.find((category) => category.name === formData.category)?.icon ?? "<>"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{formData.category}</p>
              <p className="truncate font-bold text-white">{formData.title || "Course title preview"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="course-gif" className="block text-sm font-semibold text-gray-200">
              Course GIF <span className="font-normal text-gray-400">optional — plays above the course title</span>
            </label>
            <input
              id="course-gif"
              type="url"
              placeholder="https://example.com/spellbook.gif"
              className="w-full rounded-xl border border-[#49315d] bg-[#301d3d] px-3.5 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#a56bc3] focus:ring-2 focus:ring-[#a56bc3]/30"
              value={formData.gifUrl}
              onChange={(event) => setFormData({ ...formData, gifUrl: event.target.value })}
            />
          </div>

          <details className="rounded-xl border border-white/10 bg-black/10 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-gray-200">Course matching settings</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="course-topics" className="block text-sm text-gray-300">Recommendation topics (comma separated)</label>
                <input
                  id="course-topics"
                  type="text"
                  className="w-full rounded-lg border border-[#49315d] bg-[#301d3d] px-3 py-2 text-white outline-none focus:border-[#a56bc3]"
                  value={formData.topics}
                  onChange={(event) => setFormData({ ...formData, topics: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="course-intern-role" className="block text-sm text-gray-300">Intern role</label>
                <input
                  id="course-intern-role"
                  type="text"
                  className="w-full rounded-lg border border-[#49315d] bg-[#301d3d] px-3 py-2 text-white outline-none focus:border-[#a56bc3]"
                  value={formData.internRole}
                  onChange={(event) => setFormData({ ...formData, internRole: event.target.value })}
                />
              </div>
            </div>
          </details>

          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-gray-200">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(event) => setFormData({ ...formData, published: event.target.checked })}
              className="h-4 w-4 accent-[#d7a938]"
            />
            Published (visible to students)
          </label>

          {courseSaveError && (
            <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {courseSaveError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSavingCourse}
            className="rounded-full bg-gradient-to-r from-[#e4bd58] to-[#f2c55a] px-6 py-3 font-bold text-white shadow-[0_0_18px_rgba(237,190,72,0.35)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {isSavingCourse ? "Saving..." : editingCourse ? "Save changes" : "Create course"}
          </button>
        </form>

        {/* LESSON MANAGEMENT (Only if editing an existing course) */}
        {editingCourse && (
          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4 text-indigo-300">Manage Lessons</h4>
            {editingCourse.lessons && editingCourse.lessons.length > 0 ? (
              <div className="space-y-4">
                {editingCourse.lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-gray-900/50 p-4 rounded border border-gray-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-semibold text-white">{lesson.title}</h5>
                        <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingLesson(lesson);
                          setLessonFormData({ title: lesson.title, description: lesson.description, content: lesson.content });
                        }}
                        className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-1 rounded transition text-sm"
                      >
                        Edit Lesson
                      </button>
                    </div>

                    {editingLesson?.id === lesson.id && (
                      <div className="mt-4 bg-gray-800 p-4 rounded border border-gray-700">
                        <input type="text" className="bg-gray-900 border border-gray-700 p-2 rounded text-white w-full mb-3 text-sm" value={lessonFormData.title} onChange={e => setLessonFormData({ ...lessonFormData, title: e.target.value })} />
                        <input type="text" className="bg-gray-900 border border-gray-700 p-2 rounded text-white w-full mb-3 text-sm" value={lessonFormData.description} onChange={e => setLessonFormData({ ...lessonFormData, description: e.target.value })} />
                        <textarea className="bg-gray-900 border border-gray-700 p-2 rounded text-white w-full h-32 mb-3 text-sm" value={lessonFormData.content} onChange={e => setLessonFormData({ ...lessonFormData, content: e.target.value })} />
                        <div className="flex gap-2">
                          <button onClick={handleSaveLesson} className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-500">Save</button>
                          <button onClick={() => setEditingLesson(null)} className="bg-gray-600 text-white px-4 py-1 rounded text-sm hover:bg-gray-500">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No lessons found for this course.</p>
            )}
          </div>
        )}

        {/* ENROLLMENTS */}
        {editingCourse && (
          <div>
            <h4 className="text-xl font-bold mb-4 text-indigo-300">Enrolled Students ({editingCourse.enrollments.length})</h4>
            {editingCourse.enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border border-gray-700">
                  <thead className="bg-gray-900">
                    <tr className="text-gray-300 border-b border-gray-700">
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Email</th>
                      <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {editingCourse.enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-800/50">
                        <td className="p-3 text-gray-300">
                          <button 
                            onClick={() => setSelectedUserId(enrollment.user.id)}
                            className="text-indigo-300 hover:text-indigo-200 hover:underline text-left font-medium"
                          >
                            {enrollment.user.title} {enrollment.user.name}
                          </button>
                        </td>
                        <td className="p-3 text-gray-400">{enrollment.user.email}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={async () => {
                              if (confirm("Remove student from this course?")) {
                                await removeEnrollment(enrollment.id);
                                // Hacky immediate UI update could go here, but revalidatePath will refresh
                              }
                            }}
                            className="text-xs bg-red-900/30 text-red-400 hover:bg-red-900/60 px-3 py-1.5 rounded transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No students enrolled yet.</p>
            )}
          </div>
        )}

        {selectedUserId && (
          <UserDetailsModal 
            userId={selectedUserId} 
            onClose={() => setSelectedUserId(null)} 
          />
        )}
      </div>
    );
  }

  // 2. GRID DISPLAY
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold flex-grow mr-4">Manage Courses</h2>
        <button 
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium shadow-lg transition transform hover:scale-105"
        >
          + Add New Course
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map(course => (
          <div key={course.id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col h-full transition hover:scale-[1.02] hover:border-gray-500">
            <div className="flex-grow">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-900/50 px-2.5 py-1 text-xs text-indigo-200">{course.category}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs ${course.published ? "bg-green-500/10 text-green-300" : "bg-gray-700 text-gray-300"}`}>
                  {course.published ? "Published" : "Draft"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">{course.description}</p>
              <p className="mb-4 text-sm font-semibold text-yellow-300">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(course.price)}
              </p>

              {course.topics && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {course.topics.split(",").filter((topic: string) => topic.trim()).map((topic: string) => (
                    <span key={topic.trim()} className="rounded border border-indigo-700/50 bg-indigo-900/50 px-2 py-1 text-xs text-indigo-300">
                      {topic.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-gray-700 pt-4 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                <span className="block mb-1"><strong>Students:</strong> {course.enrollments?.length || 0}</span>
                <span className="block"><strong>Lessons:</strong> {course.lessons?.length || 0}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditCourse(course)}
                  className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-1.5 rounded transition text-sm font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this course?")) {
                      await deleteCourse(course.id);
                    }
                  }}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/40 px-3 py-1.5 rounded transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
