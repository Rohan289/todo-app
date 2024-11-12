
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from '../ui/signup/SignUp';

const SignupPage: React.FC = () => {
const queryClient = new QueryClient(); // Initialize QueryClient here


  return (
    <QueryClientProvider client={queryClient}>
        <Signup />
    </QueryClientProvider>
  );
};

export default SignupPage;