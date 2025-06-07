import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { AzureOpenAI } from "openai";
import * as fs from "fs/promises";
import * as fss from "fs";
import * as path from "path";
import * as https from "https";
import * as os from "os";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Add stealth plugin to avoid detection
chromium.use(StealthPlugin());

interface FormField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: {
    title: string;
    company: string;
    duration: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  summary?: string;
}

class Logger {
  static log(message: string, level: "info" | "warn" | "error" = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.log(logMessage);
  }
}

async function downloadResume(
  resumeUrl: string,
  tempDir: string
): Promise<string> {
  Logger.log(`Starting resume download from: ${resumeUrl}`);
  const parsedUrl = new URL(resumeUrl);
  const ext = path.extname(parsedUrl.pathname) || ".pdf";
  const resumePath = path.join(tempDir, `resume_${Date.now()}${ext}`);
  const file = fss.createWriteStream(resumePath);

  return new Promise((resolve, reject) => {
    const request = https.get(resumeUrl, (response) => {
      if (response.statusCode !== 200) {
        Logger.log(
          `Failed to download resume: HTTP ${response.statusCode}`,
          "error"
        );
        fs.unlink(resumePath).catch(() => {});
        return reject(new Error(`HTTP ${response.statusCode}`));
      }

      Logger.log(`Downloading resume (status: ${response.statusCode})`);
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        Logger.log(`Resume downloaded successfully to: ${resumePath}`);
        resolve(resumePath);
      });
    });

    request.on("error", (err) => {
      Logger.log(`Failed to download resume: ${err.message}`, "error");
      fs.unlink(resumePath).catch(() => {});
      reject(err);
    });

    request.setTimeout(30000, () => {
      Logger.log("Resume download timed out", "error");
      request.destroy(new Error("Download timeout"));
    });
  });
}

async function exportResumeAsPdf(
  resumeUrl: string,
  tempDir: string
): Promise<string> {
  Logger.log(`Exporting resume as PDF from: ${resumeUrl}`);
  const browser = await chromium.launch({ headless: true }); // Changed to headless for reliability
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(resumeUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait longer and more flexibly for the resume to load
    await page.waitForFunction(
      () => {
        return (
          document.body.innerText.length > 100 || // At least some content
          document.querySelector(
            ".resume-container, .resume, #resume, main, article, section"
          ) !== null
        );
      },
      { timeout: 30000 }
    );

    const resumePath = path.join(tempDir, `resume_${Date.now()}.pdf`);

    await page.pdf({
      path: resumePath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    Logger.log(`Resume exported as PDF to: ${resumePath}`);
    return resumePath;
  } catch (error) {
    Logger.log(
      `PDF export failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      "warn"
    );
    // Fallback to screenshot if PDF fails
    const screenshotPath = path.join(tempDir, `resume_${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  } finally {
    await browser.close();
  }
}

async function extractTextFromPdf(pdfPath: string): Promise<string> {
  Logger.log(`Extracting text from PDF: ${pdfPath}`);
  try {
    const buffer = await fs.readFile(pdfPath);

    // Quick check for PDF header
    if (buffer.slice(0, 4).toString() !== "%PDF") {
      throw new Error("File is not a valid PDF (missing %PDF header)");
    }

    const data = await pdf(buffer);
    if (!data.text || !data.text.trim()) {
      throw new Error("No extractable text found in PDF");
    }
    return data.text;
  } catch (err: any) {
    Logger.log(`PDF extraction failed: ${err.message}`, "error");
    throw new Error("Invalid PDF structure");
  }
}

async function extractResumeData(resumePath: string): Promise<ResumeData> {
  Logger.log(`Extracting structured data from resume: ${resumePath}`);

  try {
    // First try direct PDF extraction
    try {
      const text = await extractTextFromPdf(resumePath);
      return parseResumeText(text);
    } catch (pdfError) {
      Logger.log(
        `Direct PDF extraction failed, trying alternative methods: ${
          pdfError instanceof Error ? pdfError.message : String(pdfError)
        }`,
        "warn"
      );

      // If PDF extraction fails, try reading as text file
      const text = await fs.readFile(resumePath, "utf-8");
      return parseResumeText(text);
    }
  } catch (error) {
    Logger.log(
      `Failed to extract resume data: ${
        error instanceof Error ? error.message : String(error)
      }`,
      "error"
    );
    throw error;
  }
}

function parseResumeText(text: string): ResumeData {
  Logger.log(`Parsing resume text (${text.length} characters)`);

  // Enhanced parsing with better regex patterns
  const emailMatch = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  );
  const phoneMatch = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  );
  const nameMatch = text.match(
    /(?:^|\n)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*(?:\n|$)/m
  );

  // Extract sections with more robust patterns
  const skillsSection = text.match(
    /(?:SKILLS|TECHNICAL SKILLS):?([\s\S]*?)(?:\n\n|$)/i
  );
  const experienceSection = text.match(
    /(?:EXPERIENCE|WORK HISTORY):?([\s\S]*?)(?:EDUCATION|$)/i
  );
  const educationSection = text.match(
    /(?:EDUCATION|ACADEMIC BACKGROUND):?([\s\S]*?)(?:SKILLS|$)/i
  );
  const summarySection = text.match(
    /(?:SUMMARY|PROFILE):?([\s\S]*?)(?:EXPERIENCE|$)/i
  );

  const resumeData: ResumeData = {
    name: nameMatch?.[1]?.trim(),
    email: emailMatch?.[0],
    phone: phoneMatch?.[0],
    skills:
      skillsSection?.[1]
        ?.split(/[,•\-•]/)
        .map((s) => s.trim())
        .filter(Boolean) || [],
    experience:
      experienceSection?.[1]
        ?.split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
          const [title, company, duration] = line
            .split(/[,•]/)
            .map((s) => s.trim());
          return { title, company, duration };
        })
        .filter((exp) => exp.title && exp.company) || [],
    education:
      educationSection?.[1]
        ?.split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
          const [degree, institution, year] = line
            .split(/[,•]/)
            .map((s) => s.trim());
          return { degree, institution, year };
        })
        .filter((edu) => edu.degree && edu.institution) || [],
    summary: summarySection?.[1]?.trim(),
  };

  Logger.log(`Structured resume data extracted: ${JSON.stringify(resumeData)}`);
  return resumeData;
}

