# PokéDex

Aplicación móvil desarrollada con **React Native** y **Expo** que consume la **PokéAPI**, permitiendo listar Pokémon de forma paginada (scroll infinito), buscarlos por nombre o número, y ver su ficha técnica detallada.

## Carpetas y arquitectura

El proyecto está estructurado separando la lógica de red, los componentes visuales y las pantallas para mantener un código limpio y modular:

pokemonAPI/
|
|____pokedex-explorer/
    │
    ├── assets/                  # Recursos estáticos (iconos, imágenes)
    ├── src/
    │   ├── components/
    │   │   └── PokemonCard.js   # Componente de tarjeta para la vista x2 (imagen, ID y nombre)
    │   ├── screens/
    │   │   ├── HomeScreen.js    # Vista principal (buscador, lista en 2 columnas y scroll infinito)
    │   │   └── DetailScreen.js  # Vista de detalle (tipos con colores, medidas y estadísticas con barras)
    │   ├── services/
    │   │   └── pokeAPI.js       # Capa de red: peticiones fetch, paginación y mapeo de datos de la PokéAPI
    │   └── theme/
    │       └── colors.js        # Paleta de colores y estilos globales de la aplicación
    │
    ├── App.js                   # Configuración principal de la navegación (React Navigation Stack)
    ├── app.json                 # Configuración de Expo
    └── package.json             # Dependencias del proyecto