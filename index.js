const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Configurar Mercado Pago con el Access Token de las variables de entorno de Render
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

// Ruta de prueba para verificar que el servidor responde
app.get('/', (req, res) => {
  res.send('Backend de SI! funcionando correctamente');
});

// Ruta para crear la preferencia de pago (con soporte para comisiones / split payment)
app.post('/create_preference', async (req, res) => {
  try {
    const { title, unit_price, quantity, marketplace_fee } = req.body;

    let preference = {
      items: [
        {
          title: title || 'Producto de SI!',
          unit_price: Number(unit_price),
          quantity: Number(quantity) || 1,
        }
      ],
      // Comisión de la plataforma para esquemas de marketplace / split payment
      marketplace_fee: marketplace_fee ? Number(marketplace_fee) : undefined,
      back_urls: {
        success: "https://www.success.com",
        failure: "https://www.failure.com",
        pending: "https://www.pending.com"
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    
    res.status(200).json({
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error);
    res.status(500).json({ error: error.message || "Error al procesar el pago" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Servidor activo en el puerto ${PORT});
});
