import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Verificar que existe la API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY no está configurada en las variables de entorno');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log('🍳 Nueva petición de recetas recibida');

    // Parsear el body de la petición
    const body = await req.json();
    const { ingredientes } = body;

    // Validaciones
    if (!ingredientes) {
      console.log('❌ No se enviaron ingredientes');
      return NextResponse.json(
        { error: 'Por favor proporciona ingredientes' }, 
        { status: 400 }
      );
    }

    if (typeof ingredientes !== 'string') {
      console.log('❌ Ingredientes no es string');
      return NextResponse.json(
        { error: 'Los ingredientes deben ser texto' }, 
        { status: 400 }
      );
    }

    if (ingredientes.trim() === '') {
      console.log('❌ Ingredientes vacíos');
      return NextResponse.json(
        { error: 'La lista de ingredientes no puede estar vacía' }, 
        { status: 400 }
      );
    }

    // Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ API key de OpenAI no configurada');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' }, 
        { status: 500 }
      );
    }

    console.log('🔍 Buscando recetas para:', ingredientes.substring(0, 50) + '...');

    // Prompt mejorado para obtener mejores resultados
    const prompt = `Actúa como un chef profesional. Tengo estos ingredientes disponibles: "${ingredientes}".

Dame EXACTAMENTE 6-8 recetas o platos que pueda preparar usando principalmente estos ingredientes. 

Formato requerido:
- Una receta por línea
- Solo el nombre del plato/receta
- Sin números, guiones ni viñetas
- Platos variados (desayuno, almuerzo, cena, snacks)
- Considera cocina internacional

Ejemplo de respuesta:
Arroz frito con pollo
Pasta carbonara
Tortilla española
Ensalada césar

Ingredientes disponibles: ${ingredientes}`;

    // Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ 
        role: 'user', 
        content: prompt 
      }],
      max_tokens: 300,
      temperature: 0.7, // Un poco de creatividad
    });

    const respuesta = completion.choices[0]?.message?.content;

    if (!respuesta) {
      console.log('❌ OpenAI no devolvió respuesta');
      return NextResponse.json(
        { error: 'No se pudo generar recetas en este momento' }, 
        { status: 500 }
      );
    }

    console.log('✅ Respuesta de OpenAI recibida:', respuesta.substring(0, 100) + '...');

    // Procesar la respuesta para extraer recetas limpias
    const recetasRaw = respuesta
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Limpiar números, guiones, asteriscos, etc.
        return line.replace(/^\d+[\.\)\-\s]*/, '')
                  .replace(/^[\-\*\•]\s*/, '')
                  .replace(/^[•]\s*/, '')
                  .trim();
      })
      .filter(line => line.length > 3) // Filtrar líneas muy cortas
      .slice(0, 8); // Máximo 8 recetas

    if (recetasRaw.length === 0) {
      console.log('❌ No se pudieron extraer recetas de la respuesta');
      return NextResponse.json(
        { error: 'No se encontraron recetas válidas' }, 
        { status: 404 }
      );
    }

    console.log(`✅ ${recetasRaw.length} recetas extraídas exitosamente`);

    return NextResponse.json({ 
      recetas: recetasRaw,
      total: recetasRaw.length,
      ingredientes_usados: ingredientes
    });

  } catch (error) {
    console.error('💥 Error en API de recetas:', error);

    // Manejo específico de errores de OpenAI
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Error de autenticación con el servicio de IA' }, 
          { status: 500 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Servicio temporalmente sobrecargado. Intenta en unos minutos.' }, 
          { status: 429 }
        );
      }

      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'El servicio tardó demasiado en responder. Intenta nuevamente.' }, 
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor. Intenta nuevamente.' }, 
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar que la API funciona
export async function GET() {
  return NextResponse.json({ 
    message: '🍳 API de recetas funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      POST: '/api/recetas - Generar recetas basadas en ingredientes'
    }
  });
}