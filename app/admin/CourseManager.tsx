"use client";

import { useState } from "react";
import { addCourse, updateCourse, deleteCourse, removeEnrollment, updateLesson } from "./actions";

export default function CourseManager({ courses }: { courses: any[] }) {
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", topics: "", internRole: "Software Development" });
  const [lessonFormData, setLessonFormData] = useState({ title: "", description: "", content: "" });

  const handleSaveCourse = async () => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, formData);
      // Don't close the panel entirely, just refresh the data in a real app.
      // We'll close it to go back to grid.
      setEditingCourse(null);
    } else {
      await addCourse(formData);
      setIsAdding(false);
    }
    setFormData({ title: "", description: "", topics: "", internRole: "Software Development" });
  };

  const handleSaveLesson = async () => {
    if (editingLesson) {
      await updateLesson(editingLesson.id, lessonFormData);
      setEditingLesson(null);
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setFormData({ title: course.title, description: course.description, topics: course.topics, internRole: course.internRole });
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingCourse(null);
    setFormData({ title: "", description: "", topics: "", internRole: "Software Development" });
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
      <div className="mt-8 bg-gray-800 p-6 rounded-lg mb-8 shadow-xl border border-gray-700 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{editingCourse ? "Edit Course Panel" : "Add New Course"}</h3>
          <button onClick={handleBackToGrid} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition">
            &larr; Back to Courses
          </button>
        </div>

        <div className="grid gap-4 mb-6">
          <input type="text" placeholder="Title" className="bg-gray-900 border border-gray-700 p-3 rounded text-white w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          <textarea placeholder="Description" className="bg-gray-900 border border-gray-700 p-3 rounded text-white w-full h-24 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <input type="text" placeholder="Topics (comma separated)" className="bg-gray-900 border border-gray-700 p-3 rounded text-white w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.topics} onChange={e => setFormData({ ...formData, topics: e.target.value })} />
          <input type="text" placeholder="Intern Role" className="bg-gray-900 border border-gray-700 p-3 rounded text-white w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.internRole} onChange={e => setFormData({ ...formData, internRole: e.target.value })} />
        </div>
        
        <div className="flex gap-4 border-b border-gray-700 pb-8 mb-8">
          <button onClick={handleSaveCourse} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-semibold transition">
            Save Course
          </button>
        </div>

        {/* LESSON MANAGEMENT (Only if editing an existing course) */}
        {editingCourse && (
          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4 text-indigo-300">Manage Lessons</h4>
            {editingCourse.lessons && editingCourse.lessons.length > 0 ? (
              <div className="space-y-4">
                {editingCourse.lessons.map((lesson: any) => (
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
                    {editingCourse.enrollments.map((enrollment: any) => (
                      <tr key={enrollment.id} className="hover:bg-gray-800/50">
                        <td className="p-3 text-gray-300">{enrollment.user.title} {enrollment.user.name}</td>
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
              <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">{course.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {course.topics.split(',').map((t: string) => (
                   <span key={t.trim()} className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-700/50">
                     {t.trim()}
                   </span>
                ))}
              </div>
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
