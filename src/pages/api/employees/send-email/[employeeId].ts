import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/utils/email";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { employeeId } = req.query;

    // Check if employeeId exists and is a valid string
    if (!employeeId || typeof employeeId !== "string") {
      return res.status(400).json({ message: "Invalid or missing employeeId" });
    }

    // Find the user by employeeId
    const user = await prisma.user.findFirst({
      include: { period: true },
      where: {
        id: employeeId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the fileUrl is present, download the file
    let attachments: any = [];
    if (user.fileUrl) {
      const response = await axios.get(
        `http://localhost:3000/${user.fileUrl}`,
        {
          responseType: "arraybuffer", // important to get the file data as a buffer
        }
      );

      // Create the attachment object
      attachments = [
        {
          filename: `${user?.name}.pdf`, // Use the actual file name if available
          content: Buffer.from(response.data, "binary"), // Attach the file as a binary buffer
          contentType: response.headers["content-type"], // Set the appropriate MIME type
        },
      ];
    }

    // Send email with attachment
    await sendEmail(
      user?.email || "",
      `Payslip Dibimbing ${user?.period?.name}`,
      "",
      "Muliany Aprilianty",
      attachments
    );

    const newUser = await prisma.user.update({
      where: {
        id: employeeId,
      },
      data: {
        isSendEmail: true,
      },
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error fetching user or sending email:", error);
    res.status(500).json({ message: "Failed to fetch user or send email" });
  }
}
