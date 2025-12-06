import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRFP = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Please enter RFP description");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rfp/create-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      setResponse(data);

      if (data.success) {
        navigate("/rfps");
      } else {
        alert(data.message || "Failed to create RFP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create RFP</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">
            Describe your requirement
          </label>

          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-3"
            placeholder="e.g. We need road surveillance cameras installed on 10 highways with 24x7 monitoring..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Generating RFP..." : "Generate & Create RFP"}
        </button>
      </form>

      {response && (
        <pre className="mt-4 text-xs bg-gray-100 p-3 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CreateRFP;
