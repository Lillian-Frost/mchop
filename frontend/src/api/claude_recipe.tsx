import React, { useState } from 'react';
import { Plus, X, ChefHat, Clock, Users } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  ingredients: string[];
  missingIngredients: string[];
  substitutions: { [key: string]: string[] };
  instructions: string[];
  matchScore: number;
}

const RecipeApp = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock recipe data for development
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Pasta Aglio e Olio',
      description: 'Simple Italian pasta with garlic and olive oil',
      cookTime: 15,
      servings: 2,
      ingredients: ['pasta', 'garlic', 'olive oil', 'parmesan cheese', 'red pepper flakes'],
      missingIngredients: ['red pepper flakes'],
      substitutions: {
        'parmesan cheese': ['nutritional yeast', 'pecorino romano'],
        'red pepper flakes': ['black pepper', 'paprika']
      },
      instructions: [
        'Boil pasta according to package directions',
        'Heat olive oil in pan, add sliced garlic',
        'Toss pasta with garlic oil, add cheese and pepper flakes'
      ],
      matchScore: 80
    },
    {
      id: '2',
      name: 'Garlic Butter Rice',
      description: 'Flavorful side dish with garlic and herbs',
      cookTime: 20,
      servings: 4,
      ingredients: ['rice', 'butter', 'garlic', 'chicken broth', 'parsley'],
      missingIngredients: ['chicken broth', 'parsley'],
      substitutions: {
        'chicken broth': ['vegetable broth', 'water + bouillon'],
        'parsley': ['cilantro', 'green onions']
      },
      instructions: [
        'Sauté garlic in butter',
        'Add rice and toast briefly',
        'Add broth and simmer until tender'
      ],
      matchScore: 60
    }
  ];

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.toLowerCase()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const findRecipes = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter and score recipes based on available ingredients
    const scoredRecipes = mockRecipes.map(recipe => {
      const availableIngredients = recipe.ingredients.filter(ing => 
        ingredients.some(userIng => ing.toLowerCase().includes(userIng))
      );
      const matchScore = Math.round((availableIngredients.length / recipe.ingredients.length) * 100);
      
      return {
        ...recipe,
        matchScore,
        missingIngredients: recipe.ingredients.filter(ing => 
          !ingredients.some(userIng => ing.toLowerCase().includes(userIng))
        )
      };
    }).filter(recipe => recipe.matchScore > 30).sort((a, b) => b.matchScore - a.matchScore);

    setRecipes(scoredRecipes);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <ChefHat className="mx-auto mb-4 text-orange-500" size={48} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recipe Assistant</h1>
          <p className="text-gray-600">Tell me what ingredients you have, and I'll suggest recipes with substitutions!</p>
        </div>

        {/* Ingredient Input */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Ingredients</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add an ingredient..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={addIngredient}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </div>

          {/* Ingredient Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-2"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={findRecipes}
            disabled={ingredients.length === 0 || isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Finding Recipes...' : 'Find Recipes'}
          </button>
        </div>

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recipe Suggestions</h2>
            <div className="space-y-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      recipe.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                      recipe.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.matchScore}% match
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  
                  <div className="flex gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {recipe.cookTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {recipe.servings} servings
                    </div>
                  </div>

                  {recipe.missingIngredients.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Missing Ingredients:</h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.missingIngredients.map((ingredient) => (
                          <span key={ingredient} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(recipe.substitutions).length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Possible Substitutions:</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(recipe.substitutions).map(([original, subs]) => (
                          <div key={original}>
                            <span className="font-medium">{original}:</span> {subs.join(', ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                      View Instructions
                    </summary>
                    <ol className="mt-2 space-y-1 text-sm text-gray-600 ml-4">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="list-decimal">{step}</li>
                      ))}
                    </ol>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeApp;