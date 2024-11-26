import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Container, Box } from '@chakra-ui/react';

export function AuthLayout() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxW="container.xl" h="100vh" centerContent justifyContent="center">
      <Box p={8} maxWidth="md" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Outlet />
      </Box>
    </Container>
  );
}