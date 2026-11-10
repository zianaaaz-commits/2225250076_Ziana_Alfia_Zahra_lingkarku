import type { ReactElement } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Beranda from './Beranda';
import Pengaturan from './Pengaturan';
import SegeraHadir from './SegeraHadir';
import { ProgresProvider } from './ProgresContext';
import { MODUL } from '../content/modul';
import Prasyarat from '../features/prasyarat/Prasyarat';
import Konsep from '../features/konsep/Konsep';
import Simulasi from '../features/simulasi/Simulasi';
import ContohDaftar from '../features/contoh/ContohDaftar';
import ContohDetail from '../features/contoh/ContohDetail';
import Latihan from '../features/latihan/Latihan';
import SesiLatihan from '../features/latihan/SesiLatihan';
import { CeritaDaftar, CeritaDetail } from '../features/cerita/Cerita';

const HALAMAN: Record<string, ReactElement> = {
  prasyarat: <Prasyarat />,
  konsep: <Konsep />,
  simulasi: <Simulasi />,
  contoh: <ContohDaftar />,
  latihan: <Latihan />,
  cerita: <CeritaDaftar />,
};

// HashRouter dipakai agar routing aman saat dijalankan sebagai file lokal di Capacitor.
export default function App() {
  return (
    <ProgresProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Beranda />} />
            {MODUL.map((m) => (
              <Route key={m.id} path={m.path} element={HALAMAN[m.id] ?? <SegeraHadir judul={m.judul} />} />
            ))}
            <Route path="/contoh/:id" element={<ContohDetail />} />
            <Route path="/latihan/:level" element={<SesiLatihan />} />
            <Route path="/cerita/:id" element={<CeritaDetail />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            <Route path="*" element={<SegeraHadir judul="Halaman tidak ditemukan" />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgresProvider>
  );
}
