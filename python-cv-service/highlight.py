import fitz  # PyMuPDF

def highlight_keywords(pdf_bytes, keywords):
    """
    Highlights keywords in a PDF file.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pink = (1.0, 0.45, 0.78)  # RGB for #FF74C8

    for page in doc:
        for keyword in keywords:
            text_instances = page.search_for(keyword)
            for inst in text_instances:
                highlight = page.add_highlight_annot(inst)
                highlight.set_colors(stroke=pink)
                highlight.update()

    output_pdf_bytes = doc.write()
    doc.close()
    
    return output_pdf_bytes
