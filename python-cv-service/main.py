from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
import io
import traceback
from highlight import highlight_keywords

app = FastAPI()

@app.post("/highlight")
async def highlight_pdf(pdf: UploadFile = File(...), keywords: List[str] = Form(...)):
    try:
        pdf_bytes = await pdf.read()
        highlighted_pdf_bytes = highlight_keywords(pdf_bytes, keywords)
        
        return StreamingResponse(
            io.BytesIO(highlighted_pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=highlighted_{pdf.filename}"}
        )
    except Exception as e:
        print("Error in /highlight endpoint:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))