import { runCompleteHealthCheck } from '../firebase/healthCheck';

// Script de prueba para verificar el health check
const testHealthCheck = async () => {
  console.log('🚀 Iniciando prueba de Health Check...\n');
  
  try {
    const results = await runCompleteHealthCheck();
    
    console.log('\n📊 RESULTADOS:');
    console.log('═══════════════');
    
    Object.entries(results).forEach(([service, result]) => {
      const statusIcon = result.status === 'connected' ? '🟢' : 
                        result.status === 'warning' ? '🟡' : 
                        result.status === 'error' ? '🔴' : '⚪';
      
      console.log(`${statusIcon} ${service.toUpperCase()}: ${result.message}`);
      if (result.latency) console.log(`   ⏱️  Latencia: ${result.latency}ms`);
      if (result.details) {
        console.log('   📋 Detalles:', JSON.stringify(result.details, null, 2));
      }
      console.log('');
    });
    
    console.log('✅ Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar si este archivo se llama directamente
if (require.main === module) {
  testHealthCheck();
}

export { testHealthCheck };
