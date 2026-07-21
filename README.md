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

### Opción A — MailerLite (✅ YA CONFIGURADA Y ACTIVA)
Ya está funcionando con tu cuenta (`2521369`) y tu formulario (`PttuCZ`): `provider: "mailerlite"` en `content/site.yaml`. El formulario embebido aparece en la página del manual y el script de MailerLite se carga solo en esa página. Si algún día cambias de formulario o de cuenta, solo tienes que actualizar esos dos valores en `content/site.yaml` y volver a ejecutar `python build.py`. Los pasos originales, por si los necesitas:

1. Crea una cuenta en mailerlite.com.
2. Crea un **grupo** (p. ej. "Manual defensa personal") y un **formulario embebido** (Embedded form) con los campos Nombre y Email. Activa la casilla de consentimiento RGPD del propio formulario.
3. Crea una **automatización**: *cuando alguien se une al grupo/formulario → enviar un email con el manual en PDF adjunto o con el enlace de descarga*. (Si prefieres, sube el PDF a `static/downloads/` y enlázalo desde ese email.)
4. En los ajustes del formulario, pon como **acción de éxito** una redirección a `https://www.artesmarcialesbilbao.com/gracias.html`.
5. Abre el código del formulario en MailerLite. Verás dos datos:
   - En el script: `ml('account', '123456')` → ese número es tu **account**.
   - En el div: `<div class="ml-embedded" data-form="a1b2c3">` → ese código es tu **form**.
6. En `content/site.yaml`, dentro de `lead_magnet`, pon:
   ```yaml
   provider: "mailerlite"
   mailerlite_account: "123456"
   mailerlite_form: "a1b2c3"
   ```
7. `python build.py` y sube de nuevo. Listo: el formulario embebido aparece en la página del manual y el PDF se envía solo. (No hace falta tocar ningún HTML; el script de MailerLite se carga automáticamente al poner esos datos.)

> El aspecto del formulario (colores, tipografía, fondo) se ajusta dentro del editor de MailerLite. Para que encaje con la web, usa fondo transparente o claro y el rojo `#D8382B` en el botón.

### Opción B — Formspree (rápido, te llega el email a tu correo)
1. Crea un formulario en formspree.io y copia tu ID (algo como `xayzabcd`).
2. En `content/site.yaml`: `provider: "formspree"` y `formspree_id: "TU_ID"`.
3. `python build.py`. Cada solicitud te llega a tu correo y tú respondes con el PDF (o configuras autorespuesta en Formspree).

### Opción C — mailto (funciona hoy, sin configurar nada) ← opción por defecto
El botón abre el correo del visitante con el mensaje ya escrito hacia `admin@artesmarcialesbilbao.com`. Tú respondes con el PDF a mano. Es lo que hay activo ahora mismo; sirve para arrancar, pero **para captar lista de verdad usa la opción A**.

> El PDF que quieras enviar puedes dejarlo en `static/downloads/manual-defensa-personal-mujeres.pdf` (ya está referenciado en `site.yaml` → `manual.pdf_file`).

---

## 4b. Aviso de verano (agosto cerrado / inicio de curso)

Hay una barra roja arriba que aparece **automáticamente solo en julio y agosto** (lo decide el navegador del visitante; el resto del año no se ve). Avisa de que en agosto cerráis y de cuándo empieza el curso.

**Cada año hay que actualizar una línea**: en `content/site.yaml`, dentro de `season`, cambia `course_start` a la nueva fecha (el primer lunes o miércoles laborable de septiembre). Ejemplo actual:

```yaml
season:
  course_start: "miércoles 2 de septiembre"
  message: "En agosto cerramos por vacaciones. El nuevo curso comienza el {start} (siempre el primer lunes o miércoles laborable de septiembre)."
```

`{start}` se sustituye solo por la fecha. Luego `python build.py` y subir.

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
