import React from "react";
import express from "express";
import { parseToAST } from "./src/parser";
import { ResumeSimple } from "./src/template";
import { transformToDOCX } from "./src/transformers/docx";
import { transformToPDF } from "./src/transformers/pdf";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use(cors());

app.get("/resume.docx", async (_req, res) => {
  try {
    const ast = parseToAST(<ResumeSimple />);
    const buffer = await transformToDOCX(ast);

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="resume.docx"',
      "Content-Length": buffer.length,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate DOCX");
  }
});

app.get("/resume.pdf", async (_req, res) => {
  try {
    const ast = parseToAST(<ResumeSimple />);
    const stream = await transformToPDF(ast);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
      "Cache-Control": "no-store",
    });

    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate PDF");
  }
});

app.get("/healthz", (_req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
