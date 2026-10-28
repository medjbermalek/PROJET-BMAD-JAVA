import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('callback request journey', () => {
  it('confirms a request only after the server saves it', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ id: 1, firstName: 'Camille', lastName: 'Martin', phone: '0612345678' }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const user = userEvent.setup();

    render(<App />);
    await user.type(screen.getByLabelText(/Prénom/), 'Camille');
    await user.type(screen.getByLabelText(/Nom/), 'Martin');
    await user.type(screen.getByLabelText(/Téléphone fictif/), '0612345678');
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(await screen.findByRole('heading', { name: 'Demande enregistrée' })).toBeInTheDocument();
    expect(screen.getByText(/aucun rappel réel ne sera effectué/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/callbacks',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('keeps the form visible and gives a retry message when saving fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const user = userEvent.setup();

    render(<App />);
    await user.type(screen.getByLabelText(/Prénom/), 'Camille');
    await user.type(screen.getByLabelText(/Nom/), 'Martin');
    await user.type(screen.getByLabelText(/Téléphone fictif/), '0612345678');
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/réessayer/i);
    expect(screen.getByRole('button', { name: 'Envoyer ma demande' })).toBeInTheDocument();
  });

  it('shows field-level validation messages for invalid input', async () => {
    render(<App />);
    fireEvent.submit(screen.getByLabelText(/Prénom/).closest('form')!);

    await waitFor(() => {
      expect(screen.getAllByText('Le prénom est obligatoire.')).toHaveLength(2);
      expect(screen.getAllByText('Le nom est obligatoire.')).toHaveLength(2);
      expect(screen.getAllByText('Saisissez un numéro de téléphone valide.')).toHaveLength(2);
    });
  });

  it('clears the error summary once previously invalid fields are corrected', async () => {
    const user = userEvent.setup();
    render(<App />);
    fireEvent.submit(screen.getByLabelText(/Prénom/).closest('form')!);
    await waitFor(() => {
      expect(screen.getByText(/corrections sont nécessaires/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Prénom/), 'Camille');
    await user.type(screen.getByLabelText(/Nom/), 'Martin');
    await user.type(screen.getByLabelText(/Téléphone fictif/), '0612345678');

    expect(screen.queryByText(/corrections sont nécessaires/i)).not.toBeInTheDocument();
  });

  it('rejects phone numbers outside the seven-to-fifteen digit range', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();

    render(<App />);
    await user.type(screen.getByLabelText(/Prénom/), 'Camille');
    await user.type(screen.getByLabelText(/Nom/), 'Martin');
    await user.type(screen.getByLabelText(/Téléphone fictif/), '123456');
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(await screen.findByText('Saisissez un numéro de téléphone valide.')).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/Téléphone fictif/));
    await user.type(screen.getByLabelText(/Téléphone fictif/), '1234567890123456');
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(screen.getByText('Saisissez un numéro de téléphone valide.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts phone numbers at both digit-count boundaries', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ id: 1, firstName: 'Camille', lastName: 'Martin', phone: '1234567' }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const user = userEvent.setup();

    render(<App />);
    for (const phone of ['1234567', '123456789012345']) {
      if (screen.queryByRole('button', { name: 'Créer une nouvelle demande' })) {
        await user.click(screen.getByRole('button', { name: 'Créer une nouvelle demande' }));
        await user.type(screen.getByLabelText(/Prénom/), 'Camille');
        await user.type(screen.getByLabelText(/Nom/), 'Martin');
      } else {
        await user.type(screen.getByLabelText(/Prénom/), 'Camille');
        await user.type(screen.getByLabelText(/Nom/), 'Martin');
      }
      await user.type(screen.getByLabelText(/Téléphone fictif/), phone);
      await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
      expect(await screen.findByRole('heading', { name: 'Demande enregistrée' })).toBeInTheDocument();
    }

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('authenticates, lists saved requests, and logs out', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([{ id: 1, firstName: 'Camille', lastName: 'Martin', phone: '0612345678' }]),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole('link', { name: /Espace conseiller/ }));
    await user.type(screen.getByLabelText('Identifiant'), 'admin');
    await user.type(screen.getByLabelText('Mot de passe'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByText('Camille Martin')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Se déconnecter' }));

    expect(await screen.findByLabelText(/Prénom/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
