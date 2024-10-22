import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
// import { type } from 'os'

export function sleep(ms: number): any {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export type BatchEmailData = {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Mail.Attachment[];
};

export type BatchEmailDataResponse = {
  email: string;
  messageId: string;
  response: string;
};

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  from: string,
  attachments?: Mail.Attachment[]
): Promise<any> {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // const testAccount = await nodemailer.createTestAccount()
  // console.log('testAccount', testAccount)

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMPT_HOST,
    port: parseInt(process.env.EMAIL_SMPT_PORT as string),
    secure: process.env.EMAIL_SMPT_PORT === "465" ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
    from: process.env.EMAIL_USER,
  });

  // send mail with defined transport object
  const info = await transporter
    .sendMail({
      from: `"${from}" <${process.env.EMAIL_USER}>`, // sender address
      to: to, // list of receivers
      subject, // Subject line
      html, // html body
      attachments,
    })
    .catch((error: any) => console.log("sendEmail-error::", error));

  console.log("Message sent: %s", to, info?.messageId);
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
