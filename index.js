import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 GET → actividad aleatoria
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    res.render("index.ejs", { data: response.data, error: null });
  } catch (error) {
    res.render("index.ejs", { data: null, error: "Error fetching random activity." });
  }
});

// 🔹 POST → actividades filtradas
app.post("/", async (req, res) => {
  try {
    const { type, participants } = req.body;

    let url = `https://bored-api.appbrewery.com/filter?type=${type}`;
    if (participants > 0) url += `&participants=${participants}`;

    const response = await axios.get(url);

    // Si la respuesta no tiene resultados
    if (!response.data || response.data.length === 0) {
      return res.render("index.ejs", {
        data: null,
        error: "No activities match your criteria.",
      });
    }

    // Toma una actividad aleatoria del arreglo
    const randomActivity = response.data[Math.floor(Math.random() * response.data.length)];

    // Renderizamos la actividad aleatoria
    res.render("index.ejs", { data: randomActivity, error: null });

  } catch (error) {
    res.render("index.ejs", {
      data: null,
      error: "Failed to fetch filtered activities.",
    });
  }
});

app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));
