// src/api/index.ts
const API_URL = import.meta.env.VITE_API_URL;


export async function getHello(): Promise<string> {
  const response = await fetch(`${API_URL}/api/hello`);
  if (!response.ok) {
    throw new Error("Failed to fetch from backend");
  }
  const data = await response.json();
  return data.message;
}
