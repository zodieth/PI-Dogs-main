const { Router } = require("express");
const axios = require("axios");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/dogs", async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      const dogs = await axios.get("https://api.thedogapi.com/v1/breeds");

      const breeds = dogs.data.map((d) => {
        return {
          name: d.name,
          img: d.image.url,
          temperament: d.temperament,
          weight: d.weight,
        };
      });

      res.json(breeds);
    } else if (name) {
      const dogsName = await axios.get(
        `https://api.thedogapi.com/v1/breeds/search?q=${name}`
      );

      const breedsName = dogsName.data.map((d) => {
        return {
          name: d.name,
          img: d.image.url,
          temperament: d.temperament,
          weight: d.weight,
        };
      });

      res.json(dogsName);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
