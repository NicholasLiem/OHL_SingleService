import { Express } from 'express';
import { DataSource } from 'typeorm';
import { createBarang, getBarang } from './controller/barang.controller';
import { createPerusahaan } from './controller/perusahaan.controller';

function routes(app: Express, db: DataSource) {
  app.get('/self', (req, res) => {
    res.sendStatus(200);
  });

  // Route for managing barang
  app.post('/barang', (req, res) => {
    createBarang(req, res, db);
  });

  app.get('/barang/:id', (req, res) => {
    getBarang(req, res, db);
  });

  app.post('/perusahaan', (req, res) => {
    createPerusahaan(req, res, db);
  });

  /* Nonexisting Route handling */
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Cannot access route' });
  });
}

export default routes;