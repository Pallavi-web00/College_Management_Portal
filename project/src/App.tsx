import { StoreProvider, useStore } from './store/StoreContext';
import { LoginPage } from './pages/LoginPage';
import { AppShell } from './pages/AppShell';

function Root() {
  const { currentUser } = useStore();
  return currentUser ? <AppShell /> : <LoginPage />;
}

export default function App() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  );
}
