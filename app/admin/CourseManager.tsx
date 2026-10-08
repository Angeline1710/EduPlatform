"use client";

import { useState } from "react";
import { addCourse, updateCourse, deleteCourse, removeEnrollment } from "../actions";

export default function CourseManager({ courses }: { courses: any[] }) {
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", topics: "", internRole: "Software Development" });

  const handleSave = async () => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, formData);
      setEditingCourse(null);
    } else {
      await addCourse(formData);
      setIsAdding(false);
    }
    setFormData({ title: "", description: "", topics: "", internRole: "Software Development" });
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({ title: course.title, description: course.description, topics: course.topics, internRole: course.internRole });
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingCourse(null);
    setFormData({ title: "", description: "", topics: "", internRole: "Software Development" });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 flex-grow mr-4">Manage Courses</h2>
        <button 
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded transition"
        >
          + Add New Course
        </button>
      </div>

      {(isAdding || editingCourse) && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl mb-4 font-semibold">{editingCourse ? "Edit Course" : "Add New Course"}</h3>
          <div className="grid gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Title" 
              className="bg-gray-900 border border-gray-700 p-2 rounded text-white w-full"
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
            />
            <textarea 
              placeholder="Description" 
              className="bg-gray-900 border border-gray-700 p-2 rounded text-white w-full h-24"
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Topics (comma separated)" 
              className="bg-gray-900 border border-gray-700 p-2 rounded text-white w-full"
              value={formData.topics} 
              onChange={e => setFormData({ ...formData, topics: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Intern Role" 
              className="bg-gray-900 border border-gray-700 p-2 rounded text-white w-full"
              value={formData.internRole} 
              onChange={e => setFormData({ ...formData, internRole: e.target.value })} 
            />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
            >
              Save Course
            </button>
            <button 
              onClick={() => { setIsAdding(false); setEditingCourse(null); }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {courses.map(course => (
          <div key={course.id} className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-300">{course.title}</h3>
                <p className="text-gray-400 mt-1">{course.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span className="mr-4"><strong>Topics:</strong> {course.topics}</span>
                  <span><strong>Intern Role:</strong> {course.internRole}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(course)}
                  className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-1 rounded transition text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this course?")) {
                      await deleteCourse(course.id);
                    }
                  }}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/40 px-3 py-1 rounded transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-800 pb-1">
                Enrolled Students ({course.enrollments.length})
              </h4>
              {course.enrollments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-800">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Email</th>
                        <th className="pb-2 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {course.enrollments.map((enrollment: any) => (
                        <tr key={enrollment.id} className="hover:bg-gray-800/30">
                          <td className="py-2 text-gray-300">{enrollment.user.title} {enrollment.user.name}</td>
                          <td className="py-2 text-gray-400">{enrollment.user.email}</td>
                          <td className="py-2 text-right">
                            <button
                              onClick={async () => {
                                if (confirm("Remove student from this course?")) {
                                  await removeEnrollment(enrollment.id);
                                }
                              }}
                              className="text-xs bg-red-900/30 text-red-400 hover:bg-red-900/60 px-2 py-1 rounded transition"
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
          </div>
        ))}
      </div>
    </div>
  );
}
