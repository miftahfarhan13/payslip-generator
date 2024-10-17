import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, date } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    try {
      // Create a new period
      const newPeriod = await prisma.period.create({
        data: {
          name,
          date: new Date(date).toISOString(),
        },
      });

      res.status(201).json(newPeriod);
    } catch (error) {
      console.error("Error creating period:", error);
      res.status(500).json({ message: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
