import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function ResponseCard({
  response,
  onCopy,
  onLike,
  onSave,
  onRegen,
  onTagChange,
}) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-4 text-white">
      {/* Render Markdown Safely */}
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {response.text}
        </ReactMarkdown>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-3">
        <button
          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
          onClick={() => onCopy(response.text)}
        >
          Copy
        </button>
        <button
          className={`px-3 py-1 rounded ${
            response.liked
              ? "bg-pink-600 hover:bg-pink-500"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => onLike(response.id)}
        >
          ❤️ {response.liked ? "Liked" : "Like"}
        </button>
        <button
          className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          onClick={() => onSave(response.id)}
        >
          💾 Save
        </button>
        <button
          className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-500"
          onClick={() => onRegen(response.id)}
        >
          🔄 Regen
        </button>

        {/* Tag Dropdown */}
        <select
          className="bg-gray-700 text-white px-2 py-1 rounded"
          value={response.tag}
          onChange={(e) => onTagChange(response.id, e.target.value)}
        >
          <option value="">Tag</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Fun">Fun</option>
        </select>
      </div>
    </div>
  );
}
