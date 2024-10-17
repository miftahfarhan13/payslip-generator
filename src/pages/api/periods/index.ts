import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Find all periods and include the count of related users
    const periods = await prisma.period.findMany({
      include: {
        _count: {
          select: {
            users: true, // Count the number of users for each period
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(periods);
  } catch (error) {
    console.error("Error fetching periods:", error);
    res.status(500).json({ message: "Failed to fetch periods" });
  }
}
