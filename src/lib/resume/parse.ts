import mammoth from "mammoth";

export class UnreadableFileError extends Error {}

/**
 * Extracts raw text from an uploaded resume file.
 * Scanned/image-only PDFs produce little or no text — we detect that and ask the
 * user to upload a text-based file rather than silently returning garbage.
 * (OCR fallback is a deliberate post-launch addition, not a Month-1 blocker.)
 */
export async function extractResumeText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop();

  let text = "";

  if (ext === "pdf") {
    // pdf-parse v2 uses a class-based API (new PDFParse({ data }).getText()), not
    // the old v1 default-function-export API — worth knowing if you're pattern-matching
    // from older tutorials/training data, the shape genuinely changed between majors.
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      text = result.text;
    } finally {
      await parser.destroy();
    }
  } else if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    throw new UnreadableFileError(
      "Unsupported file type. Please upload a PDF or DOCX."
    );
  }

  const cleaned = text.replace(/\s+/g, " ").trim();

  if (cleaned.length < 100) {
    throw new UnreadableFileError(
      "We couldn't read enough text from this file — it may be a scanned image rather than a text-based document. Try exporting it directly from Word or Google Docs as a PDF."
    );
  }

  return cleaned;
}
