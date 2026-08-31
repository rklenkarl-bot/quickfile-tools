// =====================================================
// QUICKFILE TOOLS - ALL TOOLS CATEGORY FILTER
// Function: Category button click karne par selected
// category ke tools show karta hai aur baaki hide karta hai
// Search Name: QUICKFILE ALL TOOLS FILTER JS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const filterButtons = document.querySelectorAll(".filter-btn");
    const toolCards = document.querySelectorAll(".all-tool-card");

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // Sab buttons se active class remove
            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            // Click kiye hue button ko active karo
            button.classList.add("active");

            // Button ki category lena
            const selectedCategory = button.getAttribute("data-filter");

            // Tools filter karna
            toolCards.forEach(function (card) {

                const cardCategory = card.getAttribute("data-category");

                if (
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });

});
// =====================================================
// QUICKFILE TOOLS - MERGE PDF FILE SELECTION
// Function: Multiple PDF select karke selected files ki list show karta hai
// Search Name: QUICKFILE MERGE PDF FILE SELECTION JS
// =====================================================

const mergePdfInput = document.getElementById("mergePdfInput");
const selectMergePdfButton = document.getElementById("selectMergePdfButton");
const mergePdfFileList = document.getElementById("mergePdfFileList");
const mergePdfButton = document.getElementById("mergePdfButton");

if (
  mergePdfInput &&
  selectMergePdfButton &&
  mergePdfFileList &&
  mergePdfButton
) {

  // =====================================================
  // QUICKFILE TOOLS - OPEN PDF FILE PICKER
  // Function: Select PDF Files button click par file picker open karta hai
  // Search Name: QUICKFILE MERGE PDF PICKER
  // =====================================================

  selectMergePdfButton.addEventListener("click", function () {
    mergePdfInput.click();
  });

  // =====================================================
  // QUICKFILE TOOLS - SHOW SELECTED PDF FILES
  // Function: Selected PDF files ke naam aur size list me dikhata hai
  // Search Name: QUICKFILE MERGE PDF FILE LIST
  // =====================================================

  mergePdfInput.addEventListener("change", function () {

    mergePdfFileList.innerHTML = "";

    const files = Array.from(mergePdfInput.files);

    files.forEach(function (file, index) {

      const fileItem = document.createElement("div");
      fileItem.className = "merge-file-item";

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

      fileItem.innerHTML = `
        <span>${index + 1}. ${file.name}</span>
        <span>${fileSizeMB} MB</span>
      `;

      mergePdfFileList.appendChild(fileItem);
    });

    // Merge button tabhi enable hoga jab kam se kam 2 PDF select hon
    mergePdfButton.disabled = files.length < 2;

  });

}
// =====================================================
// QUICKFILE TOOLS - ACTUAL PDF MERGE FUNCTION
// Function: Selected PDF files ko browser me merge karke
// ek single PDF banata hai aur download karata hai
// Search Name: QUICKFILE ACTUAL PDF MERGE JS
// =====================================================

if (
  mergePdfButton &&
  window.location.pathname.endsWith("merge-pdf.html")
) {
  mergePdfButton.addEventListener("click", async function () {

    const files = Array.from(mergePdfInput.files);

    if (files.length < 2) {
      alert("Please select at least 2 PDF files.");
      return;
    }

    try {

      // Merge button ko temporary disable karna
      mergePdfButton.disabled = true;
      mergePdfButton.textContent = "Merging...";

      // Naya blank PDF create karna
      const mergedPdf = await PDFLib.PDFDocument.create();

      // Har selected PDF ko open karke uske pages copy karna
      for (const file of files) {

        const fileBytes = await file.arrayBuffer();

        const pdf = await PDFLib.PDFDocument.load(fileBytes);

        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        copiedPages.forEach(function (page) {
          mergedPdf.addPage(page);
        });
      }

      // Final merged PDF bytes banana
      const mergedPdfBytes = await mergedPdf.save();

      // Browser download ke liye Blob banana
      const blob = new Blob(
        [mergedPdfBytes],
        { type: "application/pdf" }
      );

      const downloadUrl = URL.createObjectURL(blob);

      // Automatic download link create karna
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = "QuickFileTools-Merged.pdf";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(downloadUrl);

      mergePdfButton.textContent = "Merge PDF";
      mergePdfButton.disabled = false;

    } catch (error) {

      console.error("Merge PDF Error:", error);

      alert(
        "PDF merge failed. Please make sure the selected files are valid PDF files."
      );

      mergePdfButton.textContent = "Merge PDF";
      mergePdfButton.disabled = false;
    }

  });

}
// =====================================================
// QUICKFILE TOOLS - ACTUAL SPLIT PDF FUNCTION
// Function: Selected single PDF ko har page me split karke
// alag-alag PDF files download karata hai
// Search Name: QUICKFILE ACTUAL SPLIT PDF JS
// =====================================================

