const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3008;
const URI = process.env.MONGODB_URISTRING;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(URI);
    await client.connect();
       return client;
  }
  catch (error) {
    console.error('Error al conectar con MongoDB', error);
       return null;
  }
}

app.get('/pozos', async (req, res) => {
  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
  }

  try {
    const collection = client.db('PozosPetroleros').collection('Pozos');
    const pozos = await collection.find({}).toArray();
       res.status(200).json(pozos);
  }
  catch (error) {
    console.error(error);
       res.status(500).send('Error al obtener los pozos');
  }
  finally {
    await client.close();
  }
});

app.get('/pozos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
     if (isNaN(id)) {
       return res.status(400).send('El ID debe ser un número entero');
  }
  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
  }
  try {
    const collection = client.db('PozosPetroleros').collection('Pozos');
    const pozo = await collection.findOne({ id });
       if (!pozo) {
         return res.status(404).send('Pozo no encontrado');
    }
    res.status(200).json(pozo);
  }
  catch (error) {
    console.error(error);
       res.status(500).send('Error en el servidor');
  }
  finally {
    await client.close();
  }
});

app.post('/pozos', async (req, res) => {
  const nuevoPozo = req.body;
     if (nuevoPozo === undefined) {
        return res.status(400).send('Error en el formato de datos a crear');
     }

  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
     }

  try {
    const collection = client.db('PozosPetroleros').collection('Pozos');
    const existente = await collection.findOne({ id: nuevoPozo.id });
       if (existente) {
         return res.status(409).send('Ya existe un pozo con ese id');
    }
    await collection.insertOne(nuevoPozo);
    console.log('Nuevo pozo creado');
       res.status(201).json(nuevoPozo);
  }
  catch (error) {
    console.error(error);
       res.status(500).send('Error al crear el pozo');
  }
  finally {
    await client.close();
  }
});

app.put('/pozos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
     if (isNaN(id)) {
       return res.status(400).send('El ID debe ser un número entero');
  }

  const nuevosDatos = req.body;
     if (!nuevosDatos) {
       return res.status(400).send('Error en el formato de datos recibido');
     }
  
  delete nuevosDatos._id; // Como MongoDB no permite modificar el _id si lo incluimos en el body nos va a rechazar.
  delete nuevosDatos.id; // Como la URL busca por ID, si intentamos modificarla vamos a crear un conflicto.

  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
     }

  try {
    const collection = client.db('PozosPetroleros').collection('Pozos');
    const resultado = await collection.updateOne({ id }, { $set: nuevosDatos });
       if (resultado.matchedCount === 0) {
         return res.status(404).send('No se encontró el pozo con el ID proporcionado');
    }
    console.log('Pozo modificado.');
       res.status(200).json(nuevosDatos);
  }
  catch (error) {
    console.error(error);
       res.status(500).send('Error al modificar el pozo');
  }
  finally {
    await client.close();
  }
});

app.delete('/pozos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
     if (isNaN(id)) {
       return res.status(400).send('El ID debe ser un número entero.');
  }

  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
     }

  try {
    const collection = client.db('PozosPetroleros').collection('Pozos');
    const resultado = await collection.deleteOne({ id });
    if (resultado.deletedCount === 0) {
      return res.status(404).send(`No se encontró pozo con el ID proporcionado: ${id}`);
    }
       console.log('Pozo eliminado.');
         res.status(204).send();
  }
  catch (error) {
       console.error(error);
         res.status(500).send('Se produjo un error al intentar eliminar el pozo.');
  }
  finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});