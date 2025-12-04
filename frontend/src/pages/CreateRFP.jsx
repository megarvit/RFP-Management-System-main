import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRFP = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [delivery, setDelivery] = useState("");
  const [createdBy, setCreatedBy] = useState(1); // default user id
  const [response, setResponse] = useState(null);

  const navigate = useNavigate(); //  useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      title,
      description,
      budget: budget ? Number(budget) : 0,
      delivery: delivery || null,
      created_by: createdBy
    };

    try {
      const res = await fetch("http://localhost:5000/api/rfp/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResponse(data);
      console.log(data);

      if (data.success) {
        //  redirect to RFP list page
        navigate("/rfps");
      }
    } catch (err) {
      console.error("Error creating RFP:", err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create RFP</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Delivery</label>
          <input
            type="text"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Created By (User ID)</label>
          <input
            type="number"
            value={createdBy}
            onChange={(e) => setCreatedBy(Number(e.target.value))}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create RFP
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateRFP;
