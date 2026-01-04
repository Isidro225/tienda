import re
import unicodedata
import pandas as pd

import pdfplumber

PDF_PATH = "data/lista.pdf"  # <-- poné acá tu PDF
OUT_CSV  = "data/precios_import_panaderia_con_marcas.csv"

def norm(s: str) -> str:
    s = s.strip()
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\s+", " ", s)
    return s

def is_price(token: str) -> bool:
    t = token.strip().replace(".", "").replace(" ", "")
    # admite 1.234,56 / 1234,56 / 1234
    return bool(re.fullmatch(r"\$?\d+(,\d{1,2})?", t))

def extract_rows_from_page(page):
    """
    Extrae filas agrupando por coordenada 'top' y armando columnas por posición X.
    La idea: primera columna = marca, segunda = producto, última(s) = precio.
    """
    words = page.extract_words(use_text_flow=True, keep_blank_chars=False)
    if not words:
        return []

    # Agrupar por línea (top similar)
    lines = {}
    for w in words:
        top = round(w["top"], 1)
        lines.setdefault(top, []).append(w)

    rows = []
    for top in sorted(lines.keys()):
        line_words = sorted(lines[top], key=lambda x: x["x0"])
        text = " ".join(w["text"] for w in line_words).strip()
        text = re.sub(r"\s+", " ", text)

        # Filtrar encabezados típicos
        if len(text) < 3:
            continue
        if re.search(r"(LISTA\s+DE\s+PRECIOS|MARCA|PRODUCTO|DESCRIP|PRECIO)", text.upper()):
            continue

        # Intento 1: usar posiciones x para separar "marca" y "producto"
        # Tomamos el primer "bloque" como marca hasta que cambia mucho X
        # pero suele ser más estable si asumimos: marca = primer token, producto = resto hasta precio.
        tokens = text.split(" ")
        if len(tokens) < 2:
            continue

        # Buscar el precio desde el final
        price = None
        price_idx = None
        for i in range(len(tokens)-1, -1, -1):
            if is_price(tokens[i]):
                price = tokens[i]
                price_idx = i
                break

        if price is None:
            # hay líneas sin precio, las ignoramos
            continue

        left = tokens[:price_idx]
        if len(left) < 2:
            continue

        brand = left[0]
        name  = " ".join(left[1:])

        brand = norm(brand)
        name  = norm(name)
        price = norm(price).replace("$", "")

        # Heurística: si "marca" quedó demasiado corta o rara, igual la dejamos,
        # luego podés depurar con un paso extra.
        rows.append({"brand": brand, "name": name, "price_raw": price})

    return rows

def main():
    all_rows = []
    with pdfplumber.open(PDF_PATH) as pdf:
        for page in pdf.pages:
            all_rows.extend(extract_rows_from_page(page))

    df = pd.DataFrame(all_rows)

    # Limpiezas extra
    df = df.dropna()
    df = df[df["name"].str.len() >= 2]
    df = df[df["brand"].str.len() >= 2]

    # Normalizar precio a número (ARS)
    def parse_price(p):
        p = p.replace(".", "").replace(" ", "")
        p = p.replace(",", ".")
        try:
            return float(p)
        except:
            return None

    df["price"] = df["price_raw"].apply(parse_price)
    df = df.dropna(subset=["price"])

    # Opcional: quitar duplicados exactos
    df = df.drop_duplicates(subset=["brand", "name", "price"])

    df.to_csv(OUT_CSV, index=False, encoding="utf-8")
    print(f"OK -> {OUT_CSV} ({len(df)} filas)")

if __name__ == "__main__":
    main()
