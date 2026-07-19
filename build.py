#!/usr/bin/env python3
"""
Generador del sitio estático de Artes Marciales Bilbao.

Uso:
    python build.py

Lee el contenido de content/*.yaml y las plantillas de templates/,
y genera el sitio estático listo para subir a IONOS en la carpeta output/.
"""
import shutil
from pathlib import Path
from datetime import date

import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).parent
OUT = ROOT / "output"
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
CONTENT = ROOT / "content"

# --- Cargar contenido -------------------------------------------------------
def load_yaml(name):
    with open(CONTENT / name, encoding="utf-8") as f:
        return yaml.safe_load(f)

data = load_yaml("site.yaml")
data["pages"] = load_yaml("pages.yaml")

# Páginas a generar:  plantilla -> (archivo de salida, clave 'active' del menú)
PAGES = {
    "index.html":            ("index.html",            "home"),
    "sambo.html":            ("sambo.html",            "sambo"),
    "defensa-personal.html": ("defensa-personal.html", "defensa"),
    "manual.html":           ("manual.html",           "manual"),
    "contacto.html":         ("contacto.html",         "contacto"),
    "gracias.html":          ("gracias.html",          None),
    "privacidad.html":       ("privacidad.html",       None),
}

env = Environment(
    loader=FileSystemLoader(str(TEMPLATES)),
    autoescape=select_autoescape(["html"]),
    trim_blocks=True, lstrip_blocks=True,
)

def build():
    # Limpiar y recrear output/
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    # Copiar estáticos (css, js, img, downloads) a la raíz de output/
    for sub in ("css", "js", "img", "downloads"):
        src = STATIC / sub
        if src.exists():
            shutil.copytree(src, OUT / sub)

    # Renderizar páginas
    for tpl_name, (out_name, active) in PAGES.items():
        tpl = env.get_template(tpl_name)
        html = tpl.render(active=active, page_url="/" + out_name, **data)
        (OUT / out_name).write_text(html, encoding="utf-8")
        print(f"  ✓ {out_name}")

    write_seo_files()
    write_htaccess()
    print(f"\n✅ Sitio generado en: {OUT}")

def write_seo_files():
    domain = data["site"]["domain"]
    today = date.today().isoformat()
    urls = ["/", "/sambo.html", "/defensa-personal.html", "/manual.html", "/contacto.html"]
    items = "\n".join(
        f"  <url><loc>{domain}{u}</loc><lastmod>{today}</lastmod></url>" for u in urls
    )
    sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
               f"{items}\n</urlset>\n")
    (OUT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    (OUT / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\nSitemap: {domain}/sitemap.xml\n", encoding="utf-8")
    print("  ✓ sitemap.xml, robots.txt")

def write_htaccess():
    """Redirecciones 301 desde las URLs viejas de Joomla + reglas básicas."""
    ht = """# --- Artes Marciales Bilbao : configuración Apache (IONOS) ---
Options -Indexes
DirectoryIndex index.html

# Forzar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Forzar www (opcional; comenta si no quieres www)
RewriteCond %{HTTP_HOST} !^www\\. [NC]
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]

# Redirecciones 301 desde las URLs viejas de Joomla (conserva el SEO)
Redirect 301 /index.php/sambo /sambo.html
Redirect 301 /index.php/defensa-personal-femenina /defensa-personal.html
Redirect 301 /index.php/contacto /contacto.html
Redirect 301 /index.php /

# Página 404 (opcional: crea 404.html)
# ErrorDocument 404 /404.html

# Cache de estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
</IfModule>

# Compresión
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
"""
    (OUT / ".htaccess").write_text(ht, encoding="utf-8")
    print("  ✓ .htaccess (redirecciones 301 + HTTPS)")

if __name__ == "__main__":
    print("Generando sitio…")
    build()
