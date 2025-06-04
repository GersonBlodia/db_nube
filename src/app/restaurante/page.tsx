'use client';

import { useState } from 'react';
import { ChefHat, Check, Loader2, Eye, Clock, Users, Search } from 'lucide-react';
import { Ingrediente, RecetaDetallada, useIngredientesVisuales } from '@/hooks/useIngredientesVisuales';
import IngredientesSeleccionados from '@/components/IngredientesSeleccionados';
import RecetaModal from '@/components/RecetaModal';
 
const INGREDIENTES: Ingrediente[] = [
  // Proteínas
  { id: 'pollo', nombre: 'Pollo', imagen: '🐔', categoria: 'Proteínas' },
  { id: 'pescado', nombre: 'Pescado', imagen: '🐟', categoria: 'Proteínas' },
  { id: 'carne', nombre: 'Carne', imagen: '🥩', categoria: 'Proteínas' },
  { id: 'huevos', nombre: 'Huevos', imagen: '🥚', categoria: 'Proteínas' },
  { id: 'camaron', nombre: 'Camarón', imagen: '🦐', categoria: 'Proteínas' },
  { id: 'salmon', nombre: 'Salmón', imagen: '🍣', categoria: 'Proteínas' },
  
  // Vegetales
  { id: 'tomate', nombre: 'Tomate', imagen: '🍅', categoria: 'Vegetales' },
  { id: 'cebolla', nombre: 'Cebolla', imagen: '🧅', categoria: 'Vegetales' },
  { id: 'papa', nombre: 'Papa', imagen: '🥔', categoria: 'Vegetales' },
  { id: 'zanahoria', nombre: 'Zanahoria', imagen: '🥕', categoria: 'Vegetales' },
  { id: 'brocoli', nombre: 'Brócoli', imagen: '🥦', categoria: 'Vegetales' },
  { id: 'pimiento', nombre: 'Pimiento', imagen: '🫑', categoria: 'Vegetales' },
  { id: 'ajo', nombre: 'Ajo', imagen: '🧄', categoria: 'Vegetales' },
  { id: 'champiñones', nombre: 'Champiñones', imagen: '🍄', categoria: 'Vegetales' },
  { id: 'espinaca', nombre: 'Espinaca', imagen: '🥬', categoria: 'Vegetales' },
  { id: 'aguacate', nombre: 'Aguacate', imagen: '🥑', categoria: 'Vegetales' },
  
  // Carbohidratos
  { id: 'arroz', nombre: 'Arroz', imagen: '🍚', categoria: 'Carbohidratos' },
  { id: 'pasta', nombre: 'Pasta', imagen: '🍝', categoria: 'Carbohidratos' },
  { id: 'pan', nombre: 'Pan', imagen: '🍞', categoria: 'Carbohidratos' },
  { id: 'quinoa', nombre: 'Quinoa', imagen: '🌾', categoria: 'Carbohidratos' },
  { id: 'avena', nombre: 'Avena', imagen: '🥣', categoria: 'Carbohidratos' },
  
  // Lácteos
  { id: 'queso', nombre: 'Queso', imagen: '🧀', categoria: 'Lácteos' },
  { id: 'leche', nombre: 'Leche', imagen: '🥛', categoria: 'Lácteos' },
  { id: 'yogurt', nombre: 'Yogurt', imagen: '🍦', categoria: 'Lácteos' },
  { id: 'mantequilla', nombre: 'Mantequilla', imagen: '🧈', categoria: 'Lácteos' },
  
  // Especias/Otros
  { id: 'limon', nombre: 'Limón', imagen: '🍋', categoria: 'Condimentos' },
  { id: 'aceite', nombre: 'Aceite de Oliva', imagen: '🫒', categoria: 'Condimentos' },
  { id: 'miel', nombre: 'Miel', imagen: '🍯', categoria: 'Condimentos' },
  { id: 'jengibre', nombre: 'Jengibre', imagen: '🫚', categoria: 'Condimentos' },
];

