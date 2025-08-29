# Resume Builder

This project is a **proof of concept** for building resumes from a single source of truth.  
Instead of writing separate logic for each export format, we define a small set of **React primitives** and use them to render both PDF and DOCX.

---

## Architecture

### 1. Parsing
We start with a React tree written using custom primitives such as `<Doc>`, `<Section>`, and `<Text>`:

```jsx
<Section>
  <Text>Hello World</Text>
</Section>
```
This JSX is parsed into an intermediate representation (IR):

```json
[
  {
    "kind": "section",
    "children": [
      {
        "kind": "text",
        "text": "Hello World",
        "styles": {}
      }
    ]
  }
]
```
The IR (intermediate representation) is a format-agnostic schema describing the structure of the resume.

### 2. Transforming
Once we have the IR (intermediate representation), we pass it to a transformer. Each transformer knows how to walk the schema and produce output for a specific format.
	•	transformToPDF → builds React-PDF nodes
	•	transformToDOCX → builds docx API objects

**Example**
**Input**
```json
[
  {
    "kind": "section",
    "children": [
      { "kind": "text", "text": "Hello World", "styles": {} }
    ]
  }
]
```
**Output (PDF transformer):**
```jsx
import { View, Text } from "@react-pdf/renderer";

<View>
  <Text>Hello World</Text>
</View>
```

### 3. Rendering
Finally, each transformer output is passed to an existing library that takes care of producing the final binary file:
	•	PDF → @react-pdf/renderer → Buffer / Stream
	•	DOCX → docx → Buffer

Rendering is straightforward. The heavy lifting happens in parsing and transforming, which ensure both formats stay consistent.

