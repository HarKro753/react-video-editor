import { nanoid } from "nanoid";

export function generateId(length: number = 16): string {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Allowed letters

  const firstChar = letters.charAt(Math.floor(Math.random() * letters.length));

  let restOfId = nanoid(length - 1);

  restOfId = restOfId.replace(/[^a-zA-Z0-9]/g, "").slice(0, length - 1); // Adjust length if necessary

  return firstChar + restOfId; // Concatenate the first character with the rest
}
