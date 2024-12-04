import path from "path";
import { promises as fs } from "fs";
import formidable, { File, Fields } from "formidable";
import * as XLSX from "xlsx";
import puppeteer from "puppeteer";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

// Next.js configuration to disable body parsing for form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define types for the parsed files and fields
interface FormidableFiles {
  file: File;
}

function replaceSpaceAndLowercase(str: string) {
  return str?.replace(/\s+/g, "_").toLowerCase();
}

function getEmailTemplate({
  periodName,
  row,
  companyType,
}: {
  periodName: string;
  row: any;
  companyType: string;
}) {
  const formatter = new Intl.NumberFormat("id");
  const baseStyle = `
    <style>
      @media print{@page {size: landscape}}
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        text-align: center;
        font-size: 24px;
        margin-bottom: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td,
      th {
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 8px;
        padding-right: 8px;
        text-align: left;
        width: 25%;
      }
      .section-title {
        font-weight: bold;
        text-align: left;
        margin: 10px;
      }
      .totals {
        font-weight: bold;
      }
      .benefit-note {
        font-size: 10px;
        color: #333;
      }
      .confidential {
        font-size: 10px;
        color: #333;
        margin-top: 20px;
      }
      .no-border {
        border: none;
      }
      .right-align {
        text-align: right;
      }
      .highlight {
        background-color: #f0f0f0;
      }
      .grid-container {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: start;
      }
      .flex-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .relative {
        position: relative;
      }
      .absolute {
        position: absolute;
        top: 20px;
        right: 20px;
        font-weight: 700;
        color: red;
      }
      .flex-column-body{
        display: flex;
        flex-direction: column;
      }
      .mb-5{
        margin-bottom: 20px;
      }
    </style>`;

  let logoCompany = "";
  if (companyType === "Dibimbing") {
    logoCompany = `
      <div class="flex-column">
        <img src="http://localhost:3000/logo-dibimbing.png" width="200" />
        <strong>PT. Dibimbing Digital Indonesia</strong>
      </div>
    `;
  } else if (companyType === "Dibilabs") {
    logoCompany = `
      <div class="flex-column">
        <img src="http://localhost:3000/logo-dibilabs.png" width="200" />
        <strong>PT. Dibilabs Agensi Indonesia</strong>
      </div>
    `;
  } else if (companyType === "Cakrawala") {
    logoCompany = `
      <div class="flex-column">
        <img src="http://localhost:3000/logo-cakrawala.png" width="200" />
        <strong>Yayasan Dibimbing Digital Indonesia</strong>
      </div>
    `;
  }

  return `
    <html lang="en">
      <head>
        ${baseStyle}
      </head>
      <body>
        <div class="container relative">
          <div class="absolute">*CONFIDENTIAL</div>
          <table class="no-border mb-5">
            <tr>
              <td>
                ${logoCompany}
              </td>
              <td>
                <strong style="font-size: 20px; color: #0BB1CB">PAYSLIP</strong>
              </td>
            </tr>
            <tr>
              <td>Month: <span class="highlight">${periodName}</span></td>
              <td>Role: <span class="highlight">${row?.job_title}</span></td>
            </tr>
            <tr>
              <td>ID / Name: <span class="highlight">${
                row?.employee_name
              }</span></td>
              ${
                row?.tax_id
                  ? `<td>NPWP: <span class="highlight">${row?.tax_id}</span></td>`
                  : ""
              }
            </tr>
            ${
              row?.departement
                ? `<tr>
                    <td>Organization: <span class="highlight">${row?.departement}</span></td>
                    <td>PTKP: <span class="highlight">${row?.ptkp}</span></td>
                  </tr>`
                : ""
            }
          </table>
          
          <div class="flex-column-body mb-5">
            <table>
              <tr>
                <th>Income</th>
                <th></th>
                <th>Deduction</th>
                <th></th>
              </tr>
            </table>
            <div class="grid-container">
              <table>
                ${
                  row?.gaji_pokok
                    ? `<tr>
                        <td>Basic Salary</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.gaji_pokok
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_tetap
                    ? `<tr>
                        <td>Fix Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_tetap
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_jabatan
                    ? `<tr>
                        <td>Positional Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_jabatan
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_internet
                    ? `<tr>
                        <td>Internet Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_internet
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_fasilitas
                    ? `<tr>
                        <td>Facility Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_fasilitas
                        )}</td>
                      </tr>`
                    : ""
                } 
                ${
                  row?.tunjangan_hybrid
                    ? `<tr>
                        <td>Hybrid Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_hybrid
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_wellbeing
                    ? `<tr>
                        <td>Wellbeing Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_wellbeing
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_mentor
                    ? `<tr>
                        <td>Mentor Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_mentor
                        )}</td>
                      </tr>`
                    : ""
                }
                
                ${
                  row?.tunjangan_jabatan_lppm
                    ? `<tr>
                        <td>LPPM Positional Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_jabatan_lppm
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_jabatan_lpm
                    ? `<tr>
                        <td>LPM Positional Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_jabatan_lpm
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_kepala_program_studi
                    ? `<tr>
                        <td>Head Study Program Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_kepala_program_studi
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_layanan
                    ? `<tr>
                        <td>Service Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_layanan
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_akomodasi
                    ? `<tr>
                        <td>Accomodation Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_akomodasi
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_over_sks
                    ? `<tr>
                        <td>Over SKS Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_over_sks
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_acara
                    ? `<tr>
                        <td>Event Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_acara
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_video_learning
                    ? `<tr>
                        <td>Video Learning Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_video_learning
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_sertifikasi
                    ? `<tr>
                        <td>Certification Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_sertifikasi
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_maternity
                    ? `<tr>
                        <td>Maternity Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_maternity
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.tunjangan_lainnya
                    ? `<tr>
                        <td>Other Allowance</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.tunjangan_lainnya
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bonus
                    ? `<tr>
                        <td>Bonus</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bonus
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.overtime
                    ? `<tr>
                        <td>Overtime</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.overtime
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.thr
                    ? `<tr>
                        <td>Tunjangan Hari Raya</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.thr
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bonus_akhir_tahun
                    ? `<tr>
                        <td>Bonus Akhir Tahun</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bonus_akhir_tahun
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bpjs_jkk_perusahaan
                    ? `<tr>
                        <td style="width: 30%;">BPJS Jaminan Kecelakaan Kerja</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bpjs_jkk_perusahaan
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bpjs_jkm_perusahaan
                    ? `<tr>
                        <td>BPJS Jaminan Kematian</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bpjs_jkm_perusahaan
                        )}</td>
                      </tr>`
                    : ""
                }
              </table>

              <table>
                ${
                  row?.pph21
                    ? `<tr>
                        <td>Pph21</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.pph21
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bpjs_kesehatan_karyawan
                    ? `<tr>
                        <td>BPJS Kesehatan</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bpjs_kesehatan_karyawan
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bpjs_jp_karyawan
                    ? `<tr>
                        <td>BPJS Jaminan Pensiun</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bpjs_jp_karyawan
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bpjs_jht_karyawan
                    ? `<tr>
                        <td>BPJS Jaminan Hari Tua</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bpjs_jht_karyawan
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bpjs_jkk_perusahaan
                    ? `<tr>
                        <td style="width: 30%;">BPJS Jaminan Kecelakaan Kerja</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bpjs_jkk_perusahaan
                        )}</td>
                      </tr>`
                    : ""
                }
                ${
                  row?.bpjs_jkm_perusahaan
                    ? `<tr>
                        <td>BPJS Jaminan Kematian</td>
                        <td class="right-align">Rp ${formatter.format(
                          row?.bpjs_jkm_perusahaan
                        )}</td>
                      </tr>`
                    : ""
                }
              </table>
            </div>
            <table style="margin-top: 20px;">
              <tr class="totals">
                <td>Total Income</td>
                <td class="right-align">Rp ${formatter.format(
                  row?.total_income
                )}</td>
                <td>Total Deduction</td>
                <td class="right-align">Rp ${formatter.format(
                  row?.total_deduction
                )}</td>
              </tr>
              <tr class="totals">
                <td></td>
                <td></td>
                <td>Take Home Pay</td>
                <td class="right-align">Rp ${formatter.format(row?.thp)}</td>
              </tr>
            </table>
          </div>
          ${
            row?.total_benefit
              ? `<table class="mb-5">
                  <tr>
                    <th>Benefit</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  ${
                    row?.bpjs_kesehatan_perusahaan
                      ? `<tr>
                          <td>BPJS Kesehatan</td>
                          <td class="right-align">Rp ${formatter.format(
                            row?.bpjs_kesehatan_perusahaan
                          )}</td>
                          <td></td>
                          <td></td>
                        </tr>`
                      : ""
                  }
                  ${
                    row?.bpjs_jht_perusahaan
                      ? `<tr>
                          <td>BPJS Jaminan Hari Tua</td>
                          <td class="right-align">Rp ${formatter.format(
                            row?.bpjs_jht_perusahaan
                          )}</td>
                          <td></td>
                          <td></td>
                        </tr>`
                      : ""
                  }
                  ${
                    row?.bpjs_jp_perusahaan
                      ? `<tr>
                          <td>BPJS Jaminan Pensiun</td>
                          <td class="right-align">Rp ${formatter.format(
                            row?.bpjs_jp_perusahaan
                          )}</td>
                          <td></td>
                          <td></td>
                        </tr>`
                      : ""
                  }
                  
                  <tr class="totals">
                    <td>Total Benefit</td>
                    <td class="right-align">Rp ${formatter.format(
                      row?.total_benefit
                    )}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>`
              : ""
          }
          

          <p class="benefit-note">
            *These are the benefits you'll get from the company, but not included in
            your take-home pay (THP).
          </p>

          <p class="confidential">
            PLEASE NOTE THAT THE CONTENTS OF THIS STATEMENT SHOULD BE TREATED WITH
            ABSOLUTE CONFIDENTIALITY EXCEPT TO THE EXTENT YOU ARE REQUIRED TO MAKE
            DISCLOSURE FOR ANY TAX, LEGAL, OR REGULATORY PURPOSES. ANY BREACH OF
            THIS CONFIDENTIALITY OBLIGATION WILL BE DEALT WITH SERIOUSLY, WHICH MAY
            INVOLVE DISCIPLINARY ACTION BEING TAKEN.
          </p>
        </div>
      </body>
    </html>
  `;
}

