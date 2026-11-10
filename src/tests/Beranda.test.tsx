import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Beranda from '../app/Beranda';
import { MODUL } from '../content/modul';

it('Beranda menampilkan semua modul berurutan + tautan pasang aplikasi', () => {
  render(
    <MemoryRouter>
      <Beranda />
    </MemoryRouter>,
  );
  const tautan = within(screen.getByRole('list')).getAllByRole('link');
  expect(tautan).toHaveLength(MODUL.length);
  MODUL.forEach((m, i) => expect(tautan[i]).toHaveTextContent(m.judul));
  expect(screen.getByRole('link', { name: /Pasang LingkarKu/ })).toHaveAttribute('href', '/pasang');
});
