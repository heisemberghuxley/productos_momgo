const express = require("express");
const morgan = require("morgan");
const mongoose = require("./database"); // Importa la conexión a MongoDB
const cors = require("cors");

const app = express();
app.set("port", 4000);

app.listen(app.get("port"), () => {
    console.log("Escuchando comunicaciones al puerto " + app.get("port"));
});

app.use(
    cors({
        origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"],
    })
);
app.use(morgan("dev"));
app.use(express.json());

const Productos = mongoose.model("Producto", {
    name: String,
    price: Number,
    url_image: String,
});

app.get("/productos", async (req, res) => {
    try {
        const productos = await Productos.find();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

app.post("/productos", async (req, res) => {
    const { name, price, url_image } = req.body;

    if (!name || !price || !url_image) {
        return res
            .status(400)
            .json({
                mensaje: "Se requieren todos los campos: nombre, precio y descripción",
            });
    }

    try {
        const nuevoProducto = new Productos({ name, price, url_image });
        const productoGuardado = await nuevoProducto.save();

        res
            .status(201)
            .json({
                mensaje: "Producto creado exitosamente",
                productoId: productoGuardado._id,
            });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});
