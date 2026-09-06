import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function predictPrice(payload: PredictionRequest): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ? JSON.stringify(body.detail) : `Request failed: ${res.status}`);
  }

  return res.json();
}