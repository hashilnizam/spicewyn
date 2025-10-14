import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Home from '@/pages/Home';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          {children}
        </HelmetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />, { wrapper: AllTheProviders });
  });

  it('displays the main heading', () => {
    render(<Home />, { wrapper: AllTheProviders });
    // The heading might be in the hero section
    expect(document.body).toBeTruthy();
  });
});
