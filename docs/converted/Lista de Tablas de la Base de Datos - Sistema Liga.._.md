# Converted from Lista de Tablas de la Base de Datos - Sistema Liga.._.docx

Lista de Tablas de la Base de Datos (Estructura Final)
Aquí tienes la lista completa de todas las tablas, agrupadas por su módulo funcional principal.
Módulo 1: Administración y Configuración
Ligas: Almacena la información de la liga organizadora.
Roles: Define los permisos de los usuarios administrativos (Admin, Delegado, etc.).
Usuarios: Cuentas del personal administrativo que gestiona el sistema.
Estadios: Registro de todas las canchas y estadios disponibles.
Módulo 2: Gestión Deportiva
Personas: Tabla central para los datos personales (nombres, CI, etc.).
Jugadores: Datos deportivos específicos de un jugador.
Cuerpos_Tecnicos: Datos del personal técnico.
Arbitros: Datos de los árbitros.
Clubes: Perfil e información de cada club de la liga.
Clubes_Palmares: Sub-tabla para registrar el historial de títulos de cada club.
Torneos: Define un campeonato en general (ej. "Súper Liga Villetana 2025").
Fases_Torneo: Define las etapas del torneo (Fase de Grupos, Octavos, etc.).
Grupos_Fase: Define las series (A, B, C) dentro de una fase de grupos.
Equipos: Representa la inscripción de un club a un torneo en una categoría específica.
Equipos_Grupos_Fase: Tabla de unión que asigna equipos a los grupos.
Jugadores_Equipos: Tabla de unión que forma la plantilla (lista de buena fe) de un equipo.
Módulo 3: Competición
Partidos: Almacena toda la información de cada encuentro programado.
Alineaciones: La planilla oficial de jugadores y CT presentada para un partido.
Eventos_Partido: El registro de cada incidente del partido (goles, tarjetas, cambios).
Llaves_Eliminatorias: Define la estructura del "bracket" en las fases de eliminación directa.
Sanciones_Vigentes: Gestiona las suspensiones activas de jugadores, CTs, etc.
Informes_Arbitrales: Almacena el informe oficial y seguro de cada partido.
Módulo 4: Gestión Financiera
Conceptos_Cobro: Define los tipos de cobro (inscripción, multas, etc.).
Cargos_Club: Registra las deudas de los clubes.
Pagos_Recibidos: Registra los pagos que la liga recibe.
Pagos_Cargos_Aplicados: Tabla de unión que vincula un pago a una deuda específica.
Módulo 5: Entradas y Boleterías
Precios_Entradas_Fase: Define el costo de las entradas según la etapa del torneo.
Ventas_Entradas: Registra cada transacción de venta de boletas.
Boletas_Vendidas: Registra cada ticket individual con un código único (para impresión y QR).
Módulo 6: Gestión de Acreditaciones
Tipos_Acreditacion: Define los tipos de credencial (Prensa, CT Visitante, etc.).
Planes_Acreditacion_Prensa: Define los planes de pago para la prensa (si aplica).
Acreditados: Registro de personas (principalmente prensa) que pueden solicitar acreditación.
Acreditaciones_Emitidas: Registra cada credencial específica generada.
Módulo 7: Comunidad y Engagement
Aficionados: Cuentas de los usuarios públicos (hinchas) que se registran en el portal.
Noticias_Club: Contenido y noticias publicadas por los propios clubes.
Calificaciones_Publicas: Las puntuaciones que los aficionados dan a jugadores, clubes, partidos, etc.
Comentarios_Publicos: Los comentarios de los aficionados en noticias, partidos, etc.
Módulo 8: Gestión Disciplinaria y Administrativa
Expedientes: Registro central para protestas de partidos y notas oficiales.
Documentos_Adjuntos: Para subir los archivos físicos escaneados de una protesta o nota.
Esta lista te da una vista general de toda la estructura de datos que hemos diseñado.