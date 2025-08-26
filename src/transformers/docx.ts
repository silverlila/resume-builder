/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  TableLayoutType,
  BorderStyle,
} from "docx";
import type { Align, IRDoc, IRNode, TextStyle, Spacing } from "../primitives";
import { pxToTwip } from "../units";

const A4_WIDTH_TW = 11906; // 8.27in * 1440
const A4_HEIGHT_TW = 16838; // 11.69in * 1440
const PAGE_PAD_PX = 56; // match your PDF Page padding
const PAD_TW = pxToTwip(PAGE_PAD_PX);

const CONTENT_TW = A4_WIDTH_TW - 2 * (PAD_TW ?? 1);

export async function transformToDOCX(ir: IRDoc): Promise<Buffer> {
  const children = renderNodes(ir.children);
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: A4_WIDTH_TW, height: A4_HEIGHT_TW },
            margin: {
              top: PAD_TW,
              right: PAD_TW,
              bottom: PAD_TW,
              left: PAD_TW,
            },
          },
        },
        children: children.length ? children : [new Paragraph("")],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

function renderNodes(nodes: IRNode[]): any[] {
  const out: any[] = [];

  for (const n of nodes) {
    switch (n.kind) {
      case "doc":
        out.push(...renderNodes(n.children));
        break;

      case "section": {
        const m = n.spacing ?? {};
        const children = renderNodes(n.children);
        out.push(Section(m, children));
        break;
      }

      case "text":
        out.push(Text(n.text, n.style, n.align));
        break;
    }
  }

  return out;
}

const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

function Section(spacing: Spacing, children: Paragraph[]) {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: CONTENT_TW, type: WidthType.DXA },
    columnWidths: [CONTENT_TW],
    borders: { top: none, bottom: none, left: none, right: none },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: none, bottom: none, left: none, right: none },
            width: { size: CONTENT_TW, type: WidthType.DXA },
            margins: {
              top: pxToTwip(spacing.top ?? 0),
              right: pxToTwip(spacing.right ?? 0),
              bottom: pxToTwip(spacing.bottom ?? 0),
              left: pxToTwip(spacing.left ?? 0),
            },
            children: children.length ? children : [new Paragraph("")],
          }),
        ],
      }),
    ],
  });
}

function Text(
  text: string,
  style?: TextStyle,
  align?: Align,
  spacing?: Spacing
): Paragraph {
  return new Paragraph({
    alignment: mapAlign(align),
    spacing: {
      before: pxToTwip(spacing?.top ?? 0),
      after: pxToTwip(spacing?.bottom ?? 0),
      line: 276, // ~1.15 line height (13.8pt)
    },
    indent: {
      left: pxToTwip(spacing?.left ?? 0),
      right: pxToTwip(spacing?.right ?? 0),
    },
    children: [
      new TextRun({
        text,
        bold: !!style?.bold,
        italics: !!style?.italic,
        size: style?.size ? Math.round(style.size * 2) : undefined,
        font: style?.font,
        color: style?.color?.replace("#", ""),
      }),
    ],
  });
}

function mapAlign(a?: Align) {
  switch (a) {
    case "center":
      return AlignmentType.CENTER;
    case "end":
      return AlignmentType.RIGHT;
    case "justify":
      return AlignmentType.JUSTIFIED;
    default:
      return AlignmentType.LEFT;
  }
}
