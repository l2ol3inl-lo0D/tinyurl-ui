import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TinyUrlRedirect from './TinyUrlRedirect';
import { useParams, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('TinyUrlRedirect', () => {
  const mockUrlId = 'abc123';
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ urlId: mockUrlId });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
    
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '', assign: jest.fn(), replace: jest.fn() },
    });
  });

  it('displays "Redirecting..." text while loading', () => {
    render(<TinyUrlRedirect />);
    
    expect(screen.getByText(/redirecting.../i)).toBeInTheDocument();
  });

  it('fetches URL and redirects on success', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('http://google.com'),
      })
    );
    global.fetch = mockFetch as jest.Mock;

    render(<TinyUrlRedirect />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/find?key=abc123', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      expect(window.location.href).toBe('http://google.com');
    });
  });

  it('handles fetch failure and logs error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    render(<TinyUrlRedirect />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/find?key=abc123', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching or redirecting:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('redirects to 404 page on 404 response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    ) as jest.Mock;

    render(<TinyUrlRedirect />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/find?key=abc123', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/404', { replace: true });
    });
  });
});
