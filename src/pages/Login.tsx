import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, User } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (resetMode) {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setResetMessage('Link de recuperação enviado para seu e-mail!');
          setTimeout(() => {
            setResetMode(false);
            setResetMessage('');
          }, 3000);
        }
      } else if (isSignUp) {
        if (!fullName.trim()) {
          setError('Por favor, informe seu nome completo');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError('E-mail ou senha incorretos');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Petiscos Gordo</h1>
          <p className="text-gray-600">
            {resetMode
              ? 'Recuperar senha'
              : isSignUp
                ? 'Crie sua conta'
                : 'Entre na sua conta'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && !resetMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {!resetMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Carregando...'
              : resetMode
                ? 'Enviar Link de Recuperação'
                : isSignUp
                  ? 'Criar Conta'
                  : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {!resetMode && (
            <>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
              </button>
              <div>
                <button
                  onClick={() => {
                    setResetMode(true);
                    setError('');
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </>
          )}
          {resetMode && (
            <button
              onClick={() => {
                setResetMode(false);
                setError('');
                setResetMessage('');
              }}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
