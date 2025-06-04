import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY no está configurada');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(req: Request) {
  try {
    console.log('🍳 Nueva petición de recetas detalladas');

    const body = await req.json();
    const { ingredientes, ingredientesIds } = body;

    if (!ingredientes || !ingredientesIds) {
      return NextResponse.json(
        { error: 'Faltan ingredientes o IDs' }, 
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' }, 
        { status: 500 }
      );
    }

    console.log('🔍 Generando recetas detalladas para:', ingredientes);

    // Prompt específico para recetas detalladas
    const prompt = `Eres un chef profesional experto. Usando PRINCIPALMENTE estos ingredientes: "${ingredientes}", crea EXACTAMENTE 4 recetas detalladas.

FORMATO REQUERIDO (JSON válido):
{
  "recetas": [
    {
      "nombre": "Nombre del plato",
      "descripcion": "Descripción breve y apetitosa del plato (máximo 50 palabras)",
      "tiempoPreparacion": "30 min" (formato: número + min/hrs),
      "porciones": "4 personas" (formato: número + personas),
      "dificultad": "Fácil" (solo: Fácil, Intermedio, o Difícil),
      "ingredientes": ["ingrediente1", "ingrediente2", "ingrediente3", "ingrediente4"],
      "cantidades": ["1 taza", "2 cucharadas", "500g", "al gusto"],
      "pasos": [
        "Paso 1: descripción detallada",
        "Paso 2: descripción detallada", 
        "Paso 3: descripción detallada",
        "Paso 4: descripción detallada"
      ],
      "categoria": "Plato Principal" (solo: Desayuno, Almuerzo, Plato Principal, Cena, Postre, o Snack)
    }
  ]
}

REGLAS IMPORTANTES:
1. USA PRINCIPALMENTE los ingredientes proporcionados
2. Puedes agregar especias básicas, aceite, sal, agua si es necesario
3. Cada receta debe tener 4-8 ingredientes máximo
4. Cada receta debe tener 4-6 pasos máximo
5. Las cantidades deben ser realistas y específicas
6. Los pasos deben ser claros y detallados
7. Responde SOLO con JSON válido, sin texto adicional
8. Las 4 recetas deben ser diferentes en estilo y categoria

Ingredientes disponibles: ${ingredientes}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const respuesta = completion.choices[0]?.message?.content;

    if (!respuesta) {
      return NextResponse.json(
        { error: 'No se pudo generar recetas' }, 
        { status: 500 }
      );
    }

    console.log('✅ Respuesta de OpenAI recibida');

    try {
      // Limpiar la respuesta para asegurar JSON válido
      let jsonRespuesta = respuesta.trim();
      
      // Remover cualquier texto antes y después del JSON
      const inicioJson = jsonRespuesta.indexOf('{');
      const finJson = jsonRespuesta.lastIndexOf('}') + 1;
      
      if (inicioJson === -1 || finJson === 0) {
        throw new Error('No se encontró JSON válido en la respuesta');
      }
      
      jsonRespuesta = jsonRespuesta.substring(inicioJson, finJson);

      const datosRecetas = JSON.parse(jsonRespuesta);

      if (!datosRecetas.recetas || !Array.isArray(datosRecetas.recetas)) {
        throw new Error('Formato de respuesta inválido');
      }

      // Validar y limpiar cada receta
      const recetasValidas: RecetaDetallada[] = datosRecetas.recetas
        .filter((receta: any) => 
          receta.nombre && 
          receta.ingredientes && 
          receta.pasos && 
          Array.isArray(receta.ingredientes) && 
          Array.isArray(receta.pasos)
        )
        .map((receta: any) => ({
          nombre: receta.nombre || 'Receta sin nombre',
          descripcion: receta.descripcion || 'Deliciosa receta casera',
          tiempoPreparacion: receta.tiempoPreparacion || '30 min',
          porciones: receta.porciones || '4 personas',
          dificultad: ['Fácil', 'Intermedio', 'Difícil'].includes(receta.dificultad) 
            ? receta.dificultad 
            : 'Fácil',
          ingredientes: receta.ingredientes.slice(0, 8), // Máximo 8 ingredientes
          cantidades: Array.isArray(receta.cantidades) 
            ? receta.cantidades.slice(0, 8)
            : receta.ingredientes.map(() => 'Al gusto'),
          pasos: receta.pasos.slice(0, 8), // Máximo 8 pasos
          categoria: ['Desayuno', 'Almuerzo', 'Plato Principal', 'Cena', 'Postre', 'Snack'].includes(receta.categoria)
            ? receta.categoria
            : 'Plato Principal'
        }))
        .slice(0, 4); // Máximo 4 recetas

      if (recetasValidas.length === 0) {
        return NextResponse.json(
          { error: 'No se pudieron procesar las recetas generadas' }, 
          { status: 500 }
        );
      }

      console.log(`✅ ${recetasValidas.length} recetas detalladas procesadas`);

      return NextResponse.json({ 
        recetas: recetasValidas,
        total: recetasValidas.length,
        ingredientesUsados: ingredientes
      });

    } catch (parseError) {
      console.error('❌ Error parsing JSON:', parseError);
      console.log('Respuesta cruda:', respuesta);
      
      return NextResponse.json(
        { error: 'Error procesando las recetas generadas' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('💥 Error en API de recetas detalladas:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Error de autenticación con el servicio de IA' }, 
          { status: 500 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Servicio temporalmente sobrecargado' }, 
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '🍳 API de recetas detalladas funcionando',
    version: '2.0.0',
    features: [
      'Recetas con ingredientes específicos',
      'Cantidades detalladas', 
      'Pasos de preparación',
      'Información nutricional básica'
    ]
  });
}



