"use client";

import { useState, useEffect } from "react";
import { getUserDetails } from "./actions"; // We'll write this action

export default function UserDetailsModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="text-white">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl border border-gray-700">
          <p className="text-white mb-4">User not found.</p>
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-3xl border border-gray-700 shadow-2xl my-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          &times; Close
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
          {user.title} {user.name}'s Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Contact Info</h3>
              <p className="text-gray-300">{user.email}</p>
              <p className="text-gray-400 text-sm">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Enrolled Courses</h3>
              {user.courseEnrollments.length > 0 ? (
                <ul className="list-disc list-inside text-indigo-300">
                  {user.courseEnrollments.map((ce: any) => (
                    <li key={ce.id}>
                      {ce.course.title}
                      {ce.completedAt && <span className="text-emerald-400 text-xs ml-2">(Completed)</span>}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500 text-sm">None</p>}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Enrolled Internships</h3>
              {user.internshipEnrollments.length > 0 ? (
                <ul className="list-disc list-inside text-emerald-300">
                  {user.internshipEnrollments.map((ie: any) => (
                    <li key={ie.id}>{ie.internship.title}</li>
                  ))}
                </ul>
              ) : <p className="text-gray-500 text-sm">None</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Certificates Earned</h3>
              {user.certificates.length > 0 ? (
                <ul className="space-y-2">
                  {user.certificates.map((c: any) => (
                    <li key={c.id} className="bg-gray-800 p-2 rounded text-sm text-gray-300">
                      {c.course?.title || c.internship?.title}
                      <span className="block text-xs text-indigo-400">{c.credentialId}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500 text-sm">No certificates yet.</p>}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Lesson Progress</h3>
              {user.lessonProgress.length > 0 ? (
                <p className="text-emerald-400 text-sm">Completed {user.lessonProgress.length} lessons.</p>
              ) : <p className="text-gray-500 text-sm">No lessons completed.</p>}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Recent Login History</h3>
          <div className="bg-gray-800 rounded p-4 max-h-40 overflow-y-auto custom-scrollbar">
            {user.loginLogs.length > 0 ? (
              <ul className="space-y-1 text-sm text-gray-400">
                {user.loginLogs.map((log: any) => (
                  <li key={log.id} className="flex justify-between border-b border-gray-700/50 pb-1">
                    <span>{new Date(log.loginAt).toLocaleString()}</span>
                    <span>{log.ipAddress || 'Unknown IP'}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500 text-sm">No login logs found.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