const splitPdfInput = document.getElementById("mergePdfInput");
const splitPdfSelectButton = document.getElementById("selectMergePdfButton");
const splitPdfButton = document.getElementById("mergePdfButton");
const splitPdfFileList = document.getElementById("mergePdfFileList");

// Select PDF button click
if (
  splitPdfSelectButton &&
  splitPdfInput &&
  window.location.pathname.endsWith("split-pdf.html")
) {
  splitPdfSelectButton.addEventListener("click", function () {
    splitPdfInput.click();
  });
}

// File selected
if (
  splitPdfInput &&
  splitPdfButton &&
  splitPdfFileList &&
  window.location.pathname.endsWith("split-pdf.html")
) {
  splitPdfInput.addEventListener("change", function () {

    const file = splitPdfInput.files[0];

    splitPdfFileList.innerHTML = "";

    if (!file) {
      splitPdfButton.disabled = true;
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    splitPdfFileList.innerHTML = `
      <div class="merge-file-item">
        <span>${file.name}</span>
        <span>${fileSizeMB} MB</span>
      </div>
    `;

    splitPdfButton.disabled = false;
  });
}

// Split PDF action
if (
  splitPdfButton &&
  splitPdfInput &&
  window.location.pathname.endsWith("split-pdf.html")
) {

  splitPdfButton.addEventListener("click", async function () {

    const file = splitPdfInput.files[0];

    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    try {

      splitPdfButton.disabled = true;
      splitPdfButton.textContent = "Splitting...";

      const fileBytes = await file.arrayBuffer();

      const sourcePdf = await PDFLib.PDFDocument.load(fileBytes);

      const totalPages = sourcePdf.getPageCount();

      for (let i = 0; i < totalPages; i++) {

        const newPdf = await PDFLib.PDFDocument.create();

        const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);

        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();

        const blob = new Blob(
          [pdfBytes],
          { type: "application/pdf" }
        );

        const downloadUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");

        downloadLink.href = downloadUrl;
        downloadLink.download =
          `QuickFileTools-Page-${i + 1}.pdf`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        URL.revokeObjectURL(downloadUrl);
      }

      splitPdfButton.textContent = "Split PDF";
      splitPdfButton.disabled = false;

    } catch (error) {

      console.error("Split PDF Error:", error);

      alert(
        "PDF split failed. Please make sure the selected file is a valid PDF."
      );

      splitPdfButton.textContent = "Split PDF";
      splitPdfButton.disabled = false;
    }

  });

}
// =====================================================
// QUICKFILE TOOLS - COMPRESS PDF SETUP
// Function: Compress PDF page ke buttons aur file input
// ko JavaScript se connect karta hai
// Search Name: QUICKFILE COMPRESS PDF SETUP JS
// =====================================================

