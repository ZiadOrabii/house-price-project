import { useState } from "react";
import { useNavigate } from "react-router-dom";
import locations from "../locations.json";
import { predictPrice } from "../api/predictionClient";
import {
  FURNISHING_OPTIONS,
  TRANSACTION_OPTIONS,
  OWNERSHIP_OPTIONS,
  FACING_OPTIONS,
  type PredictionRequest,
} from "../types/prediction";

const locationList = locations as string[];

export default function PredictionForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PredictionRequest>({
    location: locationList[0] ?? "other",
    carpet_area_sqft: 0,
    floor_num: 0,
    bathroom: 0,
    balcony: 0,
    furnishing: FURNISHING_OPTIONS[0],
    transaction: TRANSACTION_OPTIONS[0],
    ownership: OWNERSHIP_OPTIONS[0],
    facing: FACING_OPTIONS[0],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.location) return "Location is required.";
    if (form.carpet_area_sqft <= 0) return "Carpet area must be greater than 0.";
    if (form.bathroom < 0 || form.balcony < 0) return "Bathroom/balcony cannot be negative.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await predictPrice(form);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Location
        <select value={form.location} onChange={(e) => update("location", e.target.value)}>
          {locationList.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </label>

      <label>
        Carpet Area (sqft)
        <input
          type="number"
          value={form.carpet_area_sqft}
          onChange={(e) => update("carpet_area_sqft", Number(e.target.value))}
        />
      </label>

      <label>
        Floor
        <input
          type="number"
          value={form.floor_num}
          onChange={(e) => update("floor_num", Number(e.target.value))}
        />
      </label>

      <label>
        Bathrooms
        <input
          type="number"
          value={form.bathroom}
          onChange={(e) => update("bathroom", Number(e.target.value))}
        />
      </label>

      <label>
        Balconies
        <input
          type="number"
          value={form.balcony}
          onChange={(e) => update("balcony", Number(e.target.value))}
        />
      </label>

      <label>
        Furnishing
        <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
          {FURNISHING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>

      <label>
        Transaction
        <select value={form.transaction} onChange={(e) => update("transaction", e.target.value)}>
          {TRANSACTION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>

      <label>
        Ownership
        <select value={form.ownership} onChange={(e) => update("ownership", e.target.value)}>
          {OWNERSHIP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>

      <label>
        Facing
        <select value={form.facing} onChange={(e) => update("facing", e.target.value)}>
          {FACING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Predicting..." : "Predict Price"}
      </button>
    </form>
  );
}