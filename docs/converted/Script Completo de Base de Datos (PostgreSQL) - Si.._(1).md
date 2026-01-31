# Converted from Script Completo de Base de Datos (PostgreSQL) - Si.._(1).docx

-- #############################################################################
-- # Script de Base de Datos para el Sistema de Gestión Liga Villetana de Fútbol
-- # Versión de Esquema: 8.0 (Final)
-- # SGBD: PostgreSQL
-- # Fecha: 07 de Junio de 2025
-- #############################################################################

-- Habilitar la extensión para generar UUIDs (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- #############################################################################
-- # MÓDULO 1: ADMINISTRACIÓN Y CONFIGURACIÓN
-- #############################################################################

-- Tabla para la Liga
CREATE TABLE Ligas (
    liga_id SERIAL PRIMARY KEY,
    nombre_liga VARCHAR(255) NOT NULL UNIQUE,
    siglas VARCHAR(20) UNIQUE,
    fecha_fundacion DATE,
    direccion_sede VARCHAR(255),
    email_contacto VARCHAR(100),
    telefono_contacto VARCHAR(50),
    logo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Roles de Usuario (Administrativo)
CREATE TABLE Roles (
    rol_id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL UNIQUE,
    descripcion_rol TEXT
);

-- Tabla para Clubes Afiliados
CREATE TABLE Clubes (
    club_id SERIAL PRIMARY KEY,
    liga_id INT NOT NULL REFERENCES Ligas(liga_id),
    nombre_oficial VARCHAR(255) NOT NULL UNIQUE,
    nombre_corto VARCHAR(50),
    fecha_fundacion DATE,
    sede_o_compania VARCHAR(255),
    escudo_url VARCHAR(255),
    colores_primario VARCHAR(50),
    colores_secundario VARCHAR(50),
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo', -- 'Activo', 'Suspendido', 'En Receso', 'Desafiliado'
    historia_breve TEXT,
    red_social_facebook VARCHAR(255),
    red_social_twitter VARCHAR(255),
    red_social_instagram VARCHAR(255),
    promedio_calificacion DECIMAL(3, 2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Usuarios (Personal Administrativo)
CREATE TABLE Usuarios (
    usuario_id SERIAL PRIMARY KEY,
    rol_id INT NOT NULL REFERENCES Roles(rol_id),
    club_id INT REFERENCES Clubes(club_id),
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo', -- 'Activo', 'Inactivo', 'Bloqueado'
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Estadios
CREATE TABLE Estadios (
    estadio_id SERIAL PRIMARY KEY,
    club_propietario_id INT REFERENCES Clubes(club_id),
    nombre_estadio VARCHAR(255) NOT NULL UNIQUE,
    direccion_o_localidad VARCHAR(255),
    capacidad_aprox INT,
    estado VARCHAR(50) NOT NULL DEFAULT 'Habilitado', -- 'Habilitado', 'En Reparación', 'Suspendido', 'Requiere Inspección'
    promedio_calificacion DECIMAL(3, 2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #############################################################################
-- # MÓDULO 2: GESTIÓN DEPORTIVA
-- #############################################################################

-- Tabla base para datos personales
CREATE TABLE Personas (
    persona_id SERIAL PRIMARY KEY,
    nombres VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    documento_identidad VARCHAR(50) UNIQUE,
    fecha_nacimiento DATE,
    nacionalidad VARCHAR(100) DEFAULT 'Paraguaya',
    foto_url VARCHAR(255)
);

-- Tabla para Palmarés de Clubes
CREATE TABLE Clubes_Palmares (
    palmares_id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES Clubes(club_id),
    nombre_torneo_logro VARCHAR(255) NOT NULL,
    temporada_logro VARCHAR(50) NOT NULL,
    posicion_lograda VARCHAR(100) NOT NULL -- Ej. 'Campeón', 'Vice-Campeón'
);

-- Tabla para Jugadores
CREATE TABLE Jugadores (
    jugador_id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE REFERENCES Personas(persona_id),
    posicion_principal VARCHAR(100),
    pie_habil VARCHAR(50),
    estado VARCHAR(50) NOT NULL DEFAULT 'Habilitado', -- 'Habilitado', 'Suspendido', 'Lesionado'
    promedio_calificacion DECIMAL(3, 2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0
);

-- Tabla para Cuerpos Técnicos
CREATE TABLE Cuerpos_Tecnicos (
    ct_id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE REFERENCES Personas(persona_id),
    tipo_ct VARCHAR(100) NOT NULL, -- 'Director Técnico', 'Asistente Técnico', 'Preparador Físico', etc.
    estado VARCHAR(50) NOT NULL DEFAULT 'Habilitado' -- 'Habilitado', 'Suspendido'
);

-- Tabla para Árbitros
CREATE TABLE Arbitros (
    arbitro_id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE REFERENCES Personas(persona_id),
    usuario_id INT UNIQUE REFERENCES Usuarios(usuario_id),
    categoria_arbitro VARCHAR(100),
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo' -- 'Activo', 'Inactivo', 'Suspendido'
);

-- Tabla para Torneos
CREATE TABLE Torneos (
    torneo_id SERIAL PRIMARY KEY,
    temporada VARCHAR(50) NOT NULL,
    nombre_torneo VARCHAR(255) NOT NULL,
    nombre_homenaje TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado_torneo VARCHAR(50) NOT NULL DEFAULT 'Planificado', -- 'Planificado', 'En Curso', 'Finalizado', 'Cancelado'
    reglamento_url VARCHAR(255)
);

-- Tabla para Fases del Torneo
CREATE TABLE Fases_Torneo (
    fase_id SERIAL PRIMARY KEY,
    torneo_id INT NOT NULL REFERENCES Torneos(torneo_id),
    nombre_fase VARCHAR(100) NOT NULL,
    tipo_fase VARCHAR(50) NOT NULL, -- 'GRUPOS', 'ELIMINATORIA_IDA_VUELTA', etc.
    orden_secuencia_fase INT NOT NULL,
    reglas_clasificacion_json JSONB,
    reglas_emparejamiento_json JSONB
);

-- Tabla para Grupos dentro de una Fase
CREATE TABLE Grupos_Fase (
    grupo_id SERIAL PRIMARY KEY,
    fase_id INT NOT NULL REFERENCES Fases_Torneo(fase_id),
    nombre_grupo VARCHAR(100) NOT NULL,
    cantidad_equipos_clasifican INT
);

-- Tabla para Equipos inscritos en un Torneo/Categoría
CREATE TABLE Equipos (
    equipo_id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES Clubes(club_id),
    torneo_id INT NOT NULL REFERENCES Torneos(torneo_id),
    categoria VARCHAR(50) NOT NULL, -- 'Principal', 'Juvenil'
    nombre_equipo_display VARCHAR(255) NOT NULL,
    estado_en_torneo VARCHAR(50) NOT NULL DEFAULT 'Activo', -- 'Activo', 'Eliminado', 'Descalificado', 'Campeón'
    UNIQUE(club_id, torneo_id, categoria)
);

-- Tabla de Unión Equipos-Grupos
CREATE TABLE Equipos_Grupos_Fase (
    equipo_id INT REFERENCES Equipos(equipo_id),
    grupo_id INT REFERENCES Grupos_Fase(grupo_id),
    PRIMARY KEY (equipo_id, grupo_id)
);

-- Tabla de Unión Jugadores-Equipos (Lista de Buena Fe)
CREATE TABLE Jugadores_Equipos (
    jugador_equipo_id SERIAL PRIMARY KEY,
    jugador_id INT NOT NULL REFERENCES Jugadores(jugador_id),
    equipo_id INT NOT NULL REFERENCES Equipos(equipo_id),
    numero_camiseta INT,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    activo_en_plantilla BOOLEAN DEFAULT TRUE,
    UNIQUE(jugador_id, equipo_id)
);

-- #############################################################################
-- # MÓDULO 3: COMPETICIÓN
-- #############################################################################

-- Tabla para Llaves Eliminatorias
CREATE TABLE Llaves_Eliminatorias (
    llave_id SERIAL PRIMARY KEY,
    fase_id INT NOT NULL REFERENCES Fases_Torneo(fase_id),
    categoria VARCHAR(50) NOT NULL,
    nombre_llave VARCHAR(100) NOT NULL,
    equipo_A_id INT REFERENCES Equipos(equipo_id),
    equipo_B_id INT REFERENCES Equipos(equipo_id),
    equipo_ganador_id INT REFERENCES Equipos(equipo_id)
);

-- Tabla para Partidos
CREATE TABLE Partidos (
    partido_id SERIAL PRIMARY KEY,
    fase_id INT NOT NULL REFERENCES Fases_Torneo(fase_id),
    llave_id INT REFERENCES Llaves_Eliminatorias(llave_id),
    jornada_nombre VARCHAR(100),
    equipo_local_id INT NOT NULL REFERENCES Equipos(equipo_id),
    equipo_visitante_id INT NOT NULL REFERENCES Equipos(equipo_id),
    estadio_id INT REFERENCES Estadios(estadio_id),
    fecha_hora_partido TIMESTAMP WITH TIME ZONE,
    goles_local INT DEFAULT 0,
    goles_visitante INT DEFAULT 0,
    goles_local_penales INT,
    goles_visitante_penales INT,
    estado_partido VARCHAR(50) NOT NULL DEFAULT 'Programado', -- 'Finalizado', 'Suspendido', 'Bajo Protesta'
    jugador_destacado_id INT REFERENCES Jugadores(jugador_id),
    promedio_calificacion DECIMAL(3, 2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0,
    info_circulo_arbitral VARCHAR(255),
    observaciones_veedor TEXT,
    acta_generada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Alineaciones Oficiales del Partido
CREATE TABLE Alineaciones (
    alineacion_id SERIAL PRIMARY KEY,
    partido_id INT NOT NULL REFERENCES Partidos(partido_id),
    equipo_id INT NOT NULL REFERENCES Equipos(equipo_id),
    persona_id INT NOT NULL REFERENCES Personas(persona_id),
    rol_en_partido VARCHAR(50) NOT NULL, -- 'Titular', 'Suplente', 'Director Técnico', etc.
    numero_camiseta INT,
    UNIQUE(partido_id, persona_id)
);

-- Tabla para Eventos de Partido
CREATE TABLE Eventos_Partido (
    evento_id SERIAL PRIMARY KEY,
    partido_id INT NOT NULL REFERENCES Partidos(partido_id),
    equipo_id INT NOT NULL REFERENCES Equipos(equipo_id),
    jugador_id INT REFERENCES Jugadores(jugador_id),
    tipo_evento VARCHAR(50) NOT NULL, -- 'GOL_JUGADA', 'TARJETA_AMARILLA', 'SUSTITUCION_ENTRA', etc.
    minuto_evento INT,
    jugador_asistencia_id INT REFERENCES Jugadores(jugador_id),
    jugador_relacionado_id INT REFERENCES Jugadores(jugador_id), -- Para sustituciones
    descripcion_adicional TEXT
);

-- Tabla para Informes de Árbitros
CREATE TABLE Informes_Arbitrales (
    informe_id SERIAL PRIMARY KEY,
    partido_id INT NOT NULL UNIQUE REFERENCES Partidos(partido_id),
    arbitro_redactor_id INT NOT NULL REFERENCES Arbitros(arbitro_id),
    informe_texto TEXT,
    informe_escaneado_url VARCHAR(255),
    estado_informe VARCHAR(50) NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'En Progreso', 'Cerrado'
    fecha_presentacion TIMESTAMP WITH TIME ZONE,
    informe_access_token UUID NOT NULL DEFAULT gen_random_uuid(),
    contenido_hash VARCHAR(64) -- SHA-256 hash
);

-- ALTER TABLE para añadir FK a Informes_Arbitrales a la tabla Partidos
ALTER TABLE Partidos ADD COLUMN informe_arbitral_id INT REFERENCES Informes_Arbitrales(informe_id);

-- Tabla para Expedientes (Protestas, Notas)
CREATE TABLE Expedientes (
    expediente_id SERIAL PRIMARY KEY,
    tipo_expediente VARCHAR(50) NOT NULL, -- 'Protesta de Partido', 'Nota Recibida', 'Nota Emitida'
    club_solicitante_id INT REFERENCES Clubes(club_id),
    partido_protestado_id INT REFERENCES Partidos(partido_id),
    asunto VARCHAR(255) NOT NULL,
    descripcion_detallada TEXT,
    fecha_presentacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado_expediente VARCHAR(50) NOT NULL DEFAULT 'Recibido', -- 'En Revisión', 'Resuelto', 'Archivado'
    resolucion_final TEXT,
    fecha_resolucion TIMESTAMP WITH TIME ZONE
);

-- Tabla para Sanciones Vigentes
CREATE TABLE Sanciones_Vigentes (
    sancion_id SERIAL PRIMARY KEY,
    expediente_id INT REFERENCES Expedientes(expediente_id), -- Si la sanción viene de una protesta
    evento_id INT REFERENCES Eventos_Partido(evento_id), -- Si viene de una tarjeta
    entidad_sancionada_tipo VARCHAR(50) NOT NULL, -- 'Jugador', 'CuerpoTecnico', etc.
    entidad_sancionada_id INT NOT NULL,
    tipo_sancion VARCHAR(100) NOT NULL, -- 'Suspensión por Partidos', etc.
    cantidad_partidos_sancion INT,
    partidos_cumplidos INT DEFAULT 0,
    fecha_fin_sancion DATE,
    estado_sancion VARCHAR(50) NOT NULL DEFAULT 'Vigente', -- 'Vigente', 'Cumplida'
    motivo_descripcion TEXT
);


-- #############################################################################
-- # MÓDULOS 4, 5, 6, 7 (Financiero, Boletería, Acreditaciones, Comunidad)
-- # Creación de tablas para estos módulos
-- #############################################################################

CREATE TABLE Conceptos_Cobro (
    concepto_id SERIAL PRIMARY KEY,
    descripcion_concepto VARCHAR(255) NOT NULL UNIQUE,
    monto_sugerido DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tipo_concepto VARCHAR(50)
);

CREATE TABLE Cargos_Club (
    cargo_id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES Clubes(club_id),
    concepto_id INT NOT NULL REFERENCES Conceptos_Cobro(concepto_id),
    evento_id INT REFERENCES Eventos_Partido(evento_id),
    monto_cargo DECIMAL(12, 2) NOT NULL,
    fecha_cargo DATE DEFAULT CURRENT_DATE,
    estado_cargo VARCHAR(50) NOT NULL DEFAULT 'Pendiente'
);

CREATE TABLE Pagos_Recibidos (
    pago_id SERIAL PRIMARY KEY,
    club_id INT REFERENCES Clubes(club_id),
    monto_total_pago DECIMAL(12, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL, -- 'Efectivo', 'Tarjeta (POS)', 'Transferencia Bancaria', 'Pago QR'
    referencia_pago VARCHAR(255),
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_receptor_id INT REFERENCES Usuarios(usuario_id),
    observaciones TEXT
);

CREATE TABLE Pagos_Cargos_Aplicados (
    pago_id INT REFERENCES Pagos_Recibidos(pago_id),
    cargo_id INT REFERENCES Cargos_Club(cargo_id),
    monto_aplicado DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY(pago_id, cargo_id)
);

CREATE TABLE Precios_Entradas_Fase (
    precio_entrada_fase_id SERIAL PRIMARY KEY,
    fase_id INT NOT NULL REFERENCES Fases_Torneo(fase_id),
    descripcion_tipo_entrada VARCHAR(100) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Ventas_Entradas (
    venta_id SERIAL PRIMARY KEY,
    partido_id INT NOT NULL REFERENCES Partidos(partido_id),
    usuario_boleteria_id INT REFERENCES Usuarios(usuario_id),
    monto_total_venta DECIMAL(12, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    referencia_pago VARCHAR(255),
    fecha_hora_venta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    punto_venta_id VARCHAR(100),
    anulada BOOLEAN DEFAULT FALSE
);

CREATE TABLE Boletas_Vendidas (
    boleta_id SERIAL PRIMARY KEY,
    boleta_uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    venta_id INT NOT NULL REFERENCES Ventas_Entradas(venta_id),
    precio_entrada_fase_id INT NOT NULL REFERENCES Precios_Entradas_Fase(precio_entrada_fase_id),
    precio_pagado DECIMAL(12, 2) NOT NULL,
    estado_acceso VARCHAR(50) NOT NULL DEFAULT 'No Utilizada',
    fecha_hora_acceso TIMESTAMP WITH TIME ZONE
);

CREATE TABLE Tipos_Acreditacion (
    tipo_acreditacion_id SERIAL PRIMARY KEY,
    nombre_tipo_acreditacion VARCHAR(150) NOT NULL UNIQUE,
    flujo_acreditacion VARCHAR(50) NOT NULL, -- 'Solicitud Prensa' o 'Generación Automática'
    descripcion_acreditacion TEXT
);

CREATE TABLE Planes_Acreditacion_Prensa (
    plan_id SERIAL PRIMARY KEY,
    torneo_id INT NOT NULL REFERENCES Torneos(torneo_id),
    nombre_plan VARCHAR(255) NOT NULL,
    descripcion_plan TEXT,
    costo DECIMAL(12, 2) NOT NULL DEFAULT 0,
    validez_dias INT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Acreditados (
    acreditado_id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE REFERENCES Personas(persona_id),
    medio_o_organizacion VARCHAR(255),
    funcion_principal VARCHAR(150),
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo'
);

CREATE TABLE Acreditaciones_Emitidas (
    acreditacion_emitida_id SERIAL PRIMARY KEY,
    acreditado_id INT REFERENCES Acreditados(acreditado_id),
    persona_id INT REFERENCES Personas(persona_id),
    tipo_acreditacion_id INT NOT NULL REFERENCES Tipos_Acreditacion(tipo_acreditacion_id),
    partido_id INT REFERENCES Partidos(partido_id),
    plan_id INT REFERENCES Planes_Acreditacion_Prensa(plan_id),
    fecha_solicitud TIMESTAMP WITH TIME ZONE,
    fecha_emision DATE DEFAULT CURRENT_DATE,
    fecha_validez_hasta DATE,
    codigo_qr_identificador UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    estado_acreditacion VARCHAR(50) NOT NULL DEFAULT 'Pendiente Aprobacion',
    estado_pago VARCHAR(50) NOT NULL DEFAULT 'No Aplica',
    generada_por_planilla BOOLEAN DEFAULT FALSE
);

CREATE TABLE Aficionados (
    aficionado_id SERIAL PRIMARY KEY,
    club_favorito_id INT REFERENCES Clubes(club_id),
    nombre_publico VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    foto_perfil_url VARCHAR(255),
    reputacion INT DEFAULT 0,
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Noticias_Club (
    noticia_id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES Clubes(club_id),
    usuario_autor_id INT NOT NULL REFERENCES Usuarios(usuario_id),
    titulo_noticia VARCHAR(255) NOT NULL,
    contenido_noticia TEXT NOT NULL,
    imagen_url VARCHAR(255),
    estado_publicacion VARCHAR(50) NOT NULL DEFAULT 'Borrador',
    fecha_publicacion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Calificaciones_Publicas (
    calificacion_id SERIAL PRIMARY KEY,
    aficionado_id INT NOT NULL REFERENCES Aficionados(aficionado_id),
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id INT NOT NULL,
    puntuacion SMALLINT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aficionado_id, entidad_tipo, entidad_id) -- Un usuario puede calificar una entidad una sola vez
);

CREATE TABLE Comentarios_Publicos (
    comentario_id SERIAL PRIMARY KEY,
    aficionado_id INT NOT NULL REFERENCES Aficionados(aficionado_id),
    comentario_padre_id INT REFERENCES Comentarios_Publicos(comentario_id),
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id INT NOT NULL,
    texto_comentario TEXT NOT NULL,
    estado_moderacion VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    motivo_moderacion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #############################################################################
-- # INSERCIÓN DE DATOS INICIALES Y DE PRUEBA
-- #############################################################################

-- Insertar Liga
INSERT INTO Ligas (nombre_liga, siglas, fecha_fundacion) VALUES ('Liga Villetana de Fútbol', 'LVF', '1940-08-23');

-- Insertar Roles
INSERT INTO Roles (nombre_rol, descripcion_rol) VALUES
('Super Administrador', 'Control total del sistema'),
('Administrador Liga', 'Gestiona torneos, clubes y finanzas de la liga'),
('Delegado Club', 'Gestiona la información de su club, equipos y jugadores'),
('Operador Partido', 'Carga resultados y eventos de partidos'),
('Árbitro', 'Gestiona y presenta sus informes oficiales de partido'),
('Operador Boletería', 'Realiza la venta de entradas en los estadios'),
('Moderador Comunidad', 'Modera comentarios y contenido público');

-- Insertar Usuario Administrador por Defecto
INSERT INTO Usuarios (rol_id, nombre_completo, email, password_hash) VALUES
(1, 'Admin Principal', 'admin@lvf.com.py', 'hash_de_contraseña_segura'); -- Reemplazar con un hash real

-- Insertar Clubes (basado en documentos)
INSERT INTO Clubes (liga_id, nombre_oficial, nombre_corto, sede_o_compania, fecha_fundacion) VALUES
(1, 'Club 12 de Octubre de Naranjaisy', '12 de Octubre', 'Naranjaisy', '1948-12-10'),
(1, 'Club 2 de Mayo', '2 de Mayo', 'Ita Ybate', '1926-05-02'),
(1, 'Club 8 de Diciembre', '8 de Diciembre', 'Tacuruty', '1962-12-08'),
(1, 'Club Cerro León', 'Cerro León', 'Naranjaisy', '1918-09-18'),
(1, 'Ita Ybate Sport Club', 'Itá Ybaté', 'Ita Yvate', '1926-08-15'),
(1, 'Club Lomas Valentinas', 'Lomas Valentinas', 'Ita Ybate', '1949-12-21'),
(1, 'Club Universo', 'Universo', 'Tacuruty', '1949-02-08'),
(1, 'Club 1ro de Marzo FBC', '1ro de Marzo', 'Guazú Corá', '1949-02-14'),
(1, 'Club 1ro de Mayo', '1ro de Mayo', 'B. San Martín de Porres', '1990-07-12'),
(1, 'Club 22 de Mayo FBC', '22 de Mayo', 'Naranjaisy', '1949-05-22'),
(1, 'Club 3 de Febrero', '3 de Febrero', 'Naranjaisy', '1970-02-03'),
(1, 'Club Mariscal Estigarribia', 'Mcal Estigarribia', 'Guazú Corá', '1967-09-29'),
(1, 'Club 13 de Mayo', '13 de Mayo', 'Tacuaty', '1995-05-13'),
(1, 'Club 3 de Noviembre', '3 de Noviembre', 'Valle Po''i', '1969-11-03'),
(1, 'Club 4 de Octubre', '4 de Octubre', 'Valle Po''i', '1969-10-04'),
(1, 'FBC Cumbariteño', 'Cumbariteño', 'Cumbarity', '1936-03-03'),
(1, 'Hijos de Mayo Sport Club', 'Hijos de Mayo', 'B. Inmaculada', '1918-05-18'),
(1, 'Club Libertad de Villeta', 'Libertad', 'B. San Juan', '1927-01-30'),
(1, 'Club Sportivo Villetano', 'Sportivo Villetano', 'Cumbarity', '1950-07-20');

-- Insertar Estadios Conocidos
INSERT INTO Estadios (nombre_estadio, club_propietario_id, direccion_o_localidad) VALUES
('Pa''i Beni', (SELECT club_id FROM Clubes WHERE nombre_corto = '12 de Octubre'), 'Naranjaisy'),
('Estanislao Rojas', (SELECT club_id FROM Clubes WHERE nombre_corto = '2 de Mayo'), 'Ita Ybate'),
('Eulogio Noguera', (SELECT club_id FROM Clubes WHERE nombre_corto = '8 de Diciembre'), 'Tacuruty'),
('Esteban Cabrera', (SELECT club_id FROM Clubes WHERE nombre_corto = 'Cerro León'), 'Naranjaisy'),
('Vicente Gómez', (SELECT club_id FROM Clubes WHERE nombre_corto = 'Itá Ybaté'), 'Ita Yvate'),
('Valerio Sanabria', (SELECT club_id FROM Clubes WHERE nombre_corto = 'Lomas Valentinas'), 'Ita Ybate'),
('Crescencio Chávez', (SELECT club_id FROM Clubes WHERE nombre_corto = 'Universo'), 'Tacuruty'),
('Cosme Centurión', (SELECT club_id FROM Clubes WHERE nombre_corto = '1ro de Mayo'), 'B. San Martín de Porres'),
('Capitán Ramón García', (SELECT club_id FROM Clubes WHERE nombre_corto = 'Hijos de Mayo'), 'B. Inmaculada'),
('Heriberto La''i Reinoso', (SELECT club_id FROM Clubes WHERE nombre_corto = 'Cumbariteño'), 'Cumbarity'),
('20 de Julio', (SELECT club_id FROM Clubes WHERE nombre_corto = 'Sportivo Villetano'), 'Cumbarity');


-- Insertar Datos del Torneo "Súper Liga Villetana 2025"
DO $$
DECLARE
    torneo_creado_id INT;
    fase_grupos_id INT;
    grupo_a_id INT;
    grupo_b_id INT;
    grupo_c_id INT;
BEGIN
    -- Crear el Torneo
    INSERT INTO Torneos (temporada, nombre_torneo, nombre_homenaje, estado_torneo)
    VALUES ('2025', 'Súper Liga Villetana', 'Homenaje a Olegario González, Sebastián Torres, Rogelio Trinidad, Eleuterio Rodas, Federico Delgado y Esterio López', 'En Curso')
    RETURNING torneo_id INTO torneo_creado_id;

    -- Crear la Fase de Grupos
    INSERT INTO Fases_Torneo (torneo_id, nombre_fase, tipo_fase, orden_secuencia_fase)
    VALUES (torneo_creado_id, 'Fase de Grupos', 'GRUPOS', 1)
    RETURNING fase_id INTO fase_grupos_id;
    
    -- Crear los Grupos (Series)
    INSERT INTO Grupos_Fase (fase_id, nombre_grupo, cantidad_equipos_clasifican)
    VALUES (fase_grupos_id, 'Serie A', 6) RETURNING grupo_id INTO grupo_a_id;
    
    INSERT INTO Grupos_Fase (fase_id, nombre_grupo, cantidad_equipos_clasifican)
    VALUES (fase_grupos_id, 'Serie B', 5) RETURNING grupo_id INTO grupo_b_id;

    INSERT INTO Grupos_Fase (fase_id, nombre_grupo, cantidad_equipos_clasifican)
    VALUES (fase_grupos_id, 'Serie C', 5) RETURNING grupo_id INTO grupo_c_id;

    -- Crear Equipos (Principal y Juvenil) y asignarlos a los grupos
    -- Serie A
    FOR club_rec IN SELECT club_id, nombre_corto FROM Clubes WHERE nombre_corto IN ('12 de Octubre', '2 de Mayo', '8 de Diciembre', 'Cerro León', 'Itá Ybaté', 'Lomas Valentinas', 'Universo')
    LOOP
        INSERT INTO Equipos (club_id, torneo_id, categoria, nombre_equipo_display)
        VALUES (club_rec.club_id, torneo_creado_id, 'Principal', club_rec.nombre_corto || ' (Principal)')
        ON CONFLICT (club_id, torneo_id, categoria) DO NOTHING;
        
        INSERT INTO Equipos_Grupos_Fase (equipo_id, grupo_id)
        VALUES ((SELECT equipo_id FROM Equipos WHERE club_id = club_rec.club_id AND torneo_id = torneo_creado_id AND categoria = 'Principal'), grupo_a_id);
        
        INSERT INTO Equipos (club_id, torneo_id, categoria, nombre_equipo_display)
        VALUES (club_rec.club_id, torneo_creado_id, 'Juvenil', club_rec.nombre_corto || ' (Juvenil)')
        ON CONFLICT (club_id, torneo_id, categoria) DO NOTHING;
        
        INSERT INTO Equipos_Grupos_Fase (equipo_id, grupo_id)
        VALUES ((SELECT equipo_id FROM Equipos WHERE club_id = club_rec.club_id AND torneo_id = torneo_creado_id AND categoria = 'Juvenil'), grupo_a_id);
    END LOOP;

    -- Serie B
    FOR club_rec IN SELECT club_id, nombre_corto FROM Clubes WHERE nombre_corto IN ('13 de Mayo', '1ro de Marzo', '1ro de Mayo', '22 de Mayo', '3 de Febrero', 'Mcal Estigarribia')
    LOOP
        INSERT INTO Equipos (club_id, torneo_id, categoria, nombre_equipo_display)
        VALUES (club_rec.club_id, torneo_creado_id, 'Principal', club_rec.nombre_corto || ' (Principal)')
        ON CONFLICT (club_id, torneo_id, categoria) DO NOTHING;

        INSERT INTO Equipos_Grupos_Fase (equipo_id, grupo_id)
        VALUES ((SELECT equipo_id FROM Equipos WHERE club_id = club_rec.club_id AND torneo_id = torneo_creado_id AND categoria = 'Principal'), grupo_b_id);

        INSERT INTO Equipos (club_id, torneo_id, categoria, nombre_equipo_display)
        VALUES (club_rec.club_id, torneo_creado_id, 'Juvenil', club_rec.nombre_corto || ' (Juvenil)')
        ON CONFLICT (club_id, torneo_id, categoria) DO NOTHING;

        INSERT INTO Equipos_Grupos_Fase (equipo_id, grupo_id)
        VALUES ((SELECT equipo_id FROM Equipos WHERE club_id = club_rec.club_id AND torneo_id = torneo_creado_id AND categoria = 'Juvenil'), grupo_b_id);
    END LOOP;

    -- Serie C
    FOR club_rec IN SELECT club_id, nombre_corto FROM Clubes WHERE nombre_corto IN ('3 de Noviembre', '4 de Octubre', 'Cumbariteño', 'Hijos de Mayo', 'Libertad', 'Sportivo Villetano')
    LOOP
        INSERT INTO Equipos (club_id, torneo_id, categoria, nombre_equipo_display)
        VALUES (club_rec.club_id, torneo_creado_id, 'Principal', club_rec.nombre_corto || ' (Principal)')
        ON CONFLICT (club_id, torneo_id, categoria) DO NOTHING;
        
        INSERT INTO Equipos_Grupos_Fase (equipo_id, grupo_id)
        VALUES ((SELECT equipo_id FROM Equipos WHERE club_id = club_rec.club_id AND torneo_id = torneo_creado_id AND categoria = 'Principal'), grupo_c_id);

        INSERT INTO Equipos (club_id, torneo_id, categoria, nombre_equipo_display)
        VALUES (club_rec.club_id, torneo_creado_id, 'Juvenil', club_rec.nombre_corto || ' (Juvenil)')
        ON CONFLICT (club_id, torneo_id, categoria) DO NOTHING;

        INSERT INTO Equipos_Grupos_Fase (equipo_id, grupo_id)
        VALUES ((SELECT equipo_id FROM Equipos WHERE club_id = club_rec.club_id AND torneo_id = torneo_creado_id AND categoria = 'Juvenil'), grupo_c_id);
    END LOOP;

    -- Crear Fase de Octavos
    INSERT INTO Fases_Torneo (torneo_id, nombre_fase, tipo_fase, orden_secuencia_fase)
    VALUES (torneo_creado_id, 'Octavos de Final', 'ELIMINATORIA_IDA_VUELTA', 2);

END $$;

-- #############################################################################
-- # FIN DEL SCRIPT
-- #############################################################################
