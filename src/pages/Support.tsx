import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { HelpCircle, Send, Mail, MessageCircle, CheckCircle } from 'lucide-react';

export default function Support() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: submitError } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
      });

      if (submitError) throw submitError;

      setSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const supportEmail = 'suporte@petiscosgordo.com';
  const whatsappNumber = '5511999999999';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Suporte</h1>
        </div>
        <p className="text-gray-600">
          Estamos aqui para ajudar! Entre em contato conosco de várias formas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a
          href={`mailto:${supportEmail}`}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all group"
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">E-mail</h3>
              <p className="text-sm text-gray-600">Resposta em até 24h</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-2">
            Envie suas dúvidas por e-mail e responderemos o mais rápido possível.
          </p>
          <p className="text-purple-600 font-medium text-sm group-hover:underline">
            {supportEmail}
          </p>
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all group"
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">WhatsApp</h3>
              <p className="text-sm text-gray-600">Atendimento rápido</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-2">
            Fale conosco diretamente pelo WhatsApp para um suporte mais ágil.
          </p>
          <p className="text-green-600 font-medium text-sm group-hover:underline">
            Abrir conversa
          </p>
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Enviar Mensagem</h2>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">Mensagem enviada com sucesso!</p>
              <p className="text-green-700 text-sm mt-1">
                Responderemos em breve. Obrigado pelo contato!
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assunto
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Descreva brevemente sua dúvida"
              required
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Descreva sua dúvida ou problema em detalhes..."
              rows={6}
              required
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/1000 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? 'Enviando...' : 'Enviar Mensagem'}</span>
          </button>
        </form>
      </div>

      <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
        <h3 className="font-bold text-gray-900 mb-3">Perguntas Frequentes</h3>
        <div className="space-y-3">
          <details className="bg-white rounded-lg p-4 border border-purple-200">
            <summary className="font-medium text-gray-900 cursor-pointer">
              Como acessar as aulas?
            </summary>
            <p className="text-sm text-gray-600 mt-2">
              Navegue até a seção "Módulos" no menu superior e clique na aula desejada para começar a assistir.
            </p>
          </details>
          <details className="bg-white rounded-lg p-4 border border-purple-200">
            <summary className="font-medium text-gray-900 cursor-pointer">
              Posso acessar o curso pelo celular?
            </summary>
            <p className="text-sm text-gray-600 mt-2">
              Sim! A plataforma é totalmente responsiva e funciona perfeitamente em celulares, tablets e computadores.
            </p>
          </details>
          <details className="bg-white rounded-lg p-4 border border-purple-200">
            <summary className="font-medium text-gray-900 cursor-pointer">
              Como recebo meu certificado?
            </summary>
            <p className="text-sm text-gray-600 mt-2">
              Ao concluir 100% das aulas, o certificado ficará disponível na seção "Meu Perfil" para download.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
