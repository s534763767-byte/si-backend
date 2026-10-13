const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Reemplaza con tu Access Token real de Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-239340105453094-101312-6a617eb8e374c75aea46294299540336-3762642196'
});

app.post('/create_preference', async (req, res) => {
  try {
    const { items, marketplace_fee, notification_url } = req.body;

    let preference = {
      items: items,
      marketplace_fee: marketplace_fee ? Number(marketplace_fee) : 0,
      back_urls: {
        success: "https://www.google.com",
        failure: "https://www.google.com",
        pending: "https://www.google.com"
      },
      auto_return: "approved",
    };

    if (notification_url) {
      preference.notification_url = notification_url;
    }

    const response = await mercadopago.preferences.create(preference);
    
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Servidor activo en el puerto ${PORT});
});