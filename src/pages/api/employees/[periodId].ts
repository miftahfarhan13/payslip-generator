import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { periodId } = req.query;

    // Check if periodId exists and is a valid string
    if (!periodId || typeof periodId !== "string") {
      return res.status(400).json({ message: "Invalid or missing periodId" });
    }

    // Find all users for the specified periodId
    const users = await prisma.user.findMany({
      where: {
        periodId, // periodId remains a string
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
