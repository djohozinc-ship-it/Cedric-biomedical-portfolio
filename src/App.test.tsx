import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test("affiche le nom du portfolio et la navigation principale", () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Cédric DJOHOZIN/i })).toBeInTheDocument();
  expect(screen.getAllByText('Expertise').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
});

test("l'accueil n'a qu'un seul titre de niveau 1", () => {
  render(<App />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});
