import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Award, TrendingUp, Download, Save } from 'lucide-react';

interface ProfileData {
  full_name: string;
  avatar_url: string | null;
}

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({ full_name: '', avatar_url: null });
  const [progress, setProgress] = useState<ProgressStats>({
    totalLessons: 0,
    completedLessons: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setEditName(profileData.full_name);
      }

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id');

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .eq('completed', true);

      const totalLessons = lessonsData?.length || 0;
      const completedLessons = progressData?.length || 0;
      const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      setProgress({ totalLessons, completedLessons, percentage });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !editName.trim()) return;

    setSaving(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, full_name: editName.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const downloadCertificate = () => {
    alert('Certificado disponível após conclusão de 100% do curso!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações e acompanhe seu progresso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <span>Informações Pessoais</span>
            </h2>

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Perfil atualizado com sucesso!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  O e-mail não pode ser alterado
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || editName === profile.full_name}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Progresso no Curso</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Aulas concluídas</span>
                <span className="font-bold text-gray-900">
                  {progress.completedLessons} / {progress.totalLessons}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progresso Total</span>
                  <span className="text-sm font-medium text-purple-600">{progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              {progress.percentage === 100 ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800 font-medium mb-2">
                    <Award className="w-5 h-5" />
                    <span>Parabéns! Você concluiu o curso!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Seu certificado está disponível para download abaixo.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    Continue assistindo às aulas para desbloquear seu certificado!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Certificado de Conclusão</h3>
            <p className="text-purple-100 text-sm text-center mb-6">
              {progress.percentage === 100
                ? 'Seu certificado está pronto!'
                : `Faltam ${progress.totalLessons - progress.completedLessons} aulas`}
            </p>
            <button
              onClick={downloadCertificate}
              disabled={progress.percentage < 100}
              className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Baixar Certificado</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Estatísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Aulas</span>
                <span className="font-semibold text-gray-900">{progress.totalLessons}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Concluídas</span>
                <span className="font-semibold text-green-600">{progress.completedLessons}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="font-semibold text-orange-600">
                  {progress.totalLessons - progress.completedLessons}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
