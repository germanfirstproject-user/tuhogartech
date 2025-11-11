/**
 * Script para migrar productos desde src/data/products.js a Supabase
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas en .env.local
 * 2. Ejecuta: node scripts/migrate-products-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import { products } from '../src/data/products.js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  console.error('Asegúrate de tener configurado .env.local con:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=...');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos a Supabase...\n');
  console.log(`📦 Total de productos a migrar: ${products.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.error(`❌ Error migrando ${product.id} (${product.title}):`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrado: ${product.id} - ${product.title}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error inesperado con ${product.id}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen de migración:');
  console.log(`  ✅ Exitosos: ${successCount}`);
  console.log(`  ❌ Errores: ${errorCount}`);
  console.log(`  📦 Total: ${products.length}`);

  if (successCount === products.length) {
    console.log('\n🎉 ¡Migración completada exitosamente!');
  } else {
    console.log('\n⚠️  Migración completada con errores. Revisa los mensajes arriba.');
  }
}

// Función para limpiar la tabla antes de migrar (opcional)
async function clearProductsTable() {
  console.log('⚠️  ¿Deseas limpiar la tabla de productos antes de migrar?');
  console.log('   Esto eliminará TODOS los productos existentes.');
  console.log('   Presiona Ctrl+C para cancelar, o espera 5 segundos para continuar...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  const { error } = await supabase
    .from('products')
    .delete()
    .neq('id', ''); // Elimina todos

  if (error) {
    console.error('❌ Error limpiando tabla:', error.message);
    process.exit(1);
  }

  console.log('✅ Tabla limpiada\n');
}

// Ejecutar migración
async function main() {
  try {
    // Descomentar la siguiente línea si quieres limpiar la tabla antes:
    // await clearProductsTable();
    
    await migrateProducts();
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

main();
