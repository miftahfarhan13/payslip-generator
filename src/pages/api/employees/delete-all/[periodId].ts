import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// Next.js configuration to disable body parsing for form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// The API route handler in TypeScript
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
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

    // Use for...of to handle async deletion of users and their files
    for (const user of users) {
      // Remove the user's file from the directory if fileUrl exists
      if (user?.fileUrl) {
        const filePath = path.resolve(`public/${user?.fileUrl}`);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${user.fileUrl}`, err);
          } else {
            console.log(`File deleted: ${user.fileUrl}`);
          }
        });
      }

      // Delete user record from the database
      await prisma.user.delete({
        where: { id: user?.id },
      });
    }

    res
      .status(200)
      .json({ message: "Users and files deleted successfully", users });
  } catch (error) {
    console.error("Error deleting users or files:", error);
    res.status(500).json({ message: "Failed to delete users or files" });
  }
}