export default function RestauranteVisual() {
  const {
    ingredientesSeleccionados,
    recetas,
    loading,
    error,
    toggleIngrediente,
    buscarRecetas,
    limpiarSeleccion,
    clearError
  } = useIngredientesVisuales();

  const [recetaSeleccionada, setRecetaSeleccionada] = useState<RecetaDetallada | null>(null);
  const [busquedaCategoria, setBusquedaCategoria] = useState<string>('');

  const categorias = [...new Set(INGREDIENTES.map(i => i.categoria))];
  
  const ingredientesFiltrados = busquedaCategoria 
    ? INGREDIENTES.filter(ing => ing.categoria === busquedaCategoria)
    : INGREDIENTES;

  const handleBuscarRecetas = () => {
    buscarRecetas(INGREDIENTES);
  };

  const handleRemoverIngrediente = (id: string) => {
    toggleIngrediente(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Chef IA Visual
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona los ingredientes que tienes en casa y descubre recetas increíbles con pasos detallados
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Search className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-800">Filtrar por categoría:</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBusquedaCategoria('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  busquedaCategoria === '' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {categorias.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => setBusquedaCategoria(categoria)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    busquedaCategoria === categoria 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ingredientes seleccionados */}
        <div className="mb-8">
          <IngredientesSeleccionados
            ingredientes={INGREDIENTES}
            seleccionados={ingredientesSeleccionados}
            onRemover={handleRemoverIngrediente}
            onLimpiar={limpiarSeleccion}
          />
        </div>

        {/* Botón de buscar recetas */}
        <div className="mb-8 text-center">
          <button
            onClick={handleBuscarRecetas}
            disabled={loading || ingredientesSeleccionados.length === 0}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Cocinando recetas...
              </>
            ) : (
              <>
                <ChefHat className="w-6 h-6" />
                Buscar Recetas ({ingredientesSeleccionados.length} ingredientes)
              </>
            )}
          </button>
        </div>

        {/* Selección de ingredientes */}
        <div className="space-y-6 mb-8">
          {categorias
            .filter(categoria => busquedaCategoria === '' || categoria === busquedaCategoria)
            .map(categoria => (
              <div key={categoria} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 p-2 rounded-lg text-white">
                    {categoria === 'Proteínas' && '🥩'}
                    {categoria === 'Vegetales' && '🥬'}
                    {categoria === 'Carbohidratos' && '🌾'}
                    {categoria === 'Lácteos' && '🥛'}
                    {categoria === 'Condimentos' && '🌿'}
                  </span>
                  {categoria}
                  <span className="text-sm text-gray-500 font-normal">
                    ({ingredientesFiltrados.filter(ing => ing.categoria === categoria).length} opciones)
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {ingredientesFiltrados
                    .filter(ing => ing.categoria === categoria)
                    .map(ingrediente => (
                      <button
                        key={ingrediente.id}
                        onClick={() => toggleIngrediente(ingrediente.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                          ingredientesSeleccionados.includes(ingrediente.id)
                            ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200'
                            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md hover:bg-orange-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2 transform transition-transform hover:scale-110">
                            {ingrediente.imagen}
                          </div>
                          <p className="text-xs font-medium text-gray-700 leading-tight">
                            {ingrediente.nombre}
                          </p>
                        </div>
                        
                        {ingredientesSeleccionados.includes(ingrediente.id) && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <ChefHat className="w-16 h-16 text-orange-500 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Nuestro Chef IA está trabajando...
              </h3>
              <p className="text-gray-600">
                Analizando tus {ingredientesSeleccionados.length} ingredientes y creando recetas personalizadas
              </p>
              <div className="w-64 bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {recetas.length > 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-green-600" />
              Recetas Personalizadas
              <span className="bg-green-100 text-green-800 text-lg px-3 py-1 rounded-full">
                {recetas.length}
              </span>
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {recetas.map((receta, index) => (
                <div key={index} className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-orange-300 bg-gradient-to-br from-white to-orange-50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                        {receta.nombre}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {receta.descripcion}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      {receta.tiempoPreparacion}
                    </div>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md">
                      <Users className="w-3 h-3" />
                      {receta.porciones}
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      receta.dificultad === 'Fácil' ? 'bg-green-100 text-green-700' :
                      receta.dificultad === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {receta.dificultad}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setRecetaSeleccionada(receta)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group-hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Receta Completa
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm text-center">
                🎉 <strong>¡Excelente elección!</strong> Estas recetas están optimizadas con los ingredientes que seleccionaste. 
                Haz clic en "Ver Receta Completa" para obtener ingredientes exactos, cantidades y pasos detallados.
              </p>
            </div>
          </div>
        )}

        {/* Modal de receta */}
        {recetaSeleccionada && (
          <RecetaModal 
            receta={recetaSeleccionada}
            onClose={() => setRecetaSeleccionada(null)}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="mb-2">✨ <strong>Chef IA Visual</strong> - Powered by OpenAI</p>
            <p>Creado con ❤️ para hacer la cocina más fácil y divertida</p>
          </div>
        </div>
      </div>
    </div>
  );
}