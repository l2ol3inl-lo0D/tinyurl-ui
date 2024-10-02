import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TinyUrl from './TinyUrl';

global.fetch = jest.fn();

describe('TinyUrl Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input, button, and target URL elements', () => {
    render(<TinyUrl />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /envoyer/i });
    const link = screen.getByRole('link');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  it('updates input value when typed in', () => {
    render(<TinyUrl />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    
    expect(input).toHaveValue('https://example.com');
  });

  it('handles successful URL shortening', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('short.ly/abcd1234'),
    });

    render(<TinyUrl />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /envoyer/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/shorten', expect.any(Object));

    await waitFor(() => {
      expect(screen.getByRole('link')).toHaveTextContent('short.ly/abcd1234');
    });
  });

  it('handles failed URL shortening', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    });

    render(<TinyUrl />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /envoyer/i });

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/shorten', expect.any(Object));
      expect(screen.getByRole('link')).toHaveTextContent('');
    });
  });

  it('displays loading state when submitting', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      text: () => Promise.resolve('short.ly/abcd1234')
    }), 500)));

    render(<TinyUrl />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /envoyer/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('handles network errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(<TinyUrl />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /envoyer/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/shorten', expect.any(Object));
      expect(screen.getByRole('link')).toHaveTextContent('');
    });
  });
});

it('displays an error message if there is an error during the request', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status: 500,
    text: () => Promise.resolve('Server Error'),
  });

  render(<TinyUrl />);

  const input = screen.getByRole('textbox');
  const button = screen.getByRole('button', { name: /envoyer/i });

  fireEvent.change(input, { target: { value: 'https://example.com' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText(/erreur lors de la requète/i)).toBeInTheDocument();
  });

  expect(screen.queryByRole('link')).toBeNull();
});
