# Guía Editorial — El Humboldtiano

> Esta guía es para editores, redactores y colaboradores que publican contenido en El Humboldtiano. No necesitás saber de programación.

## Tabla de contenidos

- [Acceso al CMS](#acceso-al-cms)
- [Crear un artículo paso a paso](#crear-un-artículo-paso-a-paso)
- [Campos del artículo](#campos-del-artículo)
- [Categorías](#categorías)
- [Etiquetas (tags)](#etiquetas-tags)
- [Flujo editorial](#flujo-editorial)
- [Artículo destacado](#artículo-destacado)
- [Estándares de contenido](#estándares-de-contenido)
- [Preguntas frecuentes](#preguntas-frecuentes)

## Acceso al CMS

1. Andá al sitio desplegado: `https://el-humboldtiano.vercel.app/admin`
2. Iniciá sesión con tu cuenta de GitHub (te pedirá autorizar la aplicación)
3. Vas a ver el panel con los artículos existentes

## Crear un artículo paso a paso

1. En el panel, hacé clic en "Artículos" → "Nuevo Artículo"
2. Completá los campos (explicados abajo)
3. Guardá como "Borrador" mientras trabajás
4. Cuando esté listo, cambiá el estado a "En revisión" y avisale a tu editor
5. El editor revisará, hará correcciones si hacen falta, y cambiará el estado a "Listo"

## Campos del artículo

| Campo                | Qué es                         | Requerido | Tips                                                                      |
| -------------------- | ------------------------------ | --------- | ------------------------------------------------------------------------- |
| Título               | El nombre del artículo         | Sí        | Máximo 120 caracteres. Claro y atractivo.                                 |
| Categoría            | La sección del periódico       | Sí        | Elegí UNA. Ver [Categorías](#categorías).                                 |
| Etiquetas            | Temas específicos del artículo | No        | Elegí hasta 5. Ver [Etiquetas](#etiquetas-tags).                          |
| Autor                | Quién escribió la nota         | Sí        | Podés poner tu nombre o "Redacción El Humboldtiano"                       |
| Fecha de publicación | Cuándo aparece en el sitio     | Sí        | Elegí fecha y hora. El artículo no se publica automáticamente; es manual. |
| Imagen de portada    | Foto principal del artículo    | No        | Preferiblemente horizontal, buena calidad.                                |
| Resumen              | Breve descripción              | No        | Aparece en la portada y en Google. ¡Usalo!                                |
| Destacado            | ¿Va como artículo principal?   | No        | Solo UN artículo debería tener esto en "true".                            |
| Estado               | Etapa del artículo             | Sí        | Ver [Flujo editorial](#flujo-editorial).                                  |
| Cuerpo               | El texto completo              | Sí        | Escribí en Markdown. Podés usar títulos, listas, negritas, citas.         |

## Categorías

Elegí UNA categoría por artículo.

| Categoría              | De qué se trata                                                                               | Ejemplos                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Vida Universitaria** | Todo lo que pasa en la UAH: eventos, clases, clubes, deportes, emprendimientos estudiantiles. | Feria de emprendimiento, torneo deportivo, nuevo club.           |
| **Huellas**            | Perfiles, venezolanos en el exterio e interior del pais.                                      | Entrevista a un egresado exitoso, descubrimiento de una tesis.   |
| **Ciudad y Arte**      | Cultura urbana, arte, teatro, cine, música, literatura en Caracas y Venezuela.                | Reseña de una obra de teatro, mural nuevo en la ciudad.          |
| **En Radar**           | Actualidad, tendencias, tecnología, economía, ciencia, noticias internacionales.              | Nueva ley que afecta a estudiantes, avance científico relevante. |

## Etiquetas (tags)

Elegí hasta 5 etiquetas. Agrupalas por temática para que tengan sentido.

### Arte y cultura

- **Música** — Conciertos, artistas, géneros, reseñas musicales.
- **Cine** — Películas, festivales, reseñas cinematográficas.
- **Arte Urbano** — Murales, grafiti, intervenciones en espacios públicos.
- **Teatro** — Obras, elencos, reseñas teatrales.
- **Literatura** — Libros, autores, reseñas literarias, poesía.

### Entretenimiento

- **Videojuegos** — Lanzamientos, e-sports, cultura gamer.
- **Indie** — Producciones independientes (cine, música, arte).

### Geografía y contexto

- **Urbano** — Dinámicas de la ciudad, movilidad, espacios públicos.
- **Caracas** — Notas específicas sobre la capital.
- **Internacional** — Temas globales o de otros países.
- **Europa** — Noticias o cultura del continente europeo.
- **Latinoamérica** — Noticias o cultura de la región.
- **Norteamérica** — Noticias o cultura de EE.UU. o Canadá.

### Vida académica

- **Emprendimiento** — Proyectos estudiantiles, startups, negocios.
- **Investigación** — Trabajos de investigación, tesis, papers.
- **Egresados** — Historias y logros de exalumnos.
- **Clubes** — Actividades de clubes y asociaciones estudiantiles.
- **Administrativo** — Trámites, reglamentos, comunicados oficiales de la universidad.
- **Deportes** — Eventos deportivos, atletas, competencias.

### Conocimiento general

- **Ciencia** — Avances científicos, divulgación, tecnología aplicada.
- **Economía** — Finanzas, mercado, política económica.
- **Tecnología** — Gadgets, apps, inteligencia artificial, innovación.
- **Historia** - Contexto histórico, memoria institucional, efemérides.

## Flujo editorial

Los artículos pasan por tres estados:

1. **Borrador** — Estás escribiendo. Podés guardar y volver después.
2. **En revisión** — Terminaste tu borrador. Avisale a tu editor para que lo revise. NO se publica automáticamente.
3. **Listo** — El editor aprobó el artículo. Está listo para ser publicado en el sitio (la publicación es manual por parte del equipo técnico).

> **Importante:** El CMS NO publica automáticamente. El estado es una etiqueta interna. Para publicar, el equipo técnico debe hacer el deploy.

## Artículo destacado

El campo **Destacado** hace que un artículo aparezca como principal en la portada.

- Solo UN artículo debería estar destacado a la vez.
- Si marcás uno nuevo como destacado, avisale al equipo para que desmarquen el anterior.
- Usalo para la noticia más importante del momento.

## Estándares de contenido

### Tono

- Periodístico, objetivo pero cercano.
- Incluí citas y testimonios cuando sea posible.
- Evitá el lenguaje excesivamente académico o, por el contrario, muy informal.

### Extensión

- Notas cortas: 300–500 palabras.
- Artículos medianos: 500–1.000 palabras.
- Reportajes o entrevistas: 1.000–2.000 palabras.

### Imágenes

- Usá imágenes propias o con permiso/licencia.
- Preferiblemente horizontales (landscape) para la portada.
- Nombrá los archivos descriptivamente: `feria-emprendimiento-2026.jpg`
- Subilas directamente en el campo "Imagen de portada" del CMS.

## Preguntas frecuentes

**¿Puedo editar un artículo ya publicado?**
Sí, pero avisale al equipo técnico para que hagan un nuevo deploy.

**¿Cuántas etiquetas puedo poner?**
Hasta 5. Elige las más relevantes.

**¿Puedo poner un artículo en dos categorías?**
No, el sistema solo permite una. Elegí la que mejor represente el tema principal.

**¿El artículo se publica solo al poner "Listo"?**
No. "Listo" significa que está aprobado editorialmente. La publicación en el sitio web la hace el equipo técnico con un deploy.

**¿Dónde subo las imágenes?**
En el campo "Imagen de portada" del CMS. Se guardan en `public/img/`.

**¿Cómo pongo negritas, listas o títulos en el cuerpo?**
El campo "Cuerpo" usa Markdown. Podés usar:

- `# Título grande`, `## Subtítulo`
- `**negrita**`
- `- item de lista`
- `> cita`
