import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { Mail, Lock, User, Loader2, X, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos 1 letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos 1 letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos 1 número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos 1 caractere especial');

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

function zodErrorMap(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem('lastLoginEmail') || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupTouched, setSignupTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const loginParsed = loginSchema.safeParse({
    email: loginEmail.trim(),
    password: loginPassword,
  });
  const loginErrors = loginParsed.success ? {} : zodErrorMap(loginParsed.error);
  const loginCanSubmit = loginParsed.success && !loading;

  const signupParsed = signupSchema.safeParse({
    fullName: signupName.trim(),
    email: signupEmail.trim(),
    password: signupPassword,
    confirmPassword: signupConfirmPassword,
  });
  const signupErrors = signupParsed.success ? {} : zodErrorMap(signupParsed.error);
  const signupCanSubmit = signupParsed.success && !loading;

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = loginEmail.trim();
      loginSchema.parse({ email: normalizedEmail, password: loginPassword });
      
      const { error } = await signIn(normalizedEmail, loginPassword);
      
      if (error) {
        const msg = String(error.message || '');
        const msgLower = msg.toLowerCase();
        if (msgLower.includes('fetch') || msgLower.includes('network') || msgLower.includes('enotfound')) {
          toast.error('Não foi possível conectar ao servidor. Verifique sua internet/DNS e tente novamente.');
        } else if (msgLower.includes('email not confirmed') || msgLower.includes('email link is invalid')) {
          toast.error('Seu email ainda não foi confirmado.');
        } else if (msg.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error(msg);
        }
      } else {
        if (rememberEmail) {
          localStorage.setItem('lastLoginEmail', normalizedEmail);
        }
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        setLoginTouched({ email: true, password: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedName = signupName.trim();
      const normalizedEmail = signupEmail.trim();
      signupSchema.parse({
        fullName: normalizedName,
        email: normalizedEmail,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      });

      const { error } = await signUp(normalizedEmail, signupPassword, normalizedName);

      if (error) {
        const msg = String(error.message || '');
        const msgLower = msg.toLowerCase();
        if (msgLower.includes('fetch') || msgLower.includes('network') || msgLower.includes('enotfound')) {
          toast.error('Não foi possível conectar ao servidor. Verifique sua internet/DNS e tente novamente.');
        } else if (msg.includes('already registered')) {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error(msg);
        }
      } else {
        toast.success('Conta criada! Aguarde a aprovação do administrador.');
        setActiveTab('login');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        setSignupTouched({ fullName: true, email: true, password: true, confirmPassword: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      if (error.message.includes('provider is not enabled')) {
        toast.error('O login com Google não está habilitado no servidor.');
      } else {
        toast.error('Erro ao entrar com Google: ' + error.message);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4 relative">
      <Link to="/" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-8 w-8" />
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <CardTitle className="text-2xl">Área do Cliente</CardTitle>
          <CardDescription>
            Acesse sua conta para acompanhar seus processos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      onBlur={() => setLoginTouched((t) => ({ ...t, email: true }))}
                      className="pl-9"
                      required
                    />
                  </div>
                  {loginTouched.email && loginErrors.email ? (
                    <div className="text-xs text-destructive">{loginErrors.email}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onBlur={() => setLoginTouched((t) => ({ ...t, password: true }))}
                      className="pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginTouched.password && loginErrors.password ? (
                    <div className="text-xs text-destructive">{loginErrors.password}</div>
                  ) : null}
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    className="rounded"
                  />
                  Lembrar email
                </label>
                <Button type="submit" className="w-full" disabled={!loginCanSubmit}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      onBlur={() => setSignupTouched((t) => ({ ...t, fullName: true }))}
                      className="pl-9"
                      required
                    />
                  </div>
                  {signupTouched.fullName && signupErrors.fullName ? (
                    <div className="text-xs text-destructive">{signupErrors.fullName}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      onBlur={() => setSignupTouched((t) => ({ ...t, email: true }))}
                      className="pl-9"
                      required
                    />
                  </div>
                  {signupTouched.email && signupErrors.email ? (
                    <div className="text-xs text-destructive">{signupErrors.email}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      onBlur={() => setSignupTouched((t) => ({ ...t, password: true }))}
                      className="pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupTouched.password && signupErrors.password ? (
                    <div className="text-xs text-destructive">{signupErrors.password}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      onBlur={() => setSignupTouched((t) => ({ ...t, confirmPassword: true }))}
                      className="pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupTouched.confirmPassword && signupErrors.confirmPassword ? (
                    <div className="text-xs text-destructive">{signupErrors.confirmPassword}</div>
                  ) : null}
                </div>
                <Button type="submit" className="w-full" disabled={!signupCanSubmit}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
