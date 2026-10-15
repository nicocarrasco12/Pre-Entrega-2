# Pre-Entrega 2: Gestión de Pozos Petroleros

## 📑 Sumario
  - [🛠️ Librerías y Dependencias](#️-librerías-y-dependencias)
  - [⚙️ Configuración y Ejecución Local](#️-configuración-y-ejecución-local)
  - [📋 Endpoints de la API (CRUD)](#-endpoints-de-la-api-crud)
  - [💡 Ejemplos de Estructuras de Datos](#-ejemplos-de-estructuras-de-datos)
    - [Ejemplo 1: Estructura para registrar un nuevo pozo (`POST`)](#ejemplo-1-estructura-para-registrar-un-nuevo-pozo-post)
    - [Ejemplo 2: Estructura para modificar un pozo existente (`PUT`)](#ejemplo-2-estructura-para-modificar-un-pozo-existente-put)


## 🛠️ Librerías y Dependencias
- **Node.js**
- **Express**
- **MongoDB**
- **Dotenv**
- **Nodemon**


## ⚙️ Configuración y Ejecución Local
1. Crear una cuenta en **MongoDB Atlas** y crear un nuevo proyecto.
2. Descargar **MongoDB Compass** y vincularlo a **Atlas** mediante tu URI.
3. Clonar el repositorio en tu computadora.
4. Instalar las dependencias del proyecto ejecutando en la terminal:
```bash
   npm install
```

1. Crear un archivo llamado `.env` en la raíz del proyecto y configurar las variables de entorno de la siguiente manera:
```env
PORT=3008
MONGODB_URISTRING=tu_URI_atlas
```

1. Iniciar el servidor mediante nodemon:
```bash
nodemon
```


## 📋 Endpoints del CRUD

| Método | Endpoint | Descripción |
| --- | --- | --- |
| **GET** | `/pozos` | Devuelve un listado con todos los pozos petroleros registrados. |
| **GET** | `/pozos/:id` | Busca y devuelve un pozo específico utilizando su ID. |
| **POST** | `/pozos` | Crea un nuevo pozo a partir de los datos enviados en el body en formato JSON. |
| **PUT** | `/pozos/:id` | Modifica los datos de un pozo existente buscando por su ID. |
| **DELETE** | `/pozos/:id` | Elimina un pozo utilizando su ID. |


## 💡 Ejemplos de Estructuras de Datos

### Ejemplo 1: Registrar un nuevo pozo (`POST`)

```json
{
  "id": 5,
  "codigo": "POZO-NQN-05",
  "ubicacion": "Cuenca Neuquina",
  "estado": "En Producción",
  "fechaPuestaProduccion": "2024-05-12",
  "profundidadMetros": 2850,
  "produccionDiariaBarriles": 450
}
```

### Ejemplo 2: Modificar un pozo existente (`PUT`)

```json
{
  "estado": "En Mantenimiento",
  "produccionDiariaBarriles": 0
}
```