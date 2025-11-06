import { MessageCircle, Users, ExternalLink } from 'lucide-react';

export default function Community() {
  const whatsappLink = 'https://chat.whatsapp.com/example';
  const telegramLink = 'https://t.me/example';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Comunidade</h1>
        </div>
        <p className="text-gray-600">
          Conecte-se com outros alunos, compartilhe experiências e tire suas dúvidas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                Grupo WhatsApp
              </h3>
              <p className="text-sm text-gray-600">Junte-se à comunidade</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Participe do nosso grupo no WhatsApp para trocar experiências, compartilhar resultados e fazer networking com outros tutores.
          </p>
          <div className="flex items-center text-green-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>Entrar no grupo</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </div>
        </a>

        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Canal Telegram
              </h3>
              <p className="text-sm text-gray-600">Receba atualizações</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Receba atualizações exclusivas, dicas rápidas e avisos importantes diretamente no seu Telegram.
          </p>
          <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>Entrar no canal</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </div>
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Regras da Comunidade</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm font-bold">1</span>
            </div>
            <p className="text-gray-700">
              Respeite todos os membros e mantenha um ambiente saudável e acolhedor
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm font-bold">2</span>
            </div>
            <p className="text-gray-700">
              Compartilhe suas experiências e resultados com o curso
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm font-bold">3</span>
            </div>
            <p className="text-gray-700">
              Ajude outros membros quando possível e tire suas dúvidas
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm font-bold">4</span>
            </div>
            <p className="text-gray-700">
              Evite spam, links suspeitos ou conteúdo não relacionado ao curso
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          <span>Mural de Avisos</span>
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-900">Bem-vindo à comunidade!</span>
              <span className="text-xs text-gray-500">Hoje</span>
            </div>
            <p className="text-sm text-gray-600">
              Estamos felizes em ter você aqui. Apresente-se e conte um pouco sobre seu pet!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
