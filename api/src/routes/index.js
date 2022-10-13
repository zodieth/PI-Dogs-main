const { Router } = require("express");
const axios = require("axios");
const { Temper, Dog } = require("../db");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/dogs", async (req, res) => {
  const { name } = req.query;

  const dogs = await axios.get("https://api.thedogapi.com/v1/breeds");

  const dogsName = await axios.get(
    `https://api.thedogapi.com/v1/breeds/search?q=${name}`
  );

  const breedsName = await dogsName.data.map((d) => {
    return {
      name: d.name,
      temperament: d.temperament,
      weight: d.weight,
    };
  });

  try {
    if (name) {
      res.json(breedsName);
    } else {
      const breeds = dogs.data.map((d) => {
        return {
          name: d.name,
          img: d.image.url ? d.image.url : "not found",
          temperament: d.temperament,
          weight: d.weight,
        };
      });

      res.json(breeds);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/dogs/:id", async (req, res) => {
  const { id } = req.params;

  const idApi = await axios.get(`https://api.thedogapi.com/v1/breeds/${id}`);
  const mapId = [];
  mapId.push(idApi.data);

  const data = mapId.map((e) => {
    return {
      name: e.name,
      img: e.image,
      weight: e.weight,
      temperaments: e.temperament,
    };
  });

  try {
    if (id) {
      res.json(data);
    } else {
      res.status(404).send("El id no existe");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/temperaments", async (req, res) => {
  try {
    const temperaments = await Temper.findAll();
    const temperApi = await axios.get("https://api.thedogapi.com/v1/breeds");

    if (!temperaments.length) {
      const info = temperApi.data.map((e) => {
        return {
          temperaments: e.temperament ? e.temperament : "",
        };
      });

      await Temper.bulkCreate(info);
      res.json(info);
      ("temperaments created");
    } else {
      res.json(temperaments);
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/dogs", async (req, res) => {
  const { name, height, weight, years } = req.body;

  try {
    const newDog = await Dog.findOrCreate({
      where: {
        name: name,
        height: height,
        weight: weight,
        years: years,
      },
    });

    res.json(newDog);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
