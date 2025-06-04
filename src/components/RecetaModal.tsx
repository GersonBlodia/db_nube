import { X, Clock, Users, ChefHat, ShoppingCart, ListChecks } from 'lucide-react';
import { useEffect } from 'react';

interface RecetaDetallada {
  nombre: string;
  descripcion: string;
  tiempoPreparacion: string;
  porciones: string;
  dificultad: string;
  ingredientes: string[];
  cantidades: string[];
  pasos: string[];
  categoria: string;
}

interface RecetaModalProps {
  receta: RecetaDetallada;
  onClose: () => void;
}

export default function RecetaModal({ receta, onClose }: RecetaModalProps) {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const getDificultadColor = (dificultad: string) => {
    switch (dificultad) {
      case 'Fácil':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Difícil':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="pr-12">
            <h2 className="text-2xl font-bold mb-2">{receta.nombre}</h2>
            <p className="text-orange-100 mb-4">{receta.descripcion}</p>
            
            {/* Info rápida */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-1">
                <Clock className="w-4 h-4" />
                <span>{receta.tiempoPreparacion}</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-1">
                <Users className="w-4 h-4" />
                <span>{receta.porciones}</span>
              </div>
              <div className={`flex items-center gap-2 rounded-lg px-3 py-1 border ${getDificultadColor(receta.dificultad)}`}>
                <ChefHat className="w-4 h-4" />
                <span>{receta.dificultad}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredientes */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                Ingredientes
              </h3>
              
              <div className="space-y-3">
                {receta.ingredientes.map((ingrediente, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{ingrediente}</span>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                      {receta.cantidades[index] || 'Al gusto'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tip nutricional */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Tip:</strong> Puedes ajustar las cantidades según tus preferencias y el número de comensales.
                </p>
              </div>
            </div>

            {/* Pasos */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-green-500" />
                Preparación
              </h3>
              
              <div className="space-y-4">
                {receta.pasos.map((paso, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{paso}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip de cocina */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  👨‍🍳 <strong>Consejo del Chef:</strong> Lee todos los pasos antes de empezar y prepara todos los ingredientes. ¡La organización es clave!
                </p>
              </div>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Categoría: <span className="font-medium">{receta.categoria}</span></p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Imprimir Receta
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}