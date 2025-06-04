import { X, ShoppingBasket } from 'lucide-react';

interface Ingrediente {
  id: string;
  nombre: string;
  imagen: string;
  categoria: string;
}

interface IngredientesSeleccionadosProps {
  ingredientes: Ingrediente[];
  seleccionados: string[];
  onRemover: (id: string) => void;
  onLimpiar: () => void;
}

export default function IngredientesSeleccionados({ 
  ingredientes, 
  seleccionados, 
  onRemover, 
  onLimpiar 
}: IngredientesSeleccionadosProps) {
  const ingredientesSeleccionadosData = seleccionados
    .map(id => ingredientes.find(ing => ing.id === id))
    .filter(Boolean) as Ingrediente[];

  if (seleccionados.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
        <ShoppingBasket className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No has seleccionado ingredientes</p>
        <p className="text-gray-400 text-sm">Haz clic en los ingredientes de arriba para agregarlos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBasket className="w-5 h-5 text-green-600" />
          Ingredientes Seleccionados ({seleccionados.length})
        </h3>
        <button
          onClick={onLimpiar}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Limpiar todo
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {ingredientesSeleccionadosData.map(ingrediente => (
          <div 
            key={ingrediente.id}
            className="relative bg-green-50 border border-green-200 rounded-lg p-3 text-center group hover:bg-green-100 transition-colors"
          >
            <button
              onClick={() => onRemover(ingrediente.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label={`Remover ${ingrediente.nombre}`}
            >
              <X className="w-3 h-3" />
            </button>
            
            <div className="text-2xl mb-1">{ingrediente.imagen}</div>
            <p className="text-xs font-medium text-gray-700">{ingrediente.nombre}</p>
            <p className="text-xs text-gray-500">{ingrediente.categoria}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          ✨ <strong>¡Perfecto!</strong> Con estos ingredientes podrás crear deliciosas recetas.
        </p>
      </div>
    </div>
  );
}