# 🧪 Vue Pokedex — Global66 Technical Test

This project is a technical challenge developed for Global66. The app is a scalable, modular Pokédex built with Vue 3 and modern best practices, focusing on performance, architectural clarity, and maintainability.

## 🔗 Demo en vivo

Puedes ver la aplicación desplegada en GitHub Pages aquí:

👉 [https://ws-jedp.github.io/global66-technical-test/](https://ws-jedp.github.io/global66-technical-test/)

## 🚀 Stack & Key Technologies

| Tool/Librería               | Por qué la elegí                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------- |
| **Vue 3 + Composition API** | Permite un código más limpio, modular y preparado para escalar                     |
| **TypeScript**              | Mejora la mantenibilidad y reduce errores en producción gracias al tipado          |
| **Vue Query**               | Ideal para manejar grandes volúmenes de datos, paginación, cache, y loading states |
| **Pinia**                   | Gestión simple y efectiva del estado global (favoritos), más ligero que Vuex       |
| **Vue Virtual Scroller**    | Mejora el rendimiento al renderizar solo los elementos visibles en pantalla        |
| **TailwindCSS**             | Utilidad de estilos rápida, altamente flexible y lista para escalar                |
| **GSAP**                    | Para animaciones fluidas y controladas en componentes clave del UI                 |
| **Vitest**                  | Framework moderno y rápido para pruebas unitarias                                  |

---

## 🎨 ¿Por qué TailwindCSS y no Vuetify?

Aunque muchos desarrolladores optan por frameworks UI como Vuetify en proyectos grandes (y tienen sus ventajas), decidí usar **TailwindCSS** por varias razones estratégicas:

- **Flexibilidad total** para definir estilos únicos que se alineen con el tono y propósito visual de la marca.
- **Control absoluto del diseño** sin depender de componentes prediseñados que luego hay que sobreescribir o limitar.
- **Escalabilidad realista** cuando se estructura correctamente con componentes reutilizables, diseño por tokens y buenas prácticas.
- **Velocidad de desarrollo** con clases utilitarias que hacen explícito el diseño en el markup.

Creo firmemente que con un enfoque correcto y una arquitectura de componentes clara, **TailwindCSS puede ofrecer resultados tan sólidos como Vuetify**, pero con más libertad creativa para personalizar el producto.

---

## 📐 Arquitectura del proyecto

La aplicación fue diseñada pensando en escalabilidad y modularidad. Cada responsabilidad está separada en carpetas específicas:

- `composables/` → Lógica reutilizable como `useHomePage`
- `store/` → Favoritos y término de búsqueda gestionados con Pinia
- `pages/` → Home y Favorites
- `components/` → Componentes UI atómicos y reutilizables
- `containers/` → Componentes intermedios que agrupan lógica visual y componentes
- `services/` → Abstracción de peticiones a la API
- `test/` → Pruebas unitarias escritas con Vitest
- `router/` → Navegación entre páginas
- `types/` → Tipado estricto de datos

---

## 🧠 Enfoque técnico

Aunque la aplicación podría haberse hecho con fetch o axios simple, decidí usar **Vue Query** porque:

- Se ajusta mejor al escenario planteado: “piensa como si hubiera una gran cantidad de datos”.
- Optimiza la performance con **cache**, **fetching incremental**, y **revalidación automática**.
- Permite implementar un `InfiniteScroll` profesional y realista.

---

## ✅ Testing: un enfoque honesto

Quiero ser completamente transparente: gran parte de los tests fueron generados con **GitHub Copilot**.

Sin embargo:

- Entiendo cómo funciona **Vitest** y cómo se estructuran los tests unitarios en Vue.
- Validé y ajusté cada test generado por Copilot.
- Me aseguré de comprender cada línea antes de dejarla en el código.

Este proceso me ayudó a fortalecer mi conocimiento práctico y conceptual de testing en Vue.

---

## 🙌 Reflexión personal

Esta prueba fue una experiencia retadora y divertida. Me permitió aplicar conocimientos avanzados de arquitectura frontend en un contexto realista, optimizando una app aparentemente simple para escalar y rendir como una aplicación profesional.

---

## ✨ ¿Por qué me emociona la idea de trabajar en Global66?

Sigo desde hace tiempo la visión y evolución de Global66, y me encanta su propósito de **transformar las finanzas en Latinoamérica** a través de tecnología útil, inclusiva y con impacto real.

La posibilidad de aportar con mis conocimientos técnicos a una empresa que combina propósito, innovación y escala internacional **me entusiasma profundamente**.

Mi motivación nace de un lugar muy personal: **AMO profundamente América Latina**. Creo firmemente en el potencial de nuestra región para **transformar el mundo** si apostamos por el talento, la educación y la tecnología como herramientas de progreso.

Global66 representa esa visión: una empresa que rompe fronteras y trabaja para liberar el potencial humano, empoderando a millones de personas con soluciones reales. Quiero ser parte activa de ese cambio.

Estoy listo para aprender, aportar valor desde el día uno, y crecer junto a un equipo de alto impacto.

> ¡Gracias por revisar este proyecto! Espero poder sumar mi energía, experiencia y compromiso al equipo 💙🌍
