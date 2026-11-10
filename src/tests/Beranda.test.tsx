import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Beranda from '../app/Beranda';
import { MODUL } from '../content/modul';

it('Beranda menampilkan keenam modul berurutan', () => {
  render(
    <MemoryRouter>
      <Beranda />
    </MemoryRouter>,
  );
  const tautan = screen.getAllByRole('link');
  expect(tautan).toHaveLength(MODUL.length);
  MODUL.forEach((m, i) => expect(tautan[i]).toHaveTextContent(m.judul));
});
