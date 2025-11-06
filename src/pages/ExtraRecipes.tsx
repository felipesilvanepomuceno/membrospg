import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChefHat, ArrowLeft, Book } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_text: string | null;
  category: string;
}

interface RecipesByCategory {
  [category: string]: Recipe[];
}

export default function ExtraRecipes() {
  const [recipes, setRecipes] = useState<RecipesByCategory>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const { data } = await supabase
        .from('extra_recipes')
        .select('*')
        .order('category');

      if (data) {
        const grouped = data.reduce((acc: RecipesByCategory, recipe) => {
          if (!acc[recipe.category]) {
            acc[recipe.category] = [];
          }
          acc[recipe.category].push(recipe);
          return acc;
        }, {});
        setRecipes(grouped);
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando conteúdos extras...</p>
        </div>
      </div>
    );
  }

  // Se uma receita está selecionada, mostra o conteúdo completo
  if (selectedRecipe) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para lista</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
            <div className="text-sm font-medium text-purple-200 mb-2">{selectedRecipe.category}</div>
            <h1 className="text-3xl font-bold mb-3">{selectedRecipe.title}</h1>
            <p className="text-purple-100">{selectedRecipe.description}</p>
          </div>

          <div className="p-6">
            {selectedRecipe.content_text && (
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed space-y-4"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {selectedRecipe.content_text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Lista de conteúdos por categoria
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Conteúdos Extras</h1>
        </div>
        <p className="text-gray-600">
          Material complementar completo para enriquecer ainda mais o aprendizado
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(recipes).map(([category, categoryRecipes]) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-purple-300 transition-all group text-left w-full"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                      <Book className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center text-xs text-purple-600 font-medium">
                        <span>Ler conteúdo completo</span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(recipes).length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum conteúdo extra disponível ainda.</p>
        </div>
      )}

      <div className="mt-12 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
        <h3 className="font-bold text-gray-900 mb-2">📚 Todo conteúdo está aqui!</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Todos os materiais extras foram escritos exclusivamente para você e estão 100% dentro da plataforma.
          Clique em qualquer card para ler o conteúdo completo. Sempre consulte um veterinário antes de fazer
          mudanças significativas na dieta do seu pet.
        </p>
      </div>
    </div>
  );
}
