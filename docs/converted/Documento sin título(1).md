# Converted from Documento sin título(1).docx

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Súper Liga Villetana 2025</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5; /* Un gris muy claro para el fondo general */
        }
        .header-bg {
            background: linear-gradient(to right, #1e3a8a, #3b82f6); /* Azul oscuro a azul más claro */
        }
        .card {
            background-color: white;
            border-radius: 0.75rem; /* Esquinas más redondeadas */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .table-header th {
            background-color: #e5e7eb; /* Gris claro para cabeceras de tabla */
        }
        .team-logo {
            width: 24px;
            height: 24px;
            object-fit: contain;
            margin-right: 8px;
        }
        .match-score {
            font-weight: 700;
            font-size: 1.125rem; /* 18px */
            padding: 0 0.5rem; /* Espacio entre los marcadores */
        }
        .match-card {
            border-left: 4px solid #3b82f6; /* Borde azul a la izquierda */
        }
        .news-highlight {
            background-color: #eff6ff; /* Azul muy claro para destacar noticias */
            border-left: 4px solid #60a5fa; /* Borde azul más claro */
        }

        /* Animación sutil para la carga */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
    </style>
</head>
<body class="text-gray-800">

    <!-- Encabezado -->
    <header class="header-bg text-white shadow-lg">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">Liga Villetana de Fútbol</h1>
                    <p class="text-lg sm:text-xl text-blue-200">Súper Liga Villetana 2025</p>
                </div>
                <!-- Logo de la Liga (Placeholder) -->
                <img src="https://placehold.co/100x100/ffffff/1e3a8a?text=LVF" alt="Logo Liga Villetana" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white mt-4 sm:mt-0">
            </div>
            <p class="text-sm text-center sm:text-left italic text-blue-300 mt-2">"Campeonato Oficial Homenaje a Olegario González, Sebastián Torres, Rogelio Trinidad, Eleuterio Rodas, Federico Delgado y Esterio López"</p>
        </div>
    </header>

    <!-- Navegación (Simple) -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-center sm:justify-start space-x-6 sm:space-x-8 py-3">
                <a href="#resultados" class="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-500 transition-colors">Resultados</a>
                <a href="#posiciones" class="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-500 transition-colors">Posiciones</a>
                <a href="#noticias" class="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-500 transition-colors">Noticias</a>
                <a href="#proximos" class="text-gray-600 hover:text-blue-600 font-semibold pb-1 border-b-2 border-transparent hover:border-blue-500 transition-colors">Próximos Partidos</a>
            </div>
        </div>
    </nav>

    <!-- Contenido Principal -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Sección Últimos Resultados -->
        <section id="resultados" class="mb-12 fade-in">
            <h2 class="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-500 pb-2">Últimos Resultados - Octavos de Final (Ida) - Categoría Principal</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Partido 1 -->
                <div class="card p-5 match-card">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Serie A - Octavos (Ida)</span>
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Finalizado</span>
                    </div>
                    <div class="flex items-center justify-around text-center">
                        <div class="flex-1 flex flex-col items-center">
                            <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=3F" alt="Logo 3 de Febrero" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">3 de Febrero</span>
                        </div>
                        <span class="match-score text-blue-600">1 - 1</span>
                        <div class="flex-1 flex flex-col items-center">
                            <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=2M" alt="Logo 2 de Mayo" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">2 de Mayo</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-3 text-center">Goles: César Salinas (3F); Mateo Machuca (2M)</p>
                </div>

                <!-- Partido 2 -->
                <div class="card p-5 match-card">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Serie B - Octavos (Ida)</span>
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Finalizado</span>
                    </div>
                    <div class="flex items-center justify-around text-center">
                        <div class="flex-1 flex flex-col items-center">
                            <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=13M" alt="Logo 13 de Mayo" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">13 de Mayo</span>
                        </div>
                        <span class="match-score text-blue-600">0 - 2</span>
                        <div class="flex-1 flex flex-col items-center">
                            <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=12O" alt="Logo 12 de Octubre" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">12 de Octubre</span>
                        </div>
                    </div>
                     <p class="text-xs text-gray-500 mt-3 text-center">Goles: William González, Pedro Medina (12O)</p>
                </div>

                <!-- Partido 3 -->
                <div class="card p-5 match-card">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Serie C - Octavos (Ida)</span>
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Finalizado</span>
                    </div>
                     <div class="flex items-center justify-around text-center">
                        <div class="flex-1 flex flex-col items-center">
                            <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=1M" alt="Logo 1ro de Mayo" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">1ro de Mayo</span>
                        </div>
                        <span class="match-score text-blue-600">1 - 4</span>
                        <div class="flex-1 flex flex-col items-center">
                            <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=LIB" alt="Logo Libertad" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">Libertad</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-3 text-center">Goles: Osvaldo Alfonso (1M); O. Presentado, M. Mongelós, F. Rojas, J. López (LIB)</p>
                </div>

                <!-- Partido 4 -->
                <div class="card p-5 match-card">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-500">Serie D - Octavos (Ida)</span>
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Finalizado</span>
                    </div>
                    <div class="flex items-center justify-around text-center">
                        <div class="flex-1 flex flex-col items-center">
                             <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=IY" alt="Logo Itá Ybaté" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">Itá Ybaté</span>
                        </div>
                        <span class="match-score text-blue-600">0 - 3</span>
                        <div class="flex-1 flex flex-col items-center">
                            <img src="https://placehold.co/40x40/EBF4FF/1D4ED8?text=4O" alt="Logo 4 de Octubre" class="team-logo mb-1 h-10 w-10 rounded-full">
                            <span class="font-semibold">4 de Octubre</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-3 text-center">Goles: Néstor Aranda, Ananías Chávez, Ariel Núñez c/s/v (4O)</p>
                </div>
                 <!-- Aquí se podrían agregar más partidos de Octavos -->
            </div>
        </section>

        <!-- Sección Tabla de Posiciones (Ejemplo) -->
        <section id="posiciones" class="mb-12 fade-in" style="animation-delay: 0.2s;">
            <h2 class="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-500 pb-2">Tabla de Posiciones - Fase de Grupos (Final) - Categoría Principal</h2>
            <div class="card overflow-x-auto">
                <div class="p-4">
                    <h3 class="text-xl font-semibold mb-3 text-center text-blue-700">Serie A</h3>
                </div>
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="table-header">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pos</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipo</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pts</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">PJ</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">GF</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">GC</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">DG</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                <img src="https://placehold.co/24x24/1e3a8a/ffffff?text=CL" alt="Logo Cerro León" class="team-logo rounded-full"> Cerro León
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-bold">32</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">12</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GF) </td> <!-- Dato no disponible fácilmente -->
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GC) </td> <!-- Dato no disponible fácilmente -->
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (DG) </td> <!-- Dato no disponible fácilmente -->
                        </tr>
                        <tr>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                <img src="https://placehold.co/24x24/3b82f6/ffffff?text=12O" alt="Logo 12 de Octubre" class="team-logo rounded-full"> 12 de Octubre
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-bold">21</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">12</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GF) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GC) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (DG) </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                               <img src="https://placehold.co/24x24/60a5fa/ffffff?text=U" alt="Logo Universo" class="team-logo rounded-full"> Universo
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-bold">16</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">12</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GF) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GC) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (DG) </td>
                        </tr>
                         <tr>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">4</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                               <img src="https://placehold.co/24x24/93c5fd/000000?text=8D" alt="Logo 8 de Diciembre" class="team-logo rounded-full"> 8 de Diciembre
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-bold">15</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">12</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GF) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GC) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (DG) </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">5</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                               <img src="https://placehold.co/24x24/bfdbfe/000000?text=2M" alt="Logo 2 de Mayo" class="team-logo rounded-full"> 2 de Mayo
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-bold">13</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">12</td>
                           <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GF) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GC) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (DG) </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">6</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                               <img src="https://placehold.co/24x24/dbeafe/000000?text=IY" alt="Logo Itá Ybaté" class="team-logo rounded-full"> Itá Ybaté
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-bold">12</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">12</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GF) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (GC) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center"> (DG) </td>
                        </tr>
                        <tr class="bg-red-50"> <!-- Fila para equipo eliminado -->
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">7</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-red-700 flex items-center">
                               <img src="https://placehold.co/24x24/fee2e2/991b1b?text=LV" alt="Logo Lomas Valentinas" class="team-logo rounded-full"> Lomas Valentinas
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-center font-bold">4</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-center">12</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-center"> (GF) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-center"> (GC) </td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-red-700 text-center"> (DG) </td>
                        </tr>
                        <!-- Más filas de equipos -->
                    </tbody>
                </table>
                <p class="text-xs text-gray-500 p-4">Nota: Los datos de GF, GC, DG son ilustrativos para esta muestra. El sistema completo calculará estos valores.</p>
            </div>
             <!-- Aquí se podrían agregar tablas para Serie B y C -->
        </section>

        <!-- Sección Próximos Partidos y Noticias -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-1