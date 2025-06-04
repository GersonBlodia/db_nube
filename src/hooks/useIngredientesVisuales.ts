import { useState } from 'react';

export interface Ingrediente {
  id: string;
  nombre: string;
  imagen: string;
  categoria: string;
}

export interface RecetaDetallada {
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

interface RecetasResponse {
  recetas: RecetaDetallada[];
  total: number;
  ingredientesUsados: string;
}

interface UseIngredientesVisualesReturn {
  ingredientesSeleccionados: string[];
  recetas: RecetaDetallada[];
  loading: boolean;
  error: string;
  toggleIngrediente: (id: string) => void;
  buscarRecetas: (ingredientes: Ingrediente[]) => Promise<void>;
  limpiarSeleccion: () => void;
  clearError: () => void;
}

export function useIngredientesVisuales(): UseIngredientesVisualesReturn {
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<string[]>([]);
  const [recetas, setRecetas] = useState<RecetaDetallada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleIngrediente = (id: string) => {
    setIngredientesSeleccionados(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
    setError('');
  };

  const buscarRecetas = async (todosIngredientes: Ingrediente[]) => {
    if (ingredientesSeleccionados.length === 0) {
      setError('Selecciona al menos un ingrediente');
      return;
    }

    setLoading(true);
    setError('');
    setRecetas([]);

    try {
      const nombresIngredientes = ingredientesSeleccionados
        .map(id => todosIngredientes.find(ing => ing.id === id)?.nombre)
        .filter(Boolean)
        .join(', ');

      console.log('🔍 Buscando recetas para:', nombresIngredientes);

      const response = await fetch('/api/recetas-detalladas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredientes: nombresIngredientes,
          ingredientesIds: ingredientesSeleccionados 
        }),
      });

      const data: RecetasResponse | { error: string } = await response.json();

      if (!response.ok) {
        throw new Error('error' in data ? data.error : 'Error al buscar recetas');
      }

      if ('recetas' in data) {
        setRecetas(data.recetas || []);
        
        if (!data.recetas || data.recetas.length === 0) {
          setError('No se encontraron recetas con esos ingredientes');
        } else {
          console.log(`✅ ${data.recetas.length} recetas detalladas encontradas`);
        }
      }
    } catch (err) {
      console.error('❌ Error buscando recetas:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const limpiarSeleccion = () => {
    setIngredientesSeleccionados([]);
    setRecetas([]);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  return {
    ingredientesSeleccionados,
    recetas,
    loading,
    error,
    toggleIngrediente,
    buscarRecetas,
    limpiarSeleccion,
    clearError,
  };
}