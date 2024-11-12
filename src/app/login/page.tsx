
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../ui/login/Login';

const LoginPage: React.FC = () => {
const queryClient = new QueryClient(); // Initialize QueryClient here


  return (
    <QueryClientProvider client={queryClient}>
        <Login />
    </QueryClientProvider>
  );
};

export default LoginPage;