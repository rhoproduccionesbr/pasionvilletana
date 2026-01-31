import os
import docx
import pdfplumber
from pathlib import Path

def convert_docx_to_md(docx_path, output_path):
    try:
        doc = docx.Document(docx_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"# Converted from {os.path.basename(docx_path)}\n\n")
            f.write('\n'.join(full_text))
        return True
    except Exception as e:
        print(f"Error converting {docx_path}: {e}")
        return False

def convert_pdf_to_md(pdf_path, output_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text.append(text)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"# Converted from {os.path.basename(pdf_path)}\n\n")
            f.write('\n\n---\n\n'.join(full_text))
        return True
    except Exception as e:
        print(f"Error converting {pdf_path}: {e}")
        return False

def main():
    base_dir = Path(r"e:\Rodrigo\Documents\Systema LVF")
    output_dir = base_dir / "docs_text"
    output_dir.mkdir(exist_ok=True)
    
    folders_to_scan = ["DATOS", "INVESTIGACIONES"]
    
    for folder in folders_to_scan:
        folder_path = base_dir / folder
        if not folder_path.exists():
            continue
            
        print(f"Scanning folder: {folder}")
        for file in folder_path.iterdir():
            if file.suffix.lower() == ".docx":
                target = output_dir / f"{file.stem}.md"
                print(f"Converting DOCX: {file.name}")
                convert_docx_to_md(str(file), str(target))
            elif file.suffix.lower() == ".pdf":
                target = output_dir / f"{file.stem}.md"
                print(f"Converting PDF: {file.name}")
                convert_pdf_to_md(str(file), str(target))

if __name__ == "__main__":
    main()
