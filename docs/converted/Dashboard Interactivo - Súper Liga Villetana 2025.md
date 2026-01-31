# Converted from Dashboard Interactivo - Súper Liga Villetana 2025.docx

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Súper Liga Villetana 2025</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f4f8; /* Light blue-gray background */
        }
        .tab-button {
            transition: all 0.3s ease;
            border-bottom-width: 4px;
            border-color: transparent;
        }
        .tab-button.active {
            border-color: #3b82f6; /* Blue-500 */
            color: #3b82f6;
            font-weight: 600;
        }
        .card {
            background-color: white;
            border-radius: 0.75rem; /* 12px */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        }
        .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .table-header th {
            background-color: #e5e7eb; /* Gray-200 */
        }
        .team-logo-sm {
            width: 20px;
            height: 20px;
            margin-right: 6px;
            border-radius: 50%;
            background-color: #e0e0e0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
            color: #555;
        }
         .team-logo-octavos {
            width: 28px;
            height: 28px;
            margin-right: 8px;
            border-radius: 50%;
            background-color: #d1d5db; /* gray-300 */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            color: #374151; /* gray-700 */
        }
        .match-score {
            font-weight: 700;
            font-size: 1.25rem; /* 20px */
            padding: 0 0.75rem; /* 12px */
            color: #1d4ed8; /* blue-700 */
        }
        .octavos-card {
            border-left: 5px solid #60a5fa; /* lighter blue */
        }
        .series-title {
            background: linear-gradient(to right, #3b82f6, #60a5fa);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem 0.5rem 0 0;
            font-size: 1.125rem; /* 18px */
            font-weight: 600;
        }
         .eliminated {
            color: #ef4444; /* red-500 */
            font-style: italic;
        }
        .qualified-head {
            color: #16a34a; /* green-600 */
        }
        .qualified-second {
            color: #3b82f6; /* blue-500 */
        }
    </style>
</head>
<body class="p-4 md:p-8">

    <header class="mb-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Súper Liga Villetana 2025</h1>
        <p class="text-md md:text-lg text-gray-600">Dashboard del Torneo</p>
    </header>

    <div class="mb-6 flex justify-center border-b border-gray-300">
        <button id="tabPrincipal" class="tab-button active px-4 py-3 text-lg" onclick="showCategory('Principal')">Categoría Principal</button>
        <button id="tabJuvenil" class="tab-button px-4 py-3 text-lg" onclick="showCategory('Juvenil')">Categoría Juvenil</button>
    </div>

    <div id="contentArea">
        <!-- El contenido se cargará aquí por JavaScript -->
    </div>

    <footer class="mt-12 text-center text-sm text-gray-500">
        <p>© <span id="currentYear"></span> Liga Villetana de Fútbol. Datos actualizados según documentos provistos.</p>
    </footer>

    <script>
        // Datos del Torneo (Consolidados)
        const tournamentData = {
            "Principal": {
                "nombre": "Categoría Principal",
                "faseDeGrupos": {
                    "Serie A": {
                        nombre: "Serie A",
                        equipos: [
                            { nombre: "Cerro León", pj: 12, pts: 32, gf:0, gc:0, dg:0, nota: "✓ Cabeza de Serie" },
                            { nombre: "12 de Octubre", pj: 12, pts: 21, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "Universo", pj: 12, pts: 16, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "8 de Diciembre", pj: 12, pts: 15, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "2 de Mayo", pj: 12, pts: 13, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "Itá Ybaté", pj: 12, pts: 12, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "Lomas Valentinas", pj: 12, pts: 4, gf:0, gc:0, dg:0, nota: "* Eliminado" }
                        ]
                    },
                    "Serie B": {
                        nombre: "Serie B",
                        equipos: [
                            { nombre: "Mcal Estigarribia", pj: 10, pts: 18, gf:0, gc:0, dg:0, nota: "✓ Cabeza de Serie" },
                            { nombre: "3 de Febrero", pj: 10, pts: 17, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "1º de Marzo", pj: 10, pts: 16, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "13 de Mayo", pj: 10, pts: 14, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "1º de Mayo", pj: 10, pts: 11, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "22 de Mayo", pj: 10, pts: 6, gf:0, gc:0, dg:0, nota: "* Eliminado" }
                        ]
                    },
                    "Serie C": {
                        nombre: "Serie C",
                        equipos: [
                            { nombre: "Libertad", pj: 10, pts: 22, gf:0, gc:0, dg:0, nota: "✓ Cabeza de Serie" },
                            { nombre: "4 de Octubre", pj: 10, pts: 14, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado (Desempate ED)" },
                            { nombre: "Sportivo Villetano", pj: 10, pts: 14, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "3 de Noviembre", pj: 10, pts: 13, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "Cumbariteño", pj: 10, pts: 12, gf:0, gc:0, dg:0, nota: "✓✓ Clasificado" },
                            { nombre: "Hijos de Mayo", pj: 10, pts: 6, gf:0, gc:0, dg:0, nota: "* Eliminado" }
                        ]
                    }
                },
                "octavosDeFinal": [
                    { llave: "A", equipoLocal: "3 de Febrero", scoreLocal: 1, equipoVisitante: "2 de Mayo", scoreVisitante: 1, info: "Ida" },
                    { llave: "B", equipoLocal: "13 de Mayo", scoreLocal: 0, equipoVisitante: "12 de Octubre", scoreVisitante: 2, info: "Ida" },
                    { llave: "C", equipoLocal: "1º de Mayo", scoreLocal: 1, equipoVisitante: "Libertad", scoreVisitante: 4, info: "Ida" },
                    { llave: "D", equipoLocal: "Itá Ybaté", scoreLocal: 0, equipoVisitante: "4 de Octubre", scoreVisitante: 3, info: "Ida" },
                    { llave: "E", equipoLocal: "Sportivo Villetano", scoreLocal: 0, equipoVisitante: "1º de Marzo", scoreVisitante: 0, info: "Ida" },
                    { llave: "F", equipoLocal: "Cumbariteño", scoreLocal: 1, equipoVisitante: "Cerro León", scoreVisitante: 2, info: "Ida" },
                    { llave: "G", equipoLocal: "8 de Diciembre", scoreLocal: 2, equipoVisitante: "Universo", scoreVisitante: 1, info: "Ida" },
                    { llave: "H", equipoLocal: "Mcal Estigarribia", scoreLocal: 1, equipoVisitante: "3 de Noviembre", scoreVisitante: 0, info: "Ida" }
                ]
            },
            "Juvenil": {
                "nombre": "Categoría Juvenil",
                 "faseDeGrupos": {
                    "Serie A": {
                        nombre: "Serie A",
                        equipos: [
                            { nombre: "Cerro León", pj: 12, pts: 34, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "Universo", pj: 12, pts: 23, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "Itá Ybaté", pj: 12, pts: 18, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "2 de Mayo", pj: 12, pts: 16, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "12 de Octubre", pj: 12, pts: 15, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "Lomas Valentinas", pj: 12, pts: 10, gf:0, gc:0, dg:0, nota: "# Clasificado (Regla Especial)" },
                            { nombre: "8 de Diciembre", pj: 12, pts: 1, gf:0, gc:0, dg:0, nota: "* Eliminado" }
                        ]
                    },
                    "Serie B": {
                        nombre: "Serie B",
                        equipos: [
                            { nombre: "1º de Mayo", pj: 10, pts: 21, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "Mcal Estigarribia", pj: 10, pts: 16, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "22 de Mayo", pj: 10, pts: 13, gf:0, gc:0, dg:0, nota: "# Clasificado (Regla Especial)" },
                            { nombre: "3 de Febrero", pj: 10, pts: 11, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "1º de Marzo", pj: 10, pts: 10, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "13 de Mayo", pj: 10, pts: 8, gf:0, gc:0, dg:0, nota: "* Eliminado" }
                        ]
                    },
                    "Serie C": {
                        nombre: "Serie C",
                        equipos: [
                            { nombre: "Libertad", pj: 10, pts: 26, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "Cumbariteño", pj: 10, pts: 15, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "Hijos de Mayo", pj: 10, pts: 13, gf:0, gc:0, dg:0, nota: "# Clasificado (Regla Especial)" },
                            { nombre: "3 de Noviembre", pj: 10, pts: 12, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "4 de Octubre", pj: 10, pts: 12, gf:0, gc:0, dg:0, nota: "Clasificado" },
                            { nombre: "Sportivo Villetano", pj: 10, pts: 3, gf:0, gc:0, dg:0, nota: "* Eliminado" }
                        ]
                    }
                },
                "octavosDeFinal": [ // Resultados de IDA no disponibles, solo cruces
                    { llave: "A", equipoLocal: "3 de Febrero", scoreLocal: "vs", equipoVisitante: "2 de Mayo", scoreVisitante: "", info: "Ida (Pendiente)" },
                    { llave: "B", equipoLocal: "22 de Mayo", scoreLocal: "vs", equipoVisitante: "12 de Octubre", scoreVisitante: "", info: "Ida (Pendiente) - Cruce Ajustado" },
                    { llave: "C", equipoLocal: "1º de Mayo", scoreLocal: "vs", equipoVisitante: "Libertad", scoreVisitante: "", info: "Ida (Pendiente)" },
                    { llave: "D", equipoLocal: "Itá Ybaté", scoreLocal: "vs", equipoVisitante: "4 de Octubre", scoreVisitante: "", info: "Ida (Pendiente)" },
                    { llave: "E", equipoLocal: "Hijos de Mayo", scoreLocal: "vs", equipoVisitante: "1º de Marzo", scoreVisitante: "", info: "Ida (Pendiente) - Cruce Ajustado" },
                    { llave: "F", equipoLocal: "Cumbariteño", scoreLocal: "vs", equipoVisitante: "Cerro León", scoreVisitante: "", info: "Ida (Pendiente)" },
                    { llave: "G", equipoLocal: "Lomas Valentinas", scoreLocal: "vs", equipoVisitante: "Universo", scoreVisitante: "", info: "Ida (Pendiente) - Cruce Ajustado" },
                    { llave: "H", equipoLocal: "Mcal Estigarribia", scoreLocal: "vs", equipoVisitante: "3 de Noviembre", scoreVisitante: "", info: "Ida (Pendiente)" }
                ]
            }
        };

        // Clubes y sus logos (placeholders de texto)
        const clubLogos = {
            "12 de Octubre": "12O", "2 de Mayo": "2M", "8 de Diciembre": "8D", "Cerro León": "CL", "Itá Ybaté": "IY",
            "Lomas Valentinas": "LV", "Universo": "U", "13 de Mayo": "13M", "1º de Marzo": "1Mzo", "1º de Mayo": "1My",
            "22 de Mayo": "22M", "3 de Febrero": "3F", "Mcal Estigarribia": "ME", "3 de Noviembre": "3N",
            "4 de Octubre": "4O", "Cumbariteño": "CUM", "Hijos de Mayo": "HM", "Libertad": "LIB", "Sportivo Villetano": "SV"
        };

        function getLogoPlaceholder(teamName) {
            return clubLogos[teamName] || teamName.substring(0, 2).toUpperCase();
        }

        function renderTable(serieData) {
            let tableHTML = `
                <div class="card mb-8 overflow-hidden">
                    <div class="series-title text-center">${serieData.nombre}</div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="table-header">
                                <tr>
                                    <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pos</th>
                                    <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Equipo</th>
                                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pts</th>
                                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">PJ</th>
                                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">GF</th>
                                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">GC</th>
                                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">DG</th>
                                    <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nota</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">`;
            
            serieData.equipos.forEach((equipo, index) => {
                let rowClass = "";
                if (equipo.nota.includes("* Eliminado")) rowClass = "eliminated";
                else if (equipo.nota.includes("✓ Cabeza de Serie")) rowClass = "qualified-head font-semibold";
                else if (equipo.nota.includes("✓✓ Clasificado") || equipo.nota.includes("# Clasificado")) rowClass = "qualified-second";

                tableHTML += `
                    <tr class="${rowClass}">
                        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-700">${index + 1}</td>
                        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 flex items-center">
                            <span class="team-logo-sm">${getLogoPlaceholder(equipo.nombre)}</span>
                            ${equipo.nombre}
                        </td>
                        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center font-bold">${equipo.pts}</td>
                        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center">${equipo.pj}</td>
                        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center hidden md:table-cell">${equipo.gf || '-'}</td>
                        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center hidden md:table-cell">${equipo.gc || '-'}</td>
                        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-center hidden md:table-cell">${equipo.dg || '-'}</td>
                        <td class="px-3 py-3 whitespace-nowrap text-xs ${rowClass}">${equipo.nota}</td>
                    </tr>`;
            });
            tableHTML += `</tbody></table></div></div>`;
            return tableHTML;
        }

        function renderOctavos(octavosData, categoryName) {
            let octavosHTML = `
                <div class="mb-10">
                    <h2 class="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-500 pb-2">Octavos de Final - ${categoryName}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;

            octavosData.forEach(partido => {
                octavosHTML += `
                    <div class="card p-5 octavos-card">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm font-semibold text-blue-600">Llave ${partido.llave}</span>
                            <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">${partido.info}</span>
                        </div>
                        <div class="flex items-center justify-around text-center">
                            <div class="flex-1 flex flex-col items-center px-1">
                                <div class="team-logo-octavos">${getLogoPlaceholder(partido.equipoLocal)}</div>
                                <span class="font-medium text-sm mt-1">${partido.equipoLocal}</span>
                            </div>
                            <span class="match-score">${partido.scoreLocal} ${partido.scoreLocal === 'vs' ? '' : '-'} ${partido.scoreVisitante}</span>
                            <div class="flex-1 flex flex-col items-center px-1">
                                <div class="team-logo-octavos">${getLogoPlaceholder(partido.equipoVisitante)}</div>
                                <span class="font-medium text-sm mt-1">${partido.equipoVisitante}</span>
                            </div>
                        </div>
                        ${partido.goles ? `<p class="text-xs text-gray-500 mt-3 text-center">Goles: ${partido.goles}</p>` : ''}
                        ${partido.info.includes("Ajustado") ? `<p class="text-xs text-orange-600 mt-2 text-center font-medium">Cruce ajustado por reglamento.</p>`: ''}
                    </div>`;
            });
            octavosHTML += `</div></div>`;
            return octavosHTML;
        }

        function showCategory(categoryName) {
            const contentArea = document.getElementById('contentArea');
            const data = tournamentData[categoryName];
            let htmlOutput = `<div class="fade-in">`;

            htmlOutput += `<h2 class="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-500 pb-2">Tablas de Posiciones - Fase de Grupos - ${data.nombre}</h2>`;
            htmlOutput += '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">';
            for (const serieKey in data.faseDeGrupos) {
                htmlOutput += `<div class="lg:col-span-1">${renderTable(data.faseDeGrupos[serieKey])}</div>`;
            }
            htmlOutput += '</div>';
            
            if (data.octavosDeFinal) {
                htmlOutput += renderOctavos(data.octavosDeFinal, data.nombre);
            }
            htmlOutput += `</div>`;
            contentArea.innerHTML = htmlOutput;

            // Actualizar botones activos
            document.getElementById('tabPrincipal').classList.toggle('active', categoryName === 'Principal');
            document.getElementById('tabJuvenil').classList.toggle('active', categoryName === 'Juvenil');
        }

        document.getElementById('currentYear').textContent = new Date().getFullYear();
        // Cargar datos de la categoría Principal por defecto
        showCategory('Principal');
    </script>

</body>
</html>
