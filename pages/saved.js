import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Saved() {
  const [savedResponses, setSavedResponses] = useState([]);

  // ✅ Load saved responses from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedResponses") || "[]");
    setSavedResponses(stored);
  }, []);

  // ✅ Delete a saved response
  const handleDelete = (id) => {
    const updated = savedResponses.filter((r) => r.id !== id);
    setSavedResponses(updated);
    localStorage.setItem("savedResponses", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-6">
          📌 Saved Responses
        </h1>

        {savedResponses.length === 0 ? (
          <p className="text-gray-400">No saved responses yet.</p>
        ) : (
          <div className="space-y-4">
            {savedResponses.map((response) => (
              <div
                key={response.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {response.text}
                  </ReactMarkdown>
                </div>
                {response.tag && (
                  <p className="text-sm text-gray-400 mt-2">
                    🏷 Tag: {response.tag}
                  </p>
                )}

                <button
                  onClick={() => handleDelete(response.id)}
                  className="mt-3 bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                >
                  ❌ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
