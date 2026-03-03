import jwt from "jsonwebtoken";
import process from "process";
import { User } from "../types.js";

function resolveJwtSecret(): string {
    const value = process.env.JWT_SECRET;

    if (!value || value.trim() === "") {
        throw new Error("Missing required environment variable: JWT_SECRET");
    }

    return value;
}

const jwtSecret = resolveJwtSecret();

function extractUserFromJWT(request: any): User | null {
  const cookieHeader = request.headers["cookie"] as string | undefined;
  let cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length === 2) {
        cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
      }
    });
  }
  const accessToken = cookies["access_token"];
  if (accessToken && jwtSecret) {
    try {
      const decoded = jwt.verify(accessToken, jwtSecret) as any;
      if (decoded.username && decoded.id) {
        return { username: decoded.username, id: String(decoded.id) };
      }
    } catch (err) {
      console.error("Invalid JWT:", err);
      return null;
    }
  }
  return null;
}

export default extractUserFromJWT;
