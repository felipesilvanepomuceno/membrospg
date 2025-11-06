import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, CheckCircle, Circle, ChevronRight, Clock } from 'lucide-react';

interface ModulesProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
  completedLessons: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration_minutes: number | null;
  order_index: number;
  completed: boolean;
}

export default function Modules({ onNavigate }: ModulesProps) {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, [user]);

  const loadModules = async () => {
    if (!user) return;

    try {
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .order('order_index');

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index');

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id);

      const progressMap = new Map(
        progressData?.map((p) => [p.lesson_id, p.completed]) || []
      );

      const modulesWithLessons = modulesData?.map((module) => {
        const moduleLessons = lessonsData
          ?.filter((lesson) => lesson.module_id === module.id)
          .map((lesson) => ({
            ...lesson,
            completed: progressMap.get(lesson.id) || false,
          })) || [];

        const completedLessons = moduleLessons.filter((l) => l.completed).length;

        return {
          ...module,
          lessons: moduleLessons,
          completedLessons,
        };
      }) || [];

      setModules(modulesWithLessons);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Módulos do Curso</h1>
        <p className="text-gray-600">
          Aprenda passo a passo como engordar seu cachorro de forma saudável
        </p>
      </div>

      <div className="space-y-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-purple-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{module.title}</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      {module.lessons.length} aulas
                    </span>
                    <span className="text-purple-600 font-medium">
                      {module.completedLessons} / {module.lessons.length} concluídas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {module.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => onNavigate('lesson', { lessonId: lesson.id, moduleId: module.id })}
                  className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {lesson.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                    )}
                    <div className="text-left flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                      {lesson.duration_minutes && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration_minutes} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