const compressPdfInput = document.getElementById("mergePdfInput");
const compressPdfSelectButton = document.getElementById("selectMergePdfButton");
const compressPdfButton = document.getElementById("mergePdfButton");
const compressPdfFileList = document.getElementById("mergePdfFileList");
// =====================================================
// QUICKFILE TOOLS - COMPRESS PDF FILE SELECT BUTTON
// Function: Compress PDF page par Select PDF File button
// click hone par file picker open karta hai
// Search Name: QUICKFILE COMPRESS PDF SELECT BUTTON
// =====================================================

if (
  compressPdfSelectButton &&
  compressPdfInput &&
  window.location.pathname.endsWith("compress-pdf.html")
) {
  compressPdfSelectButton.addEventListener("click", function () {
    compressPdfInput.click();
  });
}
// =====================================================
// QUICKFILE TOOLS - COMPRESS PDF FILE SELECT DISPLAY
// Function: Selected PDF ka naam aur size dikhata hai
// aur Compress PDF button enable karta hai
// Search Name: QUICKFILE COMPRESS PDF FILE DISPLAY
// =====================================================

if (
  compressPdfInput &&
  compressPdfButton &&
  compressPdfFileList &&
  window.location.pathname.endsWith("compress-pdf.html")
) {
  compressPdfInput.addEventListener("change", function () {

    const file = compressPdfInput.files[0];

    compressPdfFileList.innerHTML = "";

    if (!file) {
      compressPdfButton.disabled = true;
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    compressPdfFileList.innerHTML = `
      <div class="merge-file-item">
        <span>${file.name}</span>
        <span>${fileSizeMB} MB</span>
      </div>
    `;

    compressPdfButton.disabled = false;
  });
}
// =====================================================
// QUICKFILE TOOLS - ACTUAL COMPRESS PDF FUNCTION
// Function: Selected PDF ko browser me optimize karta hai,
// file size compare karta hai aur smaller PDF download karta hai
// Search Name: QUICKFILE ACTUAL COMPRESS PDF JS
// =====================================================

if (
  compressPdfButton &&
  compressPdfInput &&
  window.location.pathname.endsWith("compress-pdf.html")
) {

  compressPdfButton.addEventListener("click", async function () {

    const file = compressPdfInput.files[0];

    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    try {

      compressPdfButton.disabled = true;
      compressPdfButton.textContent = "Compressing...";

      const originalBytes = await file.arrayBuffer();

      const pdfDoc = await PDFLib.PDFDocument.load(originalBytes);

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false
      });

      const originalSize = file.size;
      const compressedSize = compressedBytes.length;

      // Agar optimized file original se chhoti nahi hai
      if (compressedSize >= originalSize) {

        alert(
          "This PDF is already well optimized. No meaningful size reduction was possible."
        );

        compressPdfButton.textContent = "Compress PDF";
        compressPdfButton.disabled = false;
        return;
      }

      const blob = new Blob(
        [compressedBytes],
        { type: "application/pdf" }
      );

      const downloadUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = "QuickFileTools-Compressed.pdf";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(downloadUrl);

      compressPdfButton.textContent = "Compress PDF";
      compressPdfButton.disabled = false;

    } catch (error) {

      console.error("Compress PDF Error:", error);

      alert(
        "PDF compression failed. Please make sure the selected file is a valid PDF."
      );

      compressPdfButton.textContent = "Compress PDF";
      compressPdfButton.disabled = false;
    }

  });

}
// ==========================================================
// QUICKFILE TOOLS - PDF TO WORD BACKEND CONVERSION
// Function: PDF ko backend par bhejkar DOCX download karta hai
// Search Name: QUICKFILE PDF TO WORD COMPLETE JS
// ==========================================================

const pdfToWordInput = document.getElementById("mergePdfInput");
const pdfToWordSelectButton = document.getElementById("selectMergePdfButton");
const pdfToWordButton = document.getElementById("mergePdfButton");
const pdfToWordFileList = document.getElementById("mergePdfFileList");
const pdfToWordMode = document.getElementById("pdfToWordMode");