// The API route handler in TypeScript
// The API route handler in TypeScript
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Step 1: Initialize formidable with updated API
  const form = formidable({ multiples: true });

  // Parse the incoming form data
  // @ts-ignore
  form.parse(req, async (err, fields: Fields, files: FormidableFiles) => {
    if (err) {
      console.error("Error during form parsing:", err);
      return res.status(500).json({ error: "Failed to upload file" });
    }
    // Step 2: Check if the file exists and has a valid path
    // @ts-ignore
    const filePath = files?.file[0]?.filepath;
    if (!filePath) {
      console.error(
        "Filepath is undefined. The uploaded file might be missing."
      );
      return res.status(400).json({ error: "File upload failed" });
    }

    try {
      // Step 3: Read the Excel file from the uploaded files
      const fileBuffer = await fs.readFile(filePath);

      const { periodId, periodName, companyType } = fields;

      // Parse the Excel file
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const rawSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Clean the keys by trimming spaces
      const sheetData = rawSheetData.map((row: any) =>
        Object.keys(row).reduce((cleanedRow: any, key: string) => {
          const trimmedKey = key.trim();
          cleanedRow[trimmedKey] = row[key];
          return cleanedRow;
        }, {})
      );

      // Step 4: Set up the output directory for the PDFs
      const publicPath = path.join(
        process.cwd(),
        `public/generated/${companyType}/${periodName ? periodName[0] : ""}`
      );
      await fs.mkdir(publicPath, { recursive: true });

      // Launch Puppeteer for PDF generation
      const browser = await puppeteer.launch();

      // Step 5: Loop through each row and generate the HTML content
      for (let i = 0; i < sheetData.length; i++) {
        const row: any = sheetData[i];
        // Dynamically create the HTML content for each row

        const htmlContent = getEmailTemplate({
          periodName: periodName ? periodName[0] : "",
          row,
          companyType: companyType ? companyType[0] : "",
        });

        // Step 6: Generate a PDF from the HTML content
        const page = await browser.newPage();
        await page.setContent(htmlContent || "", { waitUntil: "load" });
        // Define the output path for the PDF

        const generatedFileName = replaceSpaceAndLowercase(
          `${periodName ? periodName[0] : ""}_${row?.employee_name}.pdf`
        );
        const pdfPath = path.join(publicPath, generatedFileName);
        await page.pdf({
          path: pdfPath,
          format: "A4",
        });

        // Close the Puppeteer page after PDF generation
        await page.close();

        await prisma.user.create({
          data: {
            name: row?.employee_name,
            email: row?.email,
            companyType: companyType ? companyType[0] : "",
            isSendEmail: false,
            fileUrl: `generated/${companyType}/${
              periodName ? periodName[0] : ""
            }/${generatedFileName}`,
            periodId: periodId ? periodId[0] : "",
          },
        });
      }

      // Step 7: Close the Puppeteer browser
      await browser.close();

      // Respond to indicate success
      return res
        .status(200)
        .json({ message: "PDFs generated and saved successfully" });
    } catch (error) {
      console.error("Error during PDF generation:", error);
      return res
        .status(500)
        .json({ error: "An error occurred during PDF generation" });
    }
  });
}
