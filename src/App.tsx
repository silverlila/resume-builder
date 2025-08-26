import { ResumeSimple } from "./template";

function App() {
  const download = async (url: string, filename: string) => {
    const res = await fetch(`http://localhost:3000${url}`);
    if (!res.ok) {
      alert("Download failed");
      return;
    }
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div style={{ maxWidth: "800px", width: "100%", margin: "10px auto" }}>
      <div style={{ margin: "20px 0", display: "flex", gap: "12px" }}>
        <button onClick={() => download("/resume.pdf", "resume.pdf")}>
          Download PDF
        </button>
        <button onClick={() => download("/resume.docx", "resume.docx")}>
          Download DOCX
        </button>
      </div>

      <ResumeSimple />
    </div>
  );
}

export default App;
