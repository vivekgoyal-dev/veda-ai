"use client";

export async function downloadElementAsPdf(elementId: string, filename: string) {
  const node = document.getElementById(elementId);
  if (!node) return;

  // Use the browser's print pipeline scoped to the question-paper element
  // by opening a print window. This avoids extra deps.
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("Please allow pop-ups to download as PDF.");
    return;
  }

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${filename}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }
  .paper { max-width: 720px; margin: 0 auto; }
  h1, h2 { margin: 0 0 6px; }
  header { text-align: center; margin-bottom: 18px; }
  .row { display: flex; justify-content: space-between; font-size: 13px; }
  .italic { font-style: italic; color: #6b7280; }
  ol { padding-left: 18px; }
  li { margin-bottom: 6px; }
  .badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    margin-right: 6px;
  }
  .easy { color: #16a34a; background: #ecfdf5; }
  .moderate { color: #d97706; background: #fffbeb; }
  .hard { color: #dc2626; background: #fef2f2; }
  .answer-key { margin-top: 24px; border-top: 1px dashed #e5e7eb; padding-top: 14px; }
</style>
</head>
<body>
  <div class="paper">${node.outerHTML}</div>
  <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 200); };</script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
