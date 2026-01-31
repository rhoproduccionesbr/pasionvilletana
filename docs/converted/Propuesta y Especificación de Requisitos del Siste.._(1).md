# Converted from Propuesta y Especificación de Requisitos del Siste.._(1).docx

Propuesta y Especificación de Requisitos del Sistema de Gestión para la Liga Villetana de Fútbol
Versión: 1.0 Fecha: 5 de Junio de 2025 Preparado para: La Honorable Comisión Directiva de la Liga Villetana de Fútbol
Índice:
Introducción 1.1. Propósito de este Documento 1.2. Alcance del Sistema Propuesto 1.3. Objetivos del Sistema 1.4. Definiciones, Acrónimos y Abreviaturas 1.5. Referencias 1.6. Visión General del Documento
Descripción General del Sistema 2.1. Perspectiva del Producto 2.2. Funciones Principales del Sistema (Módulos) 2.3. Características de los Usuarios 2.4. Restricciones Generales (Preliminares) 2.5. Suposiciones y Dependencias
Requisitos Específicos 3.1. Requisitos Funcionales 3.1.1. Módulo de Administración General y Configuración 3.1.2. Módulo de Gestión Deportiva 3.1.3. Módulo de Competición 3.1.4. Módulo de Gestión Financiera 3.1.5. Módulo de Entradas y Boleterías 3.1.6. Módulo de Acreditaciones 3.1.7. Módulo Público / Portal Web 3.2. Requisitos de Interfaz de Usuario (UI/UX) 3.3. Requisitos de Base de Datos 3.4. Requisitos No Funcionales 3.4.1. Rendimiento 3.4.2. Seguridad 3.4.3. Confiabilidad 3.4.4. Escalabilidad 3.4.5. Mantenibilidad 3.4.6. Usabilidad
Reglas de Negocio Clave (Ejemplificadas con Súper Liga Villetana 2025) 4.1. Estructura de Torneos (Fases, Grupos, Eliminatorias) 4.2. Cálculo de Tablas de Posiciones 4.3. Criterios de Desempate 4.4. Regla Especial de Clasificación Inter-categorías (Octavos Juvenil/Principal)
Anexos (Referencias a Documentos Detallados)
Formulario de Aprobación
1. Introducción
1.1. Propósito de este Documento
El propósito de este documento es detallar los requisitos funcionales y no funcionales para el desarrollo e implementación de un Sistema de Gestión Integral para la Liga Villetana de Fútbol (LVF). Servirá como base para el diseño, desarrollo, pruebas y validación final del sistema por parte de la Comisión Directiva de la LVF.
1.2. Alcance del Sistema Propuesto
El sistema propuesto tiene como objetivo modernizar y centralizar la gestión de todas las actividades relacionadas con los torneos organizados por la Liga Villetana de Fútbol. Esto incluye:
La administración de la liga, clubes, jugadores, cuerpos técnicos y árbitros.
La planificación y gestión completa de torneos, desde la creación hasta la finalización, incluyendo la generación de fixtures y el registro de resultados.
El cálculo automático de tablas de posiciones y estadísticas.
La gestión financiera de inscripciones, multas y tarjetas.
La administración de la venta de entradas y el control de acceso a los estadios.
La gestión de acreditaciones para prensa y personal autorizado.
Un portal web público para la difusión de información (fixtures, resultados, tablas, noticias).
1.3. Objetivos del Sistema
Centralizar la información: Disponer de una única fuente de verdad para todos los datos de la liga.
Automatizar procesos: Reducir la carga de trabajo manual en la generación de fixtures, cálculo de tablas, gestión de sanciones, etc.
Mejorar la transparencia: Ofrecer información actualizada y accesible para clubes, jugadores y aficionados.
Optimizar la gestión financiera: Facilitar el control de ingresos por inscripciones, multas y venta de entradas.
Modernizar la imagen de la Liga: Proyectar una imagen de organización eficiente y tecnológicamente adaptada.
Facilitar la toma de decisiones: Proveer datos y reportes que ayuden a la directiva de la liga.
Mejorar la experiencia: Tanto para los administradores de la liga como para los clubes y el público en general.
1.4. Definiciones, Acrónimos y Abreviaturas
LVF: Liga Villetana de Fútbol.
UFI: Unión del Fútbol del Interior.
APF: Asociación Paraguaya de Fútbol.
SRS: Software Requirements Specification (Especificación de Requisitos del Sistema).
SLV2025: Súper Liga Villetana 2025 (usada como ejemplo principal para definir reglas).
CRUD: Create, Read, Update, Delete (Operaciones básicas de gestión de datos).
UI: User Interface (Interfaz de Usuario).
UX: User Experience (Experiencia de Usuario).
BD: Base de Datos.
API: Application Programming Interface (Interfaz de Programación de Aplicaciones).
POS: Point of Sale (Punto de Venta).
ED: Enfrentamientos Directos.
DG: Diferencia de Goles.
GF: Goles a Favor.
GC: Goles en Contra.
TR: Tarjetas Rojas.
1.5. Referencias
Documentos proporcionados por la Liga Villetana de Fútbol:
"clubes.pdf"
"Directrices de ejecución súper liga villetana .docx"
"Resultados lvf.docx"
"Resumen Súper Liga Villetana 2025" (Documento Google)
"Resultados Detallados Súper Liga Villetana 2025 po..." (Documento Google)
Imágenes de logos de los clubes.
"Reglamento General UFI 2018.pdf".
Discusiones y análisis colaborativos realizados para la definición de este proyecto.
1.6. Visión General del Documento
Este documento se estructura de la siguiente manera: la Sección 2 ofrece una descripción general del sistema. La Sección 3 detalla los requisitos específicos, divididos en funcionales, de interfaz, de base de datos y no funcionales. La Sección 4 profundiza en reglas de negocio clave ejemplificadas. La Sección 5 lista los anexos con información de apoyo, y la Sección 6 es el formulario para la aprobación formal por parte de la Liga.
2. Descripción General del Sistema
2.1. Perspectiva del Producto
El Sistema de Gestión para la Liga Villetana de Fútbol será una aplicación web integral, accesible a través de navegadores en computadoras de escritorio y dispositivos móviles. Estará diseñado para ser la herramienta central de operaciones de la liga, con diferentes niveles de acceso y funcionalidades según el rol del usuario.
2.2. Funciones Principales del Sistema (Módulos)
El sistema se compondrá de los siguientes módulos interconectados:
Administración General y Configuración: Gestión de usuarios, roles, permisos, parámetros generales del sistema y de la liga, estadios.
Gestión Deportiva: Administración de temporadas, torneos, categorías, clubes (con sus logos), equipos, jugadores, cuerpos técnicos y árbitros. Incluye la gestión de fichajes y plantillas.
Competición: Generación y gestión de fixtures (calendarios), registro detallado de resultados y eventos de partidos (goles, tarjetas, sustituciones), cálculo automático de tablas de posiciones, gestión de sanciones y estadísticas.
Gestión Financiera: Administración de conceptos de cobro, facturación y seguimiento de pagos por inscripciones de equipos, multas disciplinarias y tarjetas.
Entradas y Boleterías: Gestión de tipos de entrada, precios (configurables por fase del torneo), un sistema de punto de venta (POS) para las boleterías de los clubes, registro de ventas y (potencialmente) sincronización en tiempo real. Incluye gestión de costos de estacionamiento.
Acreditaciones: Gestión de solicitudes, emisión y control de acreditaciones para prensa, cuerpos técnicos, jugadores no convocados y otros roles autorizados que no pagan entrada.
Portal Público / Web: Una interfaz web accesible al público para visualizar información del torneo: noticias, fixtures, resultados en vivo (si se implementa), tablas de posiciones, estadísticas de jugadores y equipos.
2.3. Características de los Usuarios
El sistema será utilizado por diversos roles, cada uno con accesos y permisos específicos:
Administrador de la Liga (Superadministrador): Acceso total a todas las funcionalidades del sistema. Encargado de la configuración global, supervisión y gestión general.
Administrador de Torneo: Encargado de la configuración y gestión de torneos específicos (puede ser un rol del Administrador de Liga).
Delegados de Clubes: Acceso para inscribir equipos y jugadores de su club, cargar alineaciones previas a los partidos (según permisos), consultar estado financiero de su club, y gestionar solicitudes de acreditación para su personal.
Operador de Partido / Planillero / Veedor: Encargado de registrar los eventos del partido en tiempo real o posteriormente (goles, tarjetas, sustituciones, resultado final, observaciones).
Árbitros (Potencial): Podrían tener acceso para cargar/validar informes de partidos.
Operador de Boletería (Club): Acceso al sistema de punto de venta para registrar la venta de entradas y estacionamiento en los días de partido.
Gestor de Acreditaciones (Liga/Club): Encargado de procesar solicitudes, emitir y controlar acreditaciones.
Prensa (Potencial, con Acreditación): Acceso restringido a información para difusión, estadísticas.
Público General / Aficionados: Acceso de solo lectura al Portal Web para consultar información de los torneos.
2.4. Restricciones Generales (Preliminares)
El sistema debe ser accesible a través de navegadores web estándar.
Para el módulo de boleterías en los clubes, se requerirá una conexión a internet estable para la sincronización (o un modo offline limitado con sincronización posterior).
El desarrollo se realizará considerando las mejores prácticas para asegurar la calidad y mantenibilidad.
(Otras restricciones como presupuesto, plazos, y recursos humanos específicos para el desarrollo se definirán en el Plan de Proyecto Detallado).
2.5. Suposiciones y Dependencias
La Liga Villetana de Fútbol proporcionará la información necesaria y actualizada para la carga inicial y el mantenimiento del sistema (datos de clubes, jugadores, reglamentos específicos, etc.).
Existirá una colaboración activa por parte de los representantes de la Liga para la validación de requisitos, diseños y pruebas del sistema.
Los futuros usuarios del sistema recibirán la capacitación adecuada.
Se dispondrá de la infraestructura de hosting necesaria para el despliegue del sistema.
3. Requisitos Específicos
3.1. Requisitos Funcionales
A continuación, se detallan las funcionalidades esperadas para cada módulo. (Se omite la repetición exhaustiva de cada CRUD si ya fue detallado en documentos anteriores, enfocándose en la funcionalidad clave).
3.1.1. Módulo de Administración General y Configuración
Gestión de usuarios: alta, baja, modificación, asignación de roles.
Gestión de roles y permisos granulares.
Configuración de datos de la Liga (nombre, logo, contacto).
Gestión de estadios: registro, asignación a clubes, datos de capacidad.
Configuración de parámetros financieros: conceptos de cobro, montos por defecto para tarjetas/multas.
Configuración de parámetros de torneos: tipos de torneo, formatos de fase por defecto.
Configuración de tipos de acreditación y plantillas (si aplica).
3.1.2. Módulo de Gestión Deportiva
Temporadas: Crear, editar, archivar temporadas (ej. "Temporada 2025").
Categorías: Gestionar categorías (ej. "Principal", "Juvenil", "Sub-17").
Torneos:
Crear y configurar torneos detalladamente (nombre, homenaje, temporada, categoría(s) asociadas, formato general).
Definir y gestionar Fases del Torneo (ej. "Fase de Grupos", "Octavos de Final") con su tipo (grupos, eliminatoria ida/vuelta), orden, y reglas específicas de clasificación y emparejamiento (almacenadas para flexibilidad, ej. en JSON).
Dentro de una fase de grupos, definir Grupos/Series (ej. "Serie A", "Serie B") y cuántos equipos clasifican de cada uno.
Clubes:
Registro completo de clubes (nombre, fundación, sede, colores, escudo - carga de imagen, datos de contacto del delegado).
Equipos:
Inscripción de equipos por club a un torneo y categoría específica (ej. "Cerro León - Principal", "Cerro León - Juvenil").
Asignación de cuerpo técnico.
Gestión de la plantilla del equipo para un torneo (lista de buena fe).
Personas: Registro centralizado de datos personales (base para jugadores, CT, árbitros).
Jugadores:
Registro detallado (datos personales, foto, posición, historial, estado de habilitación).
Asignación a equipos con número de camiseta.
Control de documentación (carnets, fichas médicas - registro de estado).
Cuerpos Técnicos (CT): Registro y asignación a equipos.
Árbitros: Registro, categorización, asignación a partidos (o registro de círculo arbitral).
3.1.3. Módulo de Competición
Generación de Fixtures (Calendario):
Automática para fase de grupos (considerando series, número de equipos, descansos, ida y vuelta).
Manual o asistida para fases eliminatorias (basada en clasificados y sorteo/reglas de emparejamiento).
Programación de partidos: fecha, hora, estadio, jornada. Posibilidad de reprogramar.
Gestión de Partidos:
Carga de alineaciones (titulares, suplentes, capitán) antes del partido.
Registro de eventos del partido: inicio/fin, goles (jugador, minuto, tipo: jugada, penal, en contra), tarjetas (amarilla, roja directa, doble amarilla - jugador, minuto, motivo), sustituciones.
Carga de resultado final.
Gestión de estado del partido (Programado, En Curso, Finalizado, Suspendido, Pendiente Tribunal).
Opción para registrar observaciones del árbitro/veedor.
Tablas de Posiciones:
Cálculo automático y actualización en tiempo real para fase de grupos.
Aplicación de criterios de desempate definidos para el torneo (Ver Sección 4.3).
Gestión de Sanciones:
Registro automático de suspensiones por acumulación de tarjetas (según reglamento del torneo).
Registro manual de sanciones disciplinarias adicionales.
Seguimiento del cumplimiento de sanciones.
Gestión de Fases Eliminatorias:
Definición de Llaves Eliminatorias (ej. Octavos A, B, etc.) para cada categoría.
Asignación de equipos a las llaves (considerando la regla especial Principal/Juvenil para SLV2025).
Registro de partidos de ida y vuelta para cada llave.
Cálculo del ganador de la llave (resultado global, goles de visitante si aplica, penales).
Progresión automática (o asistida) al siguiente nivel del bracket (Cuartos, Semis, Final).
Estadísticas: Tabla de goleadores, valla menos vencida, fair play (si se implementa), etc.
Gestión de Partidos Pendientes de Tribunal: Marcar partidos y actualizar resultados/puntos según fallo.
3.1.4. Módulo de Gestión Financiera
Configuración de conceptos de cobro (inscripción, tipo de tarjeta, tipo de multa).
Establecimiento de montos (pueden ser configurables por torneo/temporada).
Generación automática de cargos a clubes por:
Inscripción a torneos.
Tarjetas recibidas por sus jugadores durante los partidos.
Multas disciplinarias.
Gestión de estado de cuenta por club (cargos pendientes, pagos realizados, saldo).
Registro de pagos recibidos de los clubes.
Generación de facturas/recibos simples.
Reportes financieros básicos (ingresos por concepto, saldos pendientes).
3.1.5. Módulo de Entradas y Boleterías
Configuración de tipos de entrada (General, Preferencia, etc.) y sus precios.
Precios configurables por fase del torneo (ej. Fase de Grupos vs. Fase Final).
Sistema de Punto de Venta (POS) simplificado para boleterías de clubes:
Selección del partido actual.
Venta de entradas y registro de pago.
(Opcional) Impresión de tickets o generación de entrada digital (QR).
Registro de venta de tickets de estacionamiento.
Sincronización de ventas con el sistema central (idealmente en tiempo real o lo más cercano posible).
Reportes de recaudación por partido y por club.
(Opcional) Venta online anticipada.
3.1.6. Módulo de Acreditaciones
Definición de tipos de acreditación (Prensa, Cuerpo Técnico Visitante, Jugador Local no Convocado, Directivo, etc.).
Registro de personas/entidades que solicitan o reciben acreditación.
Asociación a un torneo o partidos específicos.
Emisión de listados de acreditados.
(Opcional) Generación de credenciales digitales (con QR) o datos para impresión.
Interfaz para control de acceso (verificación de validez de acreditación).
3.1.7. Módulo Público / Portal Web
Diseño atractivo, responsivo y fácil de navegar.
Visualización de información de torneos activos (Principal y Juvenil).
Sección de Noticias y Comunicados de la Liga.
Calendario de Partidos (Fixtures) con fechas, horarios y sedes.
Resultados de partidos actualizados.
Tablas de Posiciones detalladas y actualizadas en tiempo real.
Estadísticas del torneo (goleadores, etc.).
Perfiles básicos de clubes (con su logo) y (opcionalmente) de jugadores.
Información sobre venta de entradas (puntos de venta, precios).
(Opcional) Sección para solicitud de acreditaciones de prensa.
3.2. Requisitos de Interfaz de Usuario (UI/UX)
La interfaz debe ser intuitiva y fácil de usar para todos los roles de usuario, minimizando la curva de aprendizaje.
El diseño debe ser limpio, moderno y profesional, reflejando la identidad de la Liga Villetana de Fútbol.
Se utilizarán los esquemas de colores distintivos para cada club donde sea apropiado para mejorar la identificación visual (ver Anexo correspondiente).
La aplicación web debe ser completamente responsiva, adaptándose a diferentes tamaños de pantalla (escritorio, tablets, móviles).
Se proporcionará retroalimentación clara al usuario después de cada acción (mensajes de éxito, error, carga).
La navegación debe ser clara y consistente en todo el sistema.
3.3. Requisitos de Base de Datos
Se utilizará una base de datos relacional (ej. PostgreSQL, MySQL) para asegurar la integridad y consistencia de los datos.
El diseño de la BD (ver Anexo: Esquema de Base de Datos Refinado) debe soportar todas las funcionalidades descritas, incluyendo la estructura de torneos con fases, grupos, llaves eliminatorias, y las relaciones entre entidades.
Se implementarán índices adecuados para optimizar el rendimiento de las consultas.
Se establecerán mecanismos para copias de seguridad regulares y recuperación de datos.
3.4. Requisitos No Funcionales
3.4.1. Rendimiento
Las páginas del portal público deben cargar rápidamente (objetivo: < 3 segundos).
Las operaciones comunes en el panel de administración (ej. carga de resultados, generación de tablas) deben ejecutarse de manera eficiente.
El sistema debe ser capaz de manejar la carga de datos y usuarios esperada por la Liga Villetana.
3.4.2. Seguridad
Implementación de autenticación segura (contraseñas hasheadas).
Protección contra vulnerabilidades web comunes (XSS, SQL Injection, etc.).
Manejo de roles y permisos para asegurar que los usuarios solo accedan a la información y funcionalidades que les corresponden.
Transmisión de datos sensibles (si aplica) mediante HTTPS.
Protección de datos personales de acuerdo con las regulaciones aplicables.
3.4.3. Confiabilidad
Alta disponibilidad del sistema, especialmente durante los fines de semana de partidos.
Manejo adecuado de errores y excepciones para evitar caídas del sistema.
Consistencia de los datos en todo momento.
3.4.4. Escalabilidad
La arquitectura del sistema debe permitir el crecimiento futuro en términos de cantidad de datos (más torneos, jugadores, etc.) y número de usuarios.
3.4.5. Mantenibilidad
El código fuente debe estar bien documentado, ser modular y seguir buenas prácticas de desarrollo para facilitar el mantenimiento y futuras actualizaciones.
3.4.6. Usabilidad
El sistema debe ser fácil de aprender y utilizar por personas con diferentes niveles de habilidad técnica. (Se relaciona con UI/UX).
4. Reglas de Negocio Clave (Ejemplificadas con Súper Liga Villetana 2025)
4.1. Estructura de Torneos (Fases, Grupos, Eliminatorias)
El sistema debe permitir configurar torneos con múltiples fases (ej. Fase de Grupos, Octavos, Cuartos, Semifinal, Final).
La Fase de Grupos puede dividirse en múltiples Series/Grupos (ej. Serie A, B, C de SLV2025).
Cada grupo tendrá un formato de "todos contra todos" a ida y vuelta (o configurable).
Las Fases Eliminatorias se jugarán a ida y vuelta (acumulando resultados) o partido único, según se configure.
4.2. Cálculo de Tablas de Posiciones
Puntos: 3 por victoria, 1 por empate, 0 por derrota (configurable).
Cálculo de PJ, PG, PE, PP, GF, GC, DG.
Actualización automática tras el registro de cada resultado.
4.3. Criterios de Desempate (Ejemplo SLV2025 Fase de Grupos)
El sistema debe poder aplicar los siguientes criterios en orden de prioridad para equipos empatados en puntos:
Enfrentamientos Directos (ED): Considerar partidos jugados solo entre los equipos empatados.
Puntos en ED.
Diferencia de Goles en ED.
Goles a Favor en ED.
Diferencia de Goles Global (DG): En todos los partidos de la fase de grupos.
Mayor Cantidad de Goles a Favor Global (GF): (Si DG es igual).
Fair Play (Menos Tarjetas Rojas): Menor número de tarjetas rojas directas + rojas por doble amarilla.
Sorteo: Como último recurso (el sistema indicaría la necesidad de un sorteo).
4.4. Regla Especial de Clasificación Inter-categorías (Octavos Juvenil/Principal - Ejemplo SLV2025)
El sistema debe contemplar la lógica específica donde, para los Octavos de Final de la Categoría Juvenil, si un club clasificado en Juvenil no tiene a su equipo de Primera clasificado, y el club rival sí, el equipo Juvenil puede ser reemplazado por otro equipo Juvenil (según reglas de "acompañamiento" definidas por la Liga).
Esto requerirá una configuración flexible de las llaves eliminatorias y, posiblemente, una intervención administrativa para confirmar estos reemplazos.
5. Anexos (Referencias a Documentos Detallados)
Anexo A: Esquema de Base de Datos Detallado y Refinado (Ver documento esquema_bd_liga_futbol_refinado).
Anexo B: Mapa Mental de la Base de Datos (Ver documento mapa_mental_bd_slv2025).
Anexo C: Propuesta de Esquemas de Color por Club (Ver documento esquemas_color_clubes_lvf).
Anexo D: Simulación de Cálculo de Tabla de Posiciones (Ver documento simulacion_tabla_posiciones_slv2025).
Anexo E: Maqueta Visual del Portal Público (Referencia al archivo HTML dashboard_slv2025 y pagina_web_liga_villetana generados como ejemplos).
Anexo F: Plan de Proyecto y Seguimiento (Tareas) (Ver documento plan_proyecto_liga_villetana).
6. Formulario de Aprobación
Por la presente, la Comisión Directiva de la Liga Villetana de Fútbol manifiesta haber revisado este Documento de Especificación de Requisitos del Sistema y estar de acuerdo con su contenido. Se aprueba el inicio de las siguientes fases del proyecto (Diseño Detallado y Desarrollo) basadas en estos requisitos.
Representantes de la Liga Villetana de Fútbol:
Nombre: _________________________________________ Cargo: __________________________________________ Firma: __________________________________________ Fecha: _______________
Nombre: _________________________________________ Cargo: __________________________________________ Firma: __________________________________________ Fecha: _______________
(Espacio para más firmas si es necesario)