async function getResumePdf(
  resumeUrl: string,
  tempDir: string
): Promise<string> {
  try {
    // First try direct download
    const downloadedPath = await downloadResume(resumeUrl, tempDir);
    const buffer = await fs.readFile(downloadedPath);

    // Verify it's a PDF
    if (buffer.slice(0, 4).toString() === "%PDF") {
      return downloadedPath;
    }

    // If not a PDF, try exporting via browser
    return await exportResumeAsPdf(resumeUrl, tempDir);
  } catch (error) {
    Logger.log(
      `Failed to get resume PDF: ${
        error instanceof Error ? error.message : String(error)
      }`,
      "error"
    );
    throw error;
  }
}

async function scrapeFormFields(page: any): Promise<FormField[]> {
  Logger.log("Scraping form fields from page");

  return await page.evaluate(() => {
    const fields: FormField[] = [];
    const formElements = Array.from(
      document.querySelectorAll("form input, form textarea, form select")
    );

    formElements.forEach((element: any) => {
      if (
        element.type === "hidden" ||
        element.type === "submit" ||
        element.type === "button"
      ) {
        return;
      }

      const labelElement =
        element.labels?.[0] ||
        document.querySelector(`label[for="${element.id}"]`) ||
        element.closest("label");

      let options: string[] = [];
      if (element.tagName.toLowerCase() === "select") {
        options = Array.from(element.options)
          .map((opt: any) => opt.textContent.trim())
          .filter((text: string) => text.length > 0);
      }

      fields.push({
        id: element.id || "",
        name: element.name || "",
        type: element.type || element.tagName.toLowerCase(),
        label:
          labelElement?.textContent?.trim() ||
          element.getAttribute("aria-label") ||
          "",
        placeholder: element.placeholder || "",
        required: element.required || false,
        options: options.length > 0 ? options : undefined,
      });
    });

    return fields;
  });
}

