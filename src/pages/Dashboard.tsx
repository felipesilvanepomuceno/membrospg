import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, Award, TrendingUp, Play } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string, moduleId?: string) => void;
}

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [progress, setProgress] = useState<ProgressStats>({
    totalLessons: 0,
    completedLessons: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
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
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {profile?.full_name || 'Aluno'}!
        </h1>
        <p className="text-gray-600">
          Bem-vindo de volta à sua jornada para transformar a saúde do seu cachorro
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{progress.totalLessons}</h3>
          <p className="text-gray-600 text-sm">Aulas Disponíveis</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{progress.completedLessons}</h3>
          <p className="text-gray-600 text-sm">Aulas Concluídas</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{progress.percentage}%</h3>
          <p className="text-gray-600 text-sm">Progresso Total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Seu Progresso no Curso</h2>
          <span className="text-sm font-medium text-purple-600">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Continue assistindo às aulas para completar sua jornada!
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Continue de onde parou</h2>
            <p className="text-purple-100 mb-6">
              Acesse os módulos do curso e continue aprendendo receitas incríveis para seu pet
            </p>
            <button
              onClick={() => onNavigate('modules')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Ir para os Módulos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
