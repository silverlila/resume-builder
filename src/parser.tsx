/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Doc, Section, Text, type IRDoc, type IRNode } from "./primitives";

type AnyEl = React.ReactElement<any, any>;

function isElement(n: unknown): n is AnyEl {
  return !!n && React.isValidElement(n as any);
}

export function parseToAST(el: React.ReactElement): IRDoc {
  const nodes = walk(el);
  const doc = nodes.find((n) => n.kind === "doc") as IRDoc | undefined;
  if (doc) return doc;
  return { kind: "doc", children: nodes };
}

function walk(node: React.ReactNode | React.ReactNode[]): IRNode[] {
  if (node == null) return [];
  if (Array.isArray(node)) return node.flatMap((n) => walk(n));
  if (!isElement(node)) return [];

  const el: AnyEl = node;
  const rawType = el.type;
  const props: any = (el as any).props ?? {};
  const type = unwrapType(rawType);

  if (type === React.Fragment) return walk(props.children);

  const kids = props.children ? walk(props.children) : [];

  switch (type) {
    case Doc:
      return [{ kind: "doc", children: kids }];

    case Section:
      return [{ kind: "section", spacing: props.spacing, children: kids }];

    case Text:
      return [
        {
          kind: "text",
          text: flattenText(props.children as React.ReactNode),
          style: props.style,
          align: props.align,
          spacing: props.spacing,
        },
      ];
  }

  if (typeof type === "function") {
    const rendered = (type as any)(props);
    return walk(rendered as React.ReactNode | React.ReactNode[]);
  }

  return kids;
}

function unwrapType(t: any) {
  if (t && typeof t === "object" && "type" in t) return t.type;
  return t;
}

function flattenText(children: React.ReactNode): string {
  let s = "";
  React.Children.forEach(children, (c) => {
    if (typeof c === "string" || typeof c === "number") s += String(c);
  });
  return s;
}
