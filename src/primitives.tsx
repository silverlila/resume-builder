export type Spacing = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type TextStyle = {
  font?: string;
  size?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
};

export type Align = "start" | "center" | "end" | "justify";
export type Type = "paragraph" | "heading";

export type IRNode =
  | { kind: "doc"; children: IRNode[] }
  | { kind: "section"; children: IRNode[]; spacing?: Spacing }
  | {
      kind: "text";
      text: string;
      style?: TextStyle;
      align?: Align;
      type?: Type;
      spacing?: Spacing;
    };

export type IRDoc = Extract<IRNode, { kind: "doc" }>;

export const Doc: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const Section: React.FC<{
  children: React.ReactNode;
  spacing?: Spacing;
}> = ({ children, spacing }) => (
  <div
    style={{
      paddingTop: spacing?.top,
      paddingRight: spacing?.right,
      paddingBottom: spacing?.bottom,
      paddingLeft: spacing?.left,
    }}
  >
    {children}
  </div>
);

const typeMapping = {
  paragraph: "p",
  heading: "h1",
} as const;

export const Text: React.FC<{
  children: React.ReactNode;
  type: Type;
  style?: TextStyle;
  align?: Align;
}> = ({ children, align, style, type }) => {
  const Tag = typeMapping[type || "paragraph"];
  return (
    <Tag
      style={{
        textAlign: align,
        fontSize: `${style?.size}px`,
        fontFamily: style?.font,
        fontWeight: style?.bold ? "bold" : "normal",
        fontStyle: style?.italic ? "italic" : "normal",
        color: style?.color,
      }}
    >
      {children}
    </Tag>
  );
};
