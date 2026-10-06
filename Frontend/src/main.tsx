import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, createRouter } from '@tanstack/react-router';
import './app.css';

const queryClient = new QueryClient();
const rootRoute = createRootRoute();
const router = createRouter({ routeTree: rootRoute });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <iframe className="legacy-ui" src="/legacy/index.html" title="GlassBox" />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);