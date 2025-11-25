import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactsGrid } from './components/ContactsGrid';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Contacts Grid (500k)</h1>
        </header>
        <main>
          <ContactsGrid />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
