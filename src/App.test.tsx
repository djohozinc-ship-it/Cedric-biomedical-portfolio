import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio introduction', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /cédric djohozin/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /lancer l’expérience 3d/i })).toBeInTheDocument();
});
