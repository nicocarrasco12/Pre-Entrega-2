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
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    return null;
  }
}

app.get('/pozos', async (req, res) => {
  const client = await connectToMongoDB();
  if (!client) {
    return res.status(500).send('Error al conectarse a MongoDB');
  }

  const collection = client.db('PozosPetroleros').collection('Pozos');
  collection.find({}).toArray()
    .then((pozos) => {
      res.status(200).json(pozos);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error al obtener los pozos');
    })
    .finally(() => {
      client.close();
    });
});

app.get('/pozos/:id', async (req, res) => {
  const id = req.params.id;
  const client = await connectToMongoDB();
  if (!client) {
    return res.status(500).send('Error al conectarse a MongoDB');
  }

  const collection = client.db('PozosPetroleros').collection('Pozos');
  collection.findOne({ id: parseInt(id) })
    .then((pozo) => {
      if (!pozo) {
        return res.status(404).send('Pozo no encontrado.');
      }
      res.status(200).json(pozo);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error en el servidor.');
    })
    .finally(() => {
      client.close();
    });
});

app.post('/pozos', async (req, res) => {
  const nuevoPozo = req.body;
     if (nuevoPozo === undefined) {
    return res.status(400).send('Error en el formato de datos a crear.');
     }

  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
     }

  const collection = client.db('PozosPetroleros').collection('Pozos');
       collection.insertOne(nuevoPozo)
       .then(() => {
         console.log('Nuevo pozo creado.');
         res.status(201).send(nuevoPozo);
    })
    .catch((error) => {
      console.error(error);
         res.status(500).send('Error al crear el pozo.');
    })
    .finally(() => {
      client.close();
    });
});

app.put('/pozos/:id', async (req, res) => {
  const id = req.params.id;
  const nuevosDatos = req.body;

     if (!nuevosDatos) {
       return res.status(400).send('Error en el formato de datos recibido.');
     }

  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
     }

  const collection = client.db('PozosPetroleros').collection('Pozos');
  collection.updateOne({ id: parseInt(id) }, { $set: nuevosDatos })
    .then((resultado) => {
      if (resultado.matchedCount === 0) {
        return res.status(404).send('No se encontró el pozo con el ID proporcionado.');
      }
      console.log('Pozo modificado.');
      res.status(200).send(nuevosDatos);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ descripcion: 'Error al modificar el pozo' });
    })
    .finally(() => {
      client.close();
    });
});

app.delete('/pozos/:id', async (req, res) => {
  const id = req.params.id;
     if (!id) {
       return res.status(400).send('El formato de datos es erróneo o inválido.');
     }

  const client = await connectToMongoDB();
     if (!client) {
       return res.status(500).send('Error al conectarse a MongoDB');
     }

  const collection = client.db('PozosPetroleros').collection('Pozos');
  collection.deleteOne({ id: parseInt(id) })
    .then((resultado) => {
      if (resultado.deletedCount === 0) {
        return res.status(404).send(`No se encontró pozo con el ID proporcionado: ${id}`);
      } else {
        console.log('Pozo eliminado.');
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Se produjo un error al intentar eliminar el pozo.');
    })
    .finally(() => {
      client.close();
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});