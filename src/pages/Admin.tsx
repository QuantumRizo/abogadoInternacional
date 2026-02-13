import { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { toast } from 'sonner';

export default function Admin() {
  const { user, loading, signIn } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    if (error) toast.error(error.message);

    setIsLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#1c334a]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#1c334a]">Abogado Internacional</CardTitle>
            <CardDescription>Panel de Administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                placeholder="Email"
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <Input
                placeholder="Contraseña"
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <Button className="w-full bg-[#1c334a] hover:bg-[#2a4560]" type="submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard />;
}
