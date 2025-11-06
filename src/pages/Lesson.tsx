import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CheckCircle, Circle, Clock, ExternalLink, FileText, Video } from 'lucide-react';

interface LessonProps {
  lessonId: string;
  moduleId: string;
  onNavigate: (page: string) => void;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url: string;
  content_text: string | null;
  duration_minutes: number | null;
  module_id: string;
}

interface ModuleData {
  title: string;
}

export default function Lesson({ lessonId, moduleId, onNavigate }: LessonProps) {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [module, setModule] = useState<ModuleData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId, user]);

  const loadLesson = async () => {
    if (!user) return;

    try {
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      const { data: moduleData } = await supabase
        .from('modules')
        .select('title')
        .eq('id', moduleId)
        .single();

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      setLesson(lessonData);
      setModule(moduleData);
      setCompleted(progressData?.completed || false);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async () => {
    if (!user || !lesson) return;

    try {
      const newCompletedState = !completed;

      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (existingProgress) {
        await supabase
          .from('user_progress')
          .update({
            completed: newCompletedState,
            completed_at: newCompletedState ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null,
        });
      }

      setCompleted(newCompletedState);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando aula...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Aula não encontrada</p>
          <button
            onClick={() => onNavigate('modules')}
            className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            Voltar para os módulos
          </button>
        </div>
      </div>
    );
  }

  const videoId = lesson.content_type === 'video' || lesson.content_type === 'mixed'
    ? getVideoId(lesson.content_url)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => onNavigate('modules')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar para os módulos</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="text-sm font-medium text-purple-200 mb-2">{module.title}</div>
          <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-purple-100">
            {lesson.duration_minutes && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration_minutes} minutos</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              {lesson.content_type === 'video' && <Video className="w-4 h-4" />}
              {lesson.content_type === 'article' && <FileText className="w-4 h-4" />}
              {lesson.content_type === 'mixed' && <FileText className="w-4 h-4" />}
              <span className="capitalize">{lesson.content_type === 'mixed' ? 'Vídeo + Artigo' : lesson.content_type}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
          </div>

          {videoId && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {(lesson.content_type === 'article' || lesson.content_type === 'mixed') && (
            <div className="mb-6">
              <a
                href={lesson.content_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">Material Complementar</div>
                    <div className="text-sm text-gray-600">Clique para acessar o conteúdo</div>
                  </div>
                </div>
                <div className="text-purple-600 group-hover:translate-x-1 transition-transform">→</div>
              </a>
            </div>
          )}

          {lesson.content_text && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{lesson.content_text}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={toggleComplete}
              className={`w-full flex items-center justify-center space-x-3 py-3 px-6 rounded-lg font-semibold transition-colors ${
                completed
                  ? 'bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-100'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {completed ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Aula Concluída</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5" />
                  <span>Marcar como Concluída</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
