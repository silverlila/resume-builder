/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactPDF, { Document, Page, View, Text } from "@react-pdf/renderer";
import type { Align, IRDoc, IRNode, TextStyle, Spacing } from "../primitives";
import { pxToPt } from "../units";

export async function transformToPDF(ir: IRDoc) {
  const el = <PDFDoc ir={ir} />;
  return ReactPDF.renderToStream(el);
}

const PDFDoc: React.FC<{ ir: IRDoc }> = ({ ir }) => (
  <Document>
    <Page
      size="A4"
      style={{
        paddingTop: pxToPt(56),
        paddingRight: pxToPt(56),
        paddingBottom: pxToPt(56),
        paddingLeft: pxToPt(56),
      }}
    >
      {renderNodes(ir.children)}
    </Page>
  </Document>
);

function renderNodes(nodes: IRNode[]): React.ReactNode {
  return nodes.map((n, i) => {
    switch (n.kind) {
      case "doc":
        return <View key={i}>{renderNodes(n.children)}</View>;

      case "section":
        return (
          <View key={i} style={sectionStyles(n.spacing)}>
            {renderNodes(n.children)}
          </View>
        );

      case "text":
        return (
          <Text key={i} style={textStyle(n.style, n.align, n.spacing)}>
            {n.text}
          </Text>
        );

      default:
        return null;
    }
  });
}

function sectionStyles(m?: Spacing) {
  return {
    paddingTop: m?.top ? pxToPt(m.top) : 0,
    paddingRight: m?.right ? pxToPt(m.right) : 0,
    paddingBottom: m?.bottom ? pxToPt(m.bottom) : 8,
    paddingLeft: m?.left ? pxToPt(m.left) : 0,
  } as const;
}

function textStyle(s?: TextStyle, a?: Align, m?: Spacing) {
  return {
    fontSize: s?.size ?? 12,
    fontWeight: s?.bold ? 700 : 400,
    fontStyle: s?.italic ? "italic" : "normal",
    color: s?.color ?? "#000",
    textAlign: mapAlign(a),
    lineHeight: 1.15,
    marginBottom: m?.bottom ? pxToPt(m.bottom) : 0,
    marginTop: m?.top ? pxToPt(m.top) : 0,
    marginLeft: m?.left ? pxToPt(m.left) : 0,
    marginRight: m?.right ? pxToPt(m.right) : 0,
  } as const;
}

function mapAlign(a?: Align) {
  switch (a) {
    case "center":
      return "center";
    case "end":
      return "right";
    case "justify":
      return "justify";
    default:
      return "left";
  }
}