async function processWithAzureOpenAI(
  formFields: FormField[],
  resumeData: ResumeData
): Promise<Record<string, string>> {
  Logger.log("Processing form with Azure OpenAI");

  const client = new AzureOpenAI({
    endpoint:
      "https://preplink-dev-ai.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview",
    apiKey:
      "Ci0pqQQMMtlPHxBqxpz8jDhK3UxTrzf1fTInUnzlpvNfbDt7axR6JQQJ99BDACYeBjFXJ3w3AAABACOGiLUt",
    deployment: "gpt-4o",
    apiVersion: "2025-01-01-preview",
  });

  const prompt = `
You are an expert job application assistant with 10+ years of HR experience. Your task is to COMPLETELY fill out a job application form using the candidate's resume as the PRIMARY source, while making intelligent, human-like decisions for any missing information.

Resume Information:
${JSON.stringify(resumeData, null, 2)}

Form Fields to Fill:
${JSON.stringify(formFields, null, 2)}

STRICT INSTRUCTIONS:
1. PRIMARY SOURCE: Always use resume data first when available
2. COMPLETE ALL FIELDS: You MUST provide a realistic, plausible value for every field
3. NEVER USE "UNAVAILABLE": Generate reasonable values for all fields except URLs
4. URL FIELDS: Only leave URL fields blank if not in resume
5. INTELLIGENT INFERENCE: For missing resume data:
   - Names: Use standard Western naming conventions if needed
   - Dates: Calculate reasonable timeframes if exact dates missing
   - Skills: Infer from job titles/descriptions when not explicitly listed
   - Organizations: Use plausible company names if missing
6. PROFESSIONAL TONE: All responses should sound human-written and natural
7. FORMATTING:
   - Phone: (XXX) XXX-XXXX
   - Dates: MM/YYYY or "Present" for current positions
   - Names: Title Case
8. SPECIAL FIELDS:
   - Salary: Provide realistic market rates for the position/experience
   - Availability: "Immediately" or "2 weeks notice" standard
   - References: "Available upon request" standard
   - EEO: Use "Decline to self-identify" when appropriate
9. FILE UPLOADS: Use "resume.pdf" for resume/CV fields

DECISION MAKING FRAMEWORK:
1. Is this field in the resume? → Use exact match
2. Is there a close equivalent? → Adapt intelligently
3. Is this field standard? → Use professional default
4. Is this field ambiguous? → Make reasonable assumption
5. For missing data:
   - Names: Generate common first/last names
   - Companies: Use industry-appropriate names
   - Dates: Create plausible timelines
   - Skills: Infer from job descriptions

EXAMPLE OUTPUT:
{
  "first_name": "Michael", // From resume or generated
  "last_name": "Chen", 
  "email": "michael.chen@email.com", // Direct from resume or generated
  "phone": "(415) 555-1234",
  "current_title": "Senior Software Engineer", // From most recent experience
  "years_experience": "5", // Calculated from work history
  "salary_expectations": "$120,000", // Market rate for position/experience
  "availability": "2 weeks notice",
  "skills": "JavaScript, React, Node.js", // Combined from skills section
  "education": "BS Computer Science - Stanford University (2018)",
  "cover_letter": "Attached", // Standard when not provided
  "resume": "resume.pdf", // Standard file upload
  "org": "Tech Solutions Inc.", // Generated plausible company
  "urls[LinkedIn]": "", // Only leave URL fields blank
  "eeo[gender]": "Decline to self-identify" // Standard for sensitive info
}

OUTPUT RULES:
- Return ONLY valid JSON
- Use field names EXACTLY as provided
- No explanatory comments in final output
- All values as strings
- Escape special characters properly
- Never use "Unavailable" or similar placeholders (except for URLs)
- Generate plausible values for all non-URL fields

NOW GENERATE THE COMPLETE FORM FILLING JSON:
`;

  Logger.log(`Sending prompt to Azure OpenAI (${prompt.length} chars)`);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const content: any = response.choices[0].message.content;
    Logger.log("Received response from Azure OpenAI");

    // Extract JSON from response
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}") + 1;
    const jsonString = content.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);
    Logger.log(`Form data generated with ${Object.keys(result).length} fields`);
    return result;
  } catch (error) {
    Logger.log(
      `AI processing failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      "error"
    );
    throw error;
  }
}

async function fillForm(
  page: any,
  formData: Record<string, string>,
  resumePath: string
): Promise<void> {
  Logger.log(`Filling form with ${Object.keys(formData).length} fields`);

  for (const [fieldId, value] of Object.entries(formData)) {
    try {
      // Special handling for file inputs
      if (value === "resume.pdf") {
        await handleFileUpload(page, fieldId, resumePath);
        continue;
      }

      // Try multiple selector strategies with different priorities
      const selectors = [
        `[id="${fieldId}"], [name="${fieldId}"], [data-id="${fieldId}"]`, // Exact matches first
        `input[placeholder*="${fieldId}"i], textarea[placeholder*="${fieldId}"i]`, // Case-insensitive placeholder
        `[aria-label*="${fieldId}"i], [title*="${fieldId}"i]`, // ARIA attributes
        `input, textarea, select`, // Fallback to all inputs
      ];

      let elementFound = false;
      for (const selector of selectors) {
        try {
          const element = await page.$(selector);
          if (!element) continue;

          const tagName = await element.evaluate((el: any) =>
            el.tagName.toLowerCase()
          );
          const inputType = await element.evaluate((el: any) => el.type || "");

          if (tagName === "select") {
            await page.selectOption(selector, value);
            Logger.log(`Selected ${selector} with: ${value}`);
            elementFound = true;
            break;
          } else if (inputType === "radio" || inputType === "checkbox") {
            await element.check({ timeout: 5000 });
            Logger.log(`Checked ${selector}`);
            elementFound = true;
            break;
          } else {
            await element.fill(value, { timeout: 5000 });
            Logger.log(`Filled ${selector} with: ${value}`);
            elementFound = true;
            break;
          }
        } catch (err) {
          continue; // Try next selector
        }
      }

      if (!elementFound) {
        Logger.log(`Field ${fieldId} not found with any selector`, "warn");
      }
    } catch (error) {
      Logger.log(
        `Error filling ${fieldId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
        "warn"
      );
    }
  }
}

