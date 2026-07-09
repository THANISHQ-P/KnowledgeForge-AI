import fs from "fs";
import { PDFParse } from "pdf-parse";

export async function extractPDF(filePath) {

    try {

        console.log("Reading PDF...");

        const buffer = fs.readFileSync(filePath);

        console.log("Buffer Size:", buffer.length);

        const parser = new PDFParse({
            data: buffer
        });

        console.log("Parsing PDF...");

        const result = await parser.getText();

        console.log("PDF Parsed Successfully");

        await parser.destroy();

        return result.text;

    } catch (err) {

        console.error("PDF ERROR");

        console.error(err);

        throw err;

    }

}