if (
  pdfToWordInput &&
  pdfToWordSelectButton &&
  pdfToWordButton &&
  pdfToWordFileList &&
  pdfToWordMode &&
  window.location.pathname.endsWith("pdf-to-word.html")
) {

  // Select PDF
  pdfToWordSelectButton.addEventListener("click", () => {
    pdfToWordInput.click();
  });

  // Show selected file
  pdfToWordInput.addEventListener("change", () => {
    const file = pdfToWordInput.files[0];

    if (file) {
      pdfToWordFileList.textContent = file.name;
      pdfToWordButton.disabled = false;
    } else {
      pdfToWordFileList.textContent = "";
      pdfToWordButton.disabled = true;
    }
  });

  // Convert PDF to Word
  pdfToWordButton.addEventListener("click", async () => {
    console.log("PDF TO WORD BUTTON CLICKED");

    const file = pdfToWordInput.files[0];

    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file.");
      return;
    }

    try {

      pdfToWordButton.disabled = true;
      pdfToWordButton.textContent = "Converting...";

      const formData = new FormData();
      formData.append("file", file);

      const selectedMode = pdfToWordMode.value;

      let endpoint = "http://127.0.0.1:8001/pdf-to-word";

      if (selectedMode === "layout") {
        endpoint = "http://127.0.0.1:8001/pdf-to-word-layout";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        let errorMessage = "PDF to Word conversion failed.";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (error) {}

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;

      const originalName = file.name.replace(/\.pdf$/i, "");

      if (selectedMode === "layout") {
        downloadLink.download = originalName + "-layout.docx";
      } else {
        downloadLink.download = originalName + ".docx";
      }

      document.body.appendChild(downloadLink);

      downloadLink.click();

      downloadLink.remove();

      URL.revokeObjectURL(downloadUrl);

      pdfToWordButton.textContent = "PDF to Word";
      pdfToWordButton.disabled = false;

    } catch (error) {

      console.error(
        "PDF to Word Backend Error:",
        error
      );

      alert(
        "PDF to Word conversion failed. Please make sure the QuickFile Tools backend is running."
      );

      pdfToWordButton.textContent = "PDF to Word";
      pdfToWordButton.disabled = false;
    }
  });
}

// ==========================================================// ==========================================================
// QUICKFILE TOOLS - WORD TO PDF
// Function: Word file ko PDF me convert karta hai
// Search Name: QUICKFILE WORD TO PDF JS
// ==========================================================

const wordToPdfInput = document.getElementById("wordToPdfInput");
const selectWordToPdfButton = document.getElementById("selectWordToPdfButton");
const wordToPdfFileList = document.getElementById("wordToPdfFileList");
const wordToPdfButton = document.getElementById("wordToPdfButton");

if (
  wordToPdfInput &&
  selectWordToPdfButton &&
  wordToPdfFileList &&
  wordToPdfButton
) {

  // Open Word file picker
  selectWordToPdfButton.addEventListener("click", () => {
    wordToPdfInput.click();
  });

  // Show selected Word file
  wordToPdfInput.addEventListener("change", () => {
    const file = wordToPdfInput.files[0];

    if (file) {
      wordToPdfFileList.textContent = file.name;
      wordToPdfButton.disabled = false;
    } else {
      wordToPdfFileList.textContent = "";
      wordToPdfButton.disabled = true;
    }
  });

  // Convert Word to PDF
  wordToPdfButton.addEventListener("click", async () => {
  const file = wordToPdfInput.files[0];

  if (!file) {
    alert("Please select a Word file first.");
    return;
  }

  wordToPdfButton.disabled = true;
  wordToPdfButton.textContent = "Converting...";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "http://127.0.0.1:8001/word-to-pdf",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Word to PDF conversion failed.");
    }

    const blob = await response.blob();

    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download =
      file.name.replace(/\.(docx?|DOCX?)$/, "") + ".pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(error);
    alert("Word to PDF conversion failed.");
  } finally {
    wordToPdfButton.disabled = false;
    wordToPdfButton.textContent = "Word to PDF";
  }
});
}