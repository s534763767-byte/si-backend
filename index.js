const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Configurar Mercado Pago con el Access Token
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de SI! funcionando correctamente');
});

// Ruta para crear preferencia de pago
app.post('/create_preference', async (req, res) => {
  try {
    const { items, marketplace_fee, statement_descriptor } = req.body;

    const preference = {
      items: items,
      marketplace_fee: marketplace_fee ? Number(marketplace_fee) : undefined,
      statement_descriptor: statement_descriptor || 'SI!',
      back_urls: {
        success: "https://www.tuapp.com/success",
        failure: "https://www.tuapp.com/failure",
        pending: "https://www.tuapp.com/pending"
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
    console.error('Error al crear la preferencia:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor activo en el puerto ' + PORT);
});
