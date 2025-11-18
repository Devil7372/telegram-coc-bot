import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = "https://api.clashofclans.com/v1";
const KEY = process.env.COC_API_KEY;

if (!KEY) throw new Error("COC_API_KEY missing in .env");

export async function getPlayer(tag: string) {
  try {
    const encoded = encodeURIComponent(tag);

    const res = await axios.get(`${BASE}/players/${encoded}`, {
      headers: {
        Authorization: `Bearer ${KEY}`,
      },
    });

    return res.data;
  } catch (err: any) {
    if (err.response) {
      return {
        error: err.response.status,
        message: err.response.data?.reason || "API error",
      };
    }
    return { error: "network", message: err.message };
  }
}
