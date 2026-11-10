import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { aturAndroid } from './app/androidNative';
import { mulaiPantauPasang } from './lib/pasang';
import './index.css';

mulaiPantauPasang(); // tangkap tawaran "pasang aplikasi" sedini mungkin
aturAndroid(); // tombol kembali di APK Android

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
