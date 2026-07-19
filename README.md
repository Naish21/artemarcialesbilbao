# Artes Marciales Bilbao — web estática

Web estática (HTML puro) generada con **Python** a partir de plantillas.
Editas texto en un archivo, ejecutas un comando y obtienes una carpeta lista para subir a IONOS.

---

## 1. Qué hay en cada carpeta

```
web/
├── build.py            ← el generador (lo ejecutas tú)
├── requirements.txt    ← dependencias de Python
├── content/
│   ├── site.yaml       ← DATOS: teléfono, email, precios, redes, manual…
│   └── pages.yaml      ← TEXTOS de cada página
├── templates/          ← el HTML (normalmente no hace falta tocarlo)
├── static/             ← css, js, imágenes, PDFs de descarga
└── output/             ← ★ EL SITIO GENERADO — esto es lo que subes a IONOS
```

**Para cambiar textos, precios, horarios, etc.: edita `content/site.yaml` y `content/pages.yaml`.** No necesitas tocar HTML.

---

## 2. Generar la web

Necesitas Python 3.9 o superior. La primera vez:

```bash
pip install -r requirements.txt
```

Cada vez que cambies contenido:

```bash
python build.py
```

Se regenera la carpeta `output/` con todas las páginas, el `sitemap.xml`, el `robots.txt` y el `.htaccess`.

Para verlo en tu ordenador antes de subirlo:

```bash
cd output
python -m http.server 8000
# abre http://localhost:8000
```

---

## 3. Subir a IONOS (sustituir el Joomla)

Tu web se sirve por FTP/SFTP. Con un cliente como **FileZilla**:

1. Haz **copia de seguridad** de lo que tengas ahora en el servidor (por si acaso).
2. Conéctate con los datos FTP que te da IONOS (host, usuario, contraseña).
3. Sube **todo el contenido de la carpeta `output/`** (no la carpeta, su contenido) a la raíz web (normalmente la carpeta que ves al conectar, a veces `/` o `htdocs`).
4. Asegúrate de subir también los archivos ocultos **`.htaccess`** (activa "mostrar archivos ocultos" en FileZilla).
5. Como la web nueva usa `index.html` y el Joomla usaba `index.php`, conviene borrar del servidor los archivos viejos de Joomla (o al menos `index.php` y la carpeta de Joomla) para que no haya conflicto. El `.htaccess` ya redirige las URLs antiguas (`/index.php/sambo`, etc.) a las nuevas para no perder posicionamiento en Google.

> IONOS también tiene un gestor de archivos web y la posibilidad de conectar por SFTP. Cualquiera vale.

---

## 4. ★ Regalar el manual en PDF a cambio del email (imán de leads)

La web es estática (sin base de datos), así que el formulario necesita un servicio externo. Tienes tres opciones. Se elige con `lead_magnet.provider` en `content/site.yaml`.

### Opción A — MailerLite (recomendada: crea lista + envía el PDF solo)
Es gratis hasta 1.000 suscriptores y hace justo lo que quieres: la persona deja el email → recibe automáticamente un correo con el PDF → tú te quedas con su email en una lista.

1. Crea cuenta en mailerlite.com y sube tu PDF (o súbelo a `static/downloads/` y usa el enlace).
2. Crea un **formulario embebido** y una **automatización**: "cuando alguien se suscribe → enviar email con el manual".
3. Copia el código embed que te da MailerLite.
4. En `content/site.yaml` pon `provider: "mailerlite"`.
5. Pega el embed dentro de `templates/partials/lead_form.html`, donde pone *"pega aquí el embed de MailerLite"*.
6. `python build.py` y sube de nuevo.

### Opción B — Formspree (rápido, te llega el email a tu correo)
1. Crea un formulario en formspree.io y copia tu ID (algo como `xayzabcd`).
2. En `content/site.yaml`: `provider: "formspree"` y `formspree_id: "TU_ID"`.
3. `python build.py`. Cada solicitud te llega a tu correo y tú respondes con el PDF (o configuras autorespuesta en Formspree).

### Opción C — mailto (funciona hoy, sin configurar nada) ← opción por defecto
El botón abre el correo del visitante con el mensaje ya escrito hacia `admin@artesmarcialesbilbao.com`. Tú respondes con el PDF a mano. Es lo que hay activo ahora mismo; sirve para arrancar, pero **para captar lista de verdad usa la opción A**.

> El PDF que quieras enviar puedes dejarlo en `static/downloads/manual-defensa-personal-mujeres.pdf` (ya está referenciado en `site.yaml` → `manual.pdf_file`).

---

## 5. Incrustar Instagram y Tumblr ("blog" con sensación de actividad)

Los bloques ya están maquetados en `templates/partials/social.html` con un enlace de respaldo. Para incrustar el feed real:

### Instagram (@sambodpbilbao)
Instagram ya no deja incrustar el feed completo directamente; se usa un widget gratuito:
- **LightWidget** (lightwidget.com) o **SnapWidget** (snapwidget.com): conectas tu Instagram, te dan un `<iframe>`.
- Pega ese `<iframe>` en `social.html`, dentro de `id="instagram-slot"`, sustituyendo el bloque de respaldo.

### Tumblr
- En Tumblr: *Configuración → widget/insertar*, o usa un servicio como **Elfsight/Tumblr widget**. También puedes incrustar el blog con un `<iframe src="https://artesmarcialesbilbao.tumblr.com/">`.
- Pégalo en `social.html`, dentro de `id="tumblr-slot"`.

`python build.py` y subir.

---

## 6. Cosas que deberías personalizar antes de publicar

- **Fotos reales**: el diseño funciona sin fotos, pero unas buenas fotos de entrenamientos suben mucho la conversión. Cuando las tengas, dímelo y las integramos (hero, tarjetas, etc.).
- **Aviso legal** (`templates/privacidad.html`): rellena los `[corchetes]` con tu nombre/NIF real. Es obligatorio al recoger emails.
- **Logo**: hay un logo provisional (SVG). Si tienes el tuyo en alta calidad, se sustituye fácil.
- **Analítica** (opcional): si quieres saber cuánta gente entra, se añade Google Analytics o Plausible.

---

## 7. Resumen del flujo de trabajo

```
edito content/*.yaml  →  python build.py  →  subo output/ por FTP a IONOS
```

Cualquier duda, guárdate este README. 💪
