import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthButton } from '../../components/AuthButton';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎰',
      title: 'Ruletas Interactivas',
      description: 'Crea ruletas personalizadas con tus productos, servicios o premios. Perfectas para sorteos y promociones.',
      benefits: ['Diseño personalizable', 'Premios configurables', 'Estadísticas en tiempo real']
    },
    {
      icon: '🧠',  
      title: 'Trivias Inteligentes',
      description: 'Diseña cuestionarios interactivos para educar y entretener a tu audiencia mientras promocionas tu marca.',
      benefits: ['Preguntas personalizadas', 'Ranking de participantes', 'Reportes detallados']
    },
    {
      icon: '🎫',
      title: 'Raspaditas Digitales', 
      description: 'Crea experiencias de raspaditas virtuales para campañas promocionales y eventos especiales.',
      benefits: ['Efectos realistas', 'Premios instantáneos', 'Integración con redes sociales']
    },
    {
      icon: '📊',
      title: 'Analytics Avanzados',
      description: 'Obtén insights detallados sobre la participación y engagement de tu audiencia.',
      benefits: ['Métricas en tiempo real', 'Reportes exportables', 'Segmentación de usuarios']
    }
  ];

  const useCases = [
    {
      title: 'Marketing de Eventos',
      description: 'Aumenta la participación en tus eventos corporativos, ferias comerciales y lanzamientos de productos.',
      image: '🎪', 
      stats: '85% más engagement'
    },
    {
      title: 'Promociones Retail',
      description: 'Impulsa las ventas con juegos promocionales en tiendas físicas y plataformas e-commerce.',
      image: '🛍️',
      stats: '60% más conversiones' 
    },
    {
      title: 'Campañas Digitales',
      description: 'Genera leads de calidad y viralidad en redes sociales con contenido gamificado.',
      image: '📱',
      stats: '200% más shares'
    },
    {
      title: 'Educación Corporativa', 
      description: 'Capacita a tu equipo de manera entretenida con trivias y desafíos educativos.',
      image: '🎓',
      stats: '75% mejor retención'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 1340 284.8" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="playapp-gradient-header" x1="27.2" y1="144.8" x2="1319.4" y2="144.8" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#9333ea"/>
                      <stop offset=".1" stopColor="#873de9"/>
                      <stop offset=".4" stopColor="#6758e9"/>
                      <stop offset=".8" stopColor="#3484e9"/>
                      <stop offset="1" stopColor="#0ea5e9"/>
                    </linearGradient>
                  </defs>
                  <path fill="url(#playapp-gradient-header)" d="M250.2,38.7c11.2,7.8,16.7,19.1,16.7,33.7,0,21.3-5.6,38.3-16.7,51-13.8,16-35,24-63.8,24h-97.5l-12.5,66.1H27.2L63.3,26.9h143.2c17.9,0,32.5,3.9,43.7,11.8ZM206.3,100.3c4.2-5.6,6.3-11.8,6.3-18.8s-1.8-9.7-5.5-12.4c-3.7-2.7-9.4-4.1-17.3-4.1h-85l-8.9,46.5h84.7c11.1,0,19.7-3.7,25.6-11.2ZM285.3,24.3h48.1l-36.6,189.2h-48.1l36.6-189.2ZM493.4,196.7c-.5,2.9-.8,5.4-.8,7.7,0,3.3.6,5.8,1.8,7.6l-.3,1.6h-47.3c-1.4-1.7-2.1-4.3-2.1-7.6s.3-5,.8-7.6l1-4.7c-8.7,8.5-19.2,14.9-31.4,19-12.2,4.1-26.5,6.1-42.9,6.1s-31.7-3.4-42.3-10.2c-10.6-6.8-15.9-17.3-15.9-31.4s4.6-27.1,13.7-34.9c9.1-7.8,22.3-12.4,39.3-14l74-6.3c6.4-.5,11.2-2,14.1-4.3,3-2.4,4.4-5.3,4.4-8.8s-2.4-6.1-7.2-8c-4.8-1.8-13.2-2.7-25.2-2.7s-19.3,1.3-26.7,3.9c-7.3,2.6-11.8,6.9-13.3,12.8h-52c3-14.8,10.8-26.1,23.5-34,8.2-5.1,18.3-8.6,30.2-10.7,11.9-2.1,25.8-3.1,41.7-3.1,26.5,0,46.4,2.6,59.7,7.7,13.3,5.1,20,14.4,20,27.8s-.4,6.4-1,9.1l-14.9,78.9c-.2,1-.5,3-1,5.9ZM455,145.6c-3,1.7-7.6,3-13.9,3.7l-53.3,6.3c-7.1.9-12.7,2.8-16.7,5.9-4,3.1-6.1,7.3-6.3,12.7,0,5.6,2.1,9.5,6.4,11.6,4.3,2.2,10.7,3.3,19.2,3.3,15.3,0,29.1-3,41.3-8.9,12.2-5.9,19.5-15.3,22-28.2l1.3-6.3ZM606.1,220.1c-7.1,9.9-13.8,17.8-19.9,23.7-6.1,5.8-12.5,10.4-19.1,13.7-5.9,3-12.5,5-19.6,6.1-7.1,1.1-15.9,1.7-26.1,1.7s-23-.3-31.4-.8l7.6-39.2c7.1.5,15.3.8,24.6.8s14.2-1,18.6-3.1c2.3-.9,4.6-2.2,7.1-4.1,2.4-1.8,4.5-4.1,6.3-6.7l4.4-6-47.8-133.6h52.3l29.5,92.5h1.3l62.2-92.5h57l-106.9,147.4ZM843.9,179.5h-109.3l-22.7,34h-57.2L784.9,26.9h62.7l58.6,186.6h-51.8l-10.5-34ZM832.4,141.9l-22.2-72.7h-1.3l-48.9,72.7h72.4ZM958.6,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM978.2,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1ZM1162.1,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM1181.7,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1Z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interactive Games Platform</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
                Características
              </a>
              <a href="#use-cases" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
                Casos de Uso
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
                Precios
              </a>
              <AuthButton />
            </nav>

            <button className="md:hidden p-2">
              <span className="text-gray-600">☰</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
                        <h1 className="text-6xl md:text-7xl font-bold text-center mb-8 font-title" style={{ letterSpacing: '-0.5px' }}>
            Crea Experiencias
            <span className="block bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent">
              Interactivas
            </span>
            Increíbles
          </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Crea experiencias gamificadas que aumentan el engagement, generan leads de calidad 
                y potencian tus campañas de marketing. Sin necesidad de conocimientos técnicos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg"
                >
                  🚀 Crear mi Primer Juego
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold">
                  📹 Ver Demo
                </button>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">500K+</div>
                  <div className="text-sm text-gray-500">Juegos Creados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10M+</div>
                  <div className="text-sm text-gray-500">Participaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-500">Satisfacción</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-1 transition-transform duration-300">
                <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎰</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 font-title" style={{ letterSpacing: '-0.5px' }}>Ruleta Promocional</h3>
                    <p className="text-gray-600">¡Gira y gana increíbles premios!</p>
                    <div className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      ▶ JUGAR AHORA
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-white p-3 rounded-full animate-bounce">
                🏆
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-400 text-white p-3 rounded-full animate-pulse">
                💎
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-title" style={{ letterSpacing: '-0.5px' }}>
          <span className="bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent">
            Funcionalidades Poderosas
          </span>
        </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas profesionales diseñadas para crear experiencias interactivas 
              que conectan con tu audiencia y generan resultados medibles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-title" style={{ letterSpacing: '-0.5px' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-title" style={{ letterSpacing: '-0.5px' }}>
              Casos de uso que generan resultados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre cómo empresas como la tuya están usando PlayApp para 
              aumentar engagement, generar leads y potenciar sus ventas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start space-x-6">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {useCase.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 font-title" style={{ letterSpacing: '-0.5px' }}>
                        {useCase.title}
                      </h3>
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {useCase.stats}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/admin')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg"
            >
              Ver Más Casos de Éxito →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-title" style={{ letterSpacing: '-0.5px' }}>
            ¿Listo para revolucionar tu marketing?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Únete a miles de empresas que ya están usando PlayApp para crear 
            experiencias únicas y generar resultados extraordinarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/admin')}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg"
            >
              🚀 Comenzar Gratis Ahora
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300 font-semibold">
              📞 Hablar con Ventas
            </button>
          </div>
          
          <div className="mt-8 text-purple-100 text-sm">
            ✓ Sin tarjeta de crédito • ✓ Configuración en 5 minutos • ✓ Soporte 24/7
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 1340 284.8" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="playapp-gradient-footer" x1="27.2" y1="144.8" x2="1319.4" y2="144.8" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#9333ea"/>
                        <stop offset=".1" stopColor="#873de9"/>
                        <stop offset=".4" stopColor="#6758e9"/>
                        <stop offset=".8" stopColor="#3484e9"/>
                        <stop offset="1" stopColor="#0ea5e9"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#playapp-gradient-footer)" d="M250.2,38.7c11.2,7.8,16.7,19.1,16.7,33.7,0,21.3-5.6,38.3-16.7,51-13.8,16-35,24-63.8,24h-97.5l-12.5,66.1H27.2L63.3,26.9h143.2c17.9,0,32.5,3.9,43.7,11.8ZM206.3,100.3c4.2-5.6,6.3-11.8,6.3-18.8s-1.8-9.7-5.5-12.4c-3.7-2.7-9.4-4.1-17.3-4.1h-85l-8.9,46.5h84.7c11.1,0,19.7-3.7,25.6-11.2ZM285.3,24.3h48.1l-36.6,189.2h-48.1l36.6-189.2ZM493.4,196.7c-.5,2.9-.8,5.4-.8,7.7,0,3.3.6,5.8,1.8,7.6l-.3,1.6h-47.3c-1.4-1.7-2.1-4.3-2.1-7.6s.3-5,.8-7.6l1-4.7c-8.7,8.5-19.2,14.9-31.4,19-12.2,4.1-26.5,6.1-42.9,6.1s-31.7-3.4-42.3-10.2c-10.6-6.8-15.9-17.3-15.9-31.4s4.6-27.1,13.7-34.9c9.1-7.8,22.3-12.4,39.3-14l74-6.3c6.4-.5,11.2-2,14.1-4.3,3-2.4,4.4-5.3,4.4-8.8s-2.4-6.1-7.2-8c-4.8-1.8-13.2-2.7-25.2-2.7s-19.3,1.3-26.7,3.9c-7.3,2.6-11.8,6.9-13.3,12.8h-52c3-14.8,10.8-26.1,23.5-34,8.2-5.1,18.3-8.6,30.2-10.7,11.9-2.1,25.8-3.1,41.7-3.1,26.5,0,46.4,2.6,59.7,7.7,13.3,5.1,20,14.4,20,27.8s-.4,6.4-1,9.1l-14.9,78.9c-.2,1-.5,3-1,5.9ZM455,145.6c-3,1.7-7.6,3-13.9,3.7l-53.3,6.3c-7.1.9-12.7,2.8-16.7,5.9-4,3.1-6.1,7.3-6.3,12.7,0,5.6,2.1,9.5,6.4,11.6,4.3,2.2,10.7,3.3,19.2,3.3,15.3,0,29.1-3,41.3-8.9,12.2-5.9,19.5-15.3,22-28.2l1.3-6.3ZM606.1,220.1c-7.1,9.9-13.8,17.8-19.9,23.7-6.1,5.8-12.5,10.4-19.1,13.7-5.9,3-12.5,5-19.6,6.1-7.1,1.1-15.9,1.7-26.1,1.7s-23-.3-31.4-.8l7.6-39.2c7.1.5,15.3.8,24.6.8s14.2-1,18.6-3.1c2.3-.9,4.6-2.2,7.1-4.1,2.4-1.8,4.5-4.1,6.3-6.7l4.4-6-47.8-133.6h52.3l29.5,92.5h1.3l62.2-92.5h57l-106.9,147.4ZM843.9,179.5h-109.3l-22.7,34h-57.2L784.9,26.9h62.7l58.6,186.6h-51.8l-10.5-34ZM832.4,141.9l-22.2-72.7h-1.3l-48.9,72.7h72.4ZM958.6,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM978.2,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1ZM1162.1,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM1181.7,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma de gamificación más avanzada para potenciar tu marketing.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl cursor-pointer hover:text-purple-400">📧</span>
                <span className="text-2xl cursor-pointer hover:text-purple-400">💬</span>
                <span className="text-2xl cursor-pointer hover:text-purple-400">📱</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 font-title" style={{ letterSpacing: '-0.5px' }}>Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 font-title" style={{ letterSpacing: '-0.5px' }}>Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Casos de Éxito</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 font-title" style={{ letterSpacing: '-0.5px' }}>Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Sistema</a></li>
                <li><a href="/admin/health" className="hover:text-white transition-colors">Health Check</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 PlayApp. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
