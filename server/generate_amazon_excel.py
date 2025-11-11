"""
Flask app that takes ASINs or product JSON and returns an Excel (.xlsx) file.

Endpoints:
- POST /generate-excel
  Body JSON examples:
    { "mode": "mock", "asins": ["B07...", "B08..."] }
    { "mode": "amazon", "asins": ["B07...", "B08..."] }
    { "products": [ {"id":..., "title":..., ...}, ... ] }

Behavior:
- If `products` is provided in request body, it will be used to create the Excel immediately.
- If mode == 'mock', the server builds fake product data for the provided ASINs (useful for testing).
- If mode == 'amazon', this script contains a placeholder `fetch_products_from_amazon` where you should implement calls to Amazon Product Advertising API (PA-API).

Requirements:
  pip install -r requirements.txt
  Then run:
  python generate_amazon_excel.py

Notes about Amazon PA-API:
- The Product Advertising API requires signing requests and a Partner Tag. Amazon provides official SDKs.
- I provide instructions inside `fetch_products_from_amazon` on how to plug in the SDK or your own signed requests.
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import os
import time
import pandas as pd
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilitar CORS para desarrollo


def generate_excel_bytes(products):
    """Create an Excel file in memory from a list of product dicts and return bytes."""
    # Normalize fields we want in the Excel
    rows = []
    for p in products:
        rows.append({
            "id": p.get("id"),
            "asin": p.get("asin") or p.get("id"),
            "title": p.get("title"),
            "brand": p.get("brand"),
            "price": p.get("price"),
            "currency": p.get("currency"),
            "rating": p.get("rating"),
            "reviews_count": p.get("reviews_count"),
            "category": p.get("category"),
            "subcategory": p.get("subcategory"),
            "affiliate_link": p.get("affiliate_link"),
            "stock": p.get("stock"),
            "description": p.get("description"),
        })

    df = pd.DataFrame(rows)
    bio = io.BytesIO()
    # Use openpyxl engine for Excel
    df.to_excel(bio, index=False, engine="openpyxl")
    bio.seek(0)
    return bio


def build_mock_product(asin):
    """Return a mock product dict for testing."""
    return {
        "asin": asin,
        "id": asin,
        "title": f"Producto de prueba {asin}",
        "brand": "MarcaMock",
        "price": 19.99,
        "currency": "USD",
        "rating": 4.2,
        "reviews_count": 123,
        "category": "audio",
        "subcategory": "auriculares",
        "affiliate_link": f"https://www.amazon.com/dp/{asin}?tag=TU-AFF_ID",
        "stock": "in_stock",
        "description": "Descripción de ejemplo para pruebas.",
    }


def fetch_products_from_amazon(asins):
    """
    Integración con Amazon Product Advertising API (PA-API 5.0).
    
    IMPORTANTE: Esta función está lista para la integración. Solo necesitas:
    1. Instalar el SDK oficial: pip install paapi5-python-sdk
    2. Configurar variables de entorno en .env
    3. Descomentar el código de implementación
    
    Documentación oficial: https://webservices.amazon.es/paapi5/documentation/
    """
    # Verificar credenciales
    pa_access_key = os.getenv("PAAPI_ACCESS_KEY")
    pa_secret = os.getenv("PAAPI_SECRET_KEY")
    pa_partner_tag = os.getenv("PAAPI_PARTNER_TAG")
    
    if not (pa_access_key and pa_secret and pa_partner_tag):
        raise RuntimeError(
            "⚠️ Credenciales PA-API no configuradas.\n\n"
            "Pasos para configurar:\n"
            "1. Crear archivo .env en la carpeta server/\n"
            "2. Agregar las siguientes variables:\n"
            "   PAAPI_ACCESS_KEY=tu_access_key\n"
            "   PAAPI_SECRET_KEY=tu_secret_key\n"
            "   PAAPI_PARTNER_TAG=tu_partner_tag\n\n"
            "3. Obtener credenciales en: https://afiliados.amazon.es/\n\n"
            "Mientras tanto, usa mode='mock' para datos de prueba."
        )

    # TODO: Implementar llamada real a PA-API
    # Descomentar cuando instales paapi5-python-sdk:
    """
    try:
        from paapi5_python_sdk.api.default_api import DefaultApi
        from paapi5_python_sdk.get_items_request import GetItemsRequest
        from paapi5_python_sdk.get_items_resource import GetItemsResource
        from paapi5_python_sdk.partner_type import PartnerType
        from paapi5_python_sdk.rest import ApiException
        
        # Configurar API
        default_api = DefaultApi(
            access_key=pa_access_key,
            secret_key=pa_secret,
            host='webservices.amazon.es',  # Cambiar según tu región
            region='eu-west-1'
        )
        
        # Recursos que queremos obtener
        get_items_resource = [
            GetItemsResource.ITEMINFO_TITLE,
            GetItemsResource.ITEMINFO_BYLINEINFO,
            GetItemsResource.ITEMINFO_CONTENTINFO,
            GetItemsResource.IMAGES_PRIMARY_LARGE,
            GetItemsResource.OFFERS_LISTINGS_PRICE,
            GetItemsResource.CUSTOMERREVIEWS_STARRATING,
            GetItemsResource.CUSTOMERREVIEWS_COUNT
        ]
        
        # Crear request
        get_items_request = GetItemsRequest(
            partner_tag=pa_partner_tag,
            partner_type=PartnerType.ASSOCIATES,
            marketplace='www.amazon.es',
            item_ids=asins,
            resources=get_items_resource
        )
        
        # Hacer la llamada
        response = default_api.get_items(get_items_request)
        
        # Parsear respuesta
        products = []
        if response.items_result and response.items_result.items:
            for item in response.items_result.items:
                product = {
                    "asin": item.asin,
                    "id": item.asin,
                    "title": item.item_info.title.display_value if item.item_info and item.item_info.title else "Sin título",
                    "brand": item.item_info.by_line_info.brand.display_value if (item.item_info and item.item_info.by_line_info and item.item_info.by_line_info.brand) else "Desconocido",
                    "price": item.offers.listings[0].price.amount if (item.offers and item.offers.listings and len(item.offers.listings) > 0) else 0,
                    "currency": item.offers.listings[0].price.currency if (item.offers and item.offers.listings and len(item.offers.listings) > 0) else "EUR",
                    "rating": item.customer_reviews.star_rating.value if (item.customer_reviews and item.customer_reviews.star_rating) else 0,
                    "reviews_count": item.customer_reviews.count if item.customer_reviews else 0,
                    "category": "audio",  # Ajustar según categoría real
                    "subcategory": "auriculares",
                    "affiliate_link": item.detail_page_url if item.detail_page_url else f"https://www.amazon.es/dp/{item.asin}?tag={pa_partner_tag}",
                    "stock": "in_stock",
                    "description": item.item_info.content_info.edition.display_value if (item.item_info and item.item_info.content_info and item.item_info.content_info.edition) else "",
                    "image": item.images.primary.large.url if (item.images and item.images.primary and item.images.primary.large) else ""
                }
                products.append(product)
        
        return products
        
    except ApiException as e:
        raise RuntimeError(f"Error en PA-API: {e}")
    except ImportError:
        raise RuntimeError(
            "SDK de PA-API no instalado.\n"
            "Ejecuta: pip install paapi5-python-sdk\n"
            "Documentación: https://webservices.amazon.es/paapi5/documentation/quick-start/python-sdk.html"
        )
    """
    
    # Por ahora, retornar error informativo
    raise NotImplementedError(
        "🚧 Integración PA-API lista para implementar.\n\n"
        "Pasos siguientes:\n"
        "1. pip install paapi5-python-sdk\n"
        "2. Descomentar código de implementación en esta función\n"
        "3. Configurar variables de entorno\n"
        "4. Probar con ASINs reales\n\n"
        "Mientras tanto, usa mode='mock' en el frontend."
    )


@app.route("/generate-excel", methods=["POST"])
def generate_excel():
    data = request.get_json(force=True)

    # If client provides raw products, use them directly
    if data.get("products"):
        products = data.get("products")
    else:
        mode = data.get("mode", "mock")
        asins = data.get("asins", []) or []

        if mode == "mock":
            products = [build_mock_product(asin) for asin in (asins if asins else [f"MOCK-{i+1}" for i in range(5)])]
        elif mode == "amazon":
            try:
                products = fetch_products_from_amazon(asins)
            except Exception as e:
                # Provide useful diagnostic response to the frontend
                return jsonify({"error": str(e)}), 501
        else:
            return jsonify({"error": f"Unknown mode: {mode}"}), 400

    bio = generate_excel_bytes(products)
    timestamp = int(time.time())
    filename = f"products_{timestamp}.xlsx"

    return send_file(
        bio,
        as_attachment=True,
        download_name=filename,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


if __name__ == "__main__":
    # Run on port 8000 to match frontend default in the React page
    app.run(host="0.0.0.0", port=8000, debug=True)