async function handleFileUpload(
  page: any,
  fieldSelector: string,
  filePath: string
): Promise<void> {
  try {
    Logger.log(`Attempting to upload file to field: ${fieldSelector}`);

    // Try different ways to find the file input
    const fileInputSelectors = [
      `input[type="file"][id*="resume"], input[type="file"][name*="resume"]`,
      `input[type="file"][id*="file"], input[type="file"][name*="file"]`,
      `input[type="file"]:not([hidden])`, // Fallback to any visible file input
    ];

    for (const selector of fileInputSelectors) {
      try {
        const fileInput = await page.$(selector);
        if (fileInput) {
          await fileInput.setInputFiles(filePath);
          Logger.log(`Successfully uploaded file: ${filePath}`);
          return;
        }
      } catch (err) {
        continue;
      }
    }

    // If no file input found, try click-and-wait approach
    const uploadButtonSelectors = [
      'button:has-text("Upload"), button:has-text("Browse"), button:has-text("Select File")',
      'a:has-text("Upload"), a:has-text("Browse"), a:has-text("Select File")',
      ".upload-button, .browse-button, .file-upload",
    ];

    for (const selector of uploadButtonSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          await page
            .waitForEvent("filechooser")
            .then(async (fileChooser: any) => {
              await fileChooser.setFiles(filePath);
              Logger.log(
                `Successfully uploaded file via file chooser: ${filePath}`
              );
            });
          return;
        }
      } catch (err) {
        continue;
      }
    }

    Logger.log("Could not find file upload element", "warn");
  } catch (error) {
    Logger.log(
      `File upload failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      "error"
    );
  }
}

async function main(resumeUrl: string, jobUrl: string): Promise<any> {
  Logger.log(`Starting job application for: ${jobUrl}`);
  Logger.log(`Using resume from: ${resumeUrl}`);

  let browser: any = null;
  let tempDir = "";

  try {
    // Setup temporary directory
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-"));
    Logger.log(`Created temp directory: ${tempDir}`);

    // Download and process resume
    const resumePath = await getResumePdf(resumeUrl, tempDir);
    const resumeData = await extractResumeData(resumePath);

    // Launch browser and navigate
    Logger.log("Launching browser");
    browser = await chromium.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const context = await browser.newContext({
      acceptDownloads: true,
      viewport: { width: 1280, height: 1024 },
    });
    const page = await context.newPage();

    Logger.log(`Navigating to job URL: ${jobUrl}`);
    await page.goto(jobUrl, {
      waitUntil: "domcontentloaded", // Faster but less complete
      timeout: 60000,
    });

    // Scrape form fields
    const formFields = await scrapeFormFields(page);
    Logger.log(`Found ${formFields.length} form fields`);

    // Process with AI
    const filledFormData = await processWithAzureOpenAI(formFields, resumeData);

    // Fill the form
    await fillForm(page, filledFormData, resumePath);

    // Create screenshots directory in project root
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    await fs.mkdir(screenshotsDir, { recursive: true });

    // Take screenshot with timestamp
    const screenshotPath = path.join(
      screenshotsDir,
      `form-filled-${Date.now()}.png`
    );
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true  // Capture entire page
    });
    Logger.log(`Screenshot saved to: ${screenshotPath}`);

    return {
      status: "success",
      formFields,
      filledFormData,
      screenshotPath: path.relative(process.cwd(), screenshotPath) // Return relative path
    };
  } catch (error: any) {
    Logger.log(`Application failed: ${error.message}`, "error");
    return {
      status: "failed",
      error: error.message,
    };
  } finally {
    Logger.log("Starting cleanup");
    if (browser) {
      await browser
        .close()
        .catch((e: any) =>
          Logger.log(`Browser close error: ${e.message}`, "warn")
        );
    }
    if (tempDir) {
      await fs
        .rm(tempDir, { recursive: true, force: true })
        .catch((e: any) =>
          Logger.log(`Temp dir cleanup error: ${e.message}`, "warn")
        );
    }
    Logger.log("Cleanup completed");
  }
}

// Example usage with error handling
(async () => {
  try {
    const result = await main(
      "https://flowcv.com/resume/ctenphjpl6el",
      // 'https://www.cognitoforms.com/company/apply?entry=%7B%22Application%22%3A%7B%22Position%22%3A%22189-5%22%7D%7D'
      "https://jobs.lever.co/Voxel/87e2acda-8b4d-4fd9-aafe-2b606f0e3d1f/apply"
    );
    Logger.log(`Application result: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    Logger.log(
      `Fatal error: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
