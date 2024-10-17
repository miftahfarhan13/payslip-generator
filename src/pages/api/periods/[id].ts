import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    // Find period by id
    const period = await prisma.period.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!period) {
      return res.status(404).json({ message: "Period not found" });
    }

    res.status(200).json(period);
  } catch (error) {
    console.error("Error fetching period:", error);
    res.status(500).json({ message: "Failed to fetch period" });
  }
}
