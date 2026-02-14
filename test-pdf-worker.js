
const fs = require('fs');
const path = require('path');

async function testPdfWorker() {
    console.log('--- Testing pdf-parse outputting worker error ---');
    try {
        if (!global.DOMMatrix) {
            global.DOMMatrix = class DOMMatrix { };
        }

        // Minimal valid PDF binary
        const pdfContent = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000111 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF`;
        const buffer = Buffer.from(pdfContent);

        // Use the path we found works for the class
        const pdfModule = require('pdf-parse');
        const PDFParse = pdfModule.PDFParse || (pdfModule.default && pdfModule.default.PDFParse);

        if (typeof PDFParse === 'function') {
            console.log('Found PDFParse class.');

            // Inspect if setWorker exists
            if (typeof PDFParse.setWorker === 'function') {
                console.log('PDFParse.setWorker exists. Calling it...');
                try {
                    // Try setting it to a known worker script if possible, or leave empty
                    // In node, we often don't need a separate worker file if we can suppress the check.
                    // Let's try pointing to the one in node_modules
                    const workerPath = require.resolve('pdfjs-dist/build/pdf.worker.js');
                    console.log('Setting worker to:', workerPath);
                    PDFParse.setWorker(workerPath);
                } catch (e) {
                    console.log('Failed to resolve worker or set it:', e.message);
                }
            } else {
                console.log('PDFParse.setWorker does NOT exist.');
            }

            try {
                const parser = new PDFParse({ data: buffer });
                const result = await parser.getText();
                console.log('Extracted Text:', result.text);
            } catch (e) {
                console.log('Check if this matches the terminal error:');
                console.log(e.message);
            }
        }

    } catch (e) {
        console.error('❌ Error:', e);
    }
}

testPdfWorker();
