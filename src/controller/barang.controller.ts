import { Request, Response } from 'express';
import { Barang } from '../models/barang.model';
import { Perusahaan } from '../models/perusahaan.model';
import { DataSource } from 'typeorm';

export const createBarang = async (req: Request, res: Response, db: DataSource) => {
    const { nama, harga, stok, perusahaan, kode } = req.body;

    try {
        const perusahaanEntity = await db.manager.findOne(Perusahaan, { where: { nama: perusahaan } });

        if (!perusahaanEntity) {
            return res.status(400).json({ error: 'Perusahaan not found' });
        }
    
        const barang = new Barang(nama, harga, stok, perusahaanEntity, kode);
    
        await db.manager.save(barang);
    
        res.status(201).json({ 
            status: 'success',
            message: 'Barang created successfully',
            data: {
                id: barang.id,
                nama: barang.nama,
                harga: barang.harga,
                stok: barang.stok,
                kode: barang.kode,
                perusahaan_id: barang.perusahaan.id
            } });
    } catch (error) {
        console.error('Failed to create Barang:', error);
        res.status(500).json({ 
            status: 'failed',
            message: 'Failed to create Barang',
            data: {
                id: null,
                nama: nama,
                harga: harga,
                stok: stok,
                kode: kode,
                nama_perusahaan : perusahaan
            }
        });
    }
}

export const getBarang = async (req: Request, res: Response, db: DataSource) => {
    const { id } = req.params;
    try {
      const barangId = parseInt(id, 10);
      const barangEntity = await db.manager.findOne(Barang, { where: { id: barangId }, relations: ['perusahaan'] });
  
      if (!barangEntity) {
        return res.status(400).json({
          status: 'error',
          message: 'Failed to find barang',
          data: {
            id: id,
            nama: null,
            harga: null,
            stok: null,
            kode: null,
            nama_perusahaan: null
          }
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Barang found',
        data: {
          id: barangEntity.id,
          nama: barangEntity.nama,
          harga: barangEntity.harga,
          stok: barangEntity.stok,
          kode: barangEntity.kode,
          nama_perusahaan: barangEntity.perusahaan.nama
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to find barang',
        data: {
          id: id,
          nama: null,
          harga: null,
          stok: null,
          kode: null,
          nama_perusahaan: null
        }
      });
    }
}
  