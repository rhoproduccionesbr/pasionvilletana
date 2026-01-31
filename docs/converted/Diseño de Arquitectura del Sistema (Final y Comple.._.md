# Converted from Diseño de Arquitectura del Sistema (Final y Comple.._.docx

Diseño de Arquitectura del Sistema (Final y Completo)
Versión: 2.0 Fecha: 7 de Junio de 2025 Objetivo: Detallar la arquitectura técnica completa del sistema, incluyendo los componentes de software internos necesarios para soportar todas las funcionalidades requeridas, como la operación offline, la generación de informes y documentos impresos, y la gestión segura de informes arbitrales.
1. Visión General de la Arquitectura Física
La arquitectura física se mantiene como la hemos definido: un modelo híbrido con un servidor central privado en la sede de la Liga y Clientes Inteligentes (PWAs) operando de forma remota en los estadios, con capacidad offline.
2. Diagrama de Arquitectura Lógica (Componentes de Software)
Este diagrama muestra los principales componentes lógicos que residirán dentro de la "Aplicación Django" y cómo interactúan con las interfaces de usuario y la base de datos.
graph TD
    subgraph "Interfaces de Usuario (Frontend)"
        direction LR
        UI_Admin[Panel de Administración]
        UI_Publico[Portal Público]
        UI_PWA[PWA de Campo <br> (Boletería, Control, Resultados)]
        UI_Arbitro[Portal Seguro para Árbitros]
    end

    subgraph "Aplicación Central Django (Backend)"
        direction TB
        API_REST[API REST / Vistas]

        subgraph "Servicios Principales"
            direction LR
            Serv_Gestion[Servicio de Gestión Deportiva]
            Serv_Comp[Servicio de Competición]
            Serv_Finan[Servicio Financiero]
            Serv_Comu[Servicio de Comunidad]
        end

        subgraph "Servicios de Soporte y Generación"
             direction LR
             Serv_PDF[Generador de Documentos <br> (PDF/Impresión)]
             Serv_QR[Generador de QR y Códigos de Barra]
             Serv_Auth[Servicio de Autenticación y Permisos]
             Serv_Sync[Servicio de Sincronización Offline]
        end

        subgraph "Módulo de Seguridad Crítica"
             Serv_Informe[Servicio de Informes de Árbitro <br> (Tokens y Hashing)]
        end
    end

    DB[(Base de Datos PostgreSQL)]

    %% Conexiones
    UI_Admin --> API_REST
    UI_Publico --> API_REST
    UI_PWA --> API_REST
    UI_Arbitro --> API_REST

    API_REST --> Serv_Gestion
    API_REST --> Serv_Comp
    API_REST --> Serv_Finan
    API_REST --> Serv_Comu
    API_REST --> Serv_Auth
    API_REST --> Serv_Informe

    Serv_Comp --- Serv_PDF
    Serv_Finan --- Serv_PDF
    Serv_Comp --- Serv_QR
    
    Serv_Gestion <--> DB
    Serv_Comp <--> DB
    Serv_Finan <--> DB
    Serv_Comu <--> DB
    Serv_Auth <--> DB
    Serv_Informe <--> DB
    Serv_Sync <--> DB
    UI_PWA -.-> Serv_Sync

    %% Estilos
    classDef ui fill:#e0f2fe,stroke:#0ea5e9,color:#0c4a6e;
    classDef service fill:#dcfce7,stroke:#16a34a,color:#14532d;
    classDef security fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;

    class UI_Admin,UI_Publico,UI_PWA,UI_Arbitro ui;
    class Serv_Gestion,Serv_Comp,Serv_Finan,Serv_Comu,Serv_PDF,Serv_QR,Serv_Auth,Serv_Sync service;
    class Serv_Informe security;

(Para visualizar el gráfico, copia este código en el Mermaid Live Editor)
3. Descripción Detallada de los Componentes Nuevos y Actualizados
3.1. Servicio de Generación de Documentos (PDF/Impresión)
Responsabilidad: Crear documentos con formato listos para ser impresos o descargados como PDF. Este servicio será utilizado por varios módulos.
Flujo de Trabajo:
El sistema recopila los datos necesarios desde la base de datos (ej. datos de un partido y sus eventos).
Pasa estos datos a una "plantilla" HTML predefinida (ej. la plantilla del "Acta Oficial del Partido").
Renderiza esta plantilla como una página web.
Utiliza una librería (como WeasyPrint o similar en el ecosistema de Python) para convertir esta página HTML en un archivo PDF.
Documentos a Generar:
Acta Oficial del Partido: Con alineaciones, eventos, resultado y espacio para firmas.
Informes Financieros: Estado de cuenta de un club, resumen de recaudación.
Listas y Reportes: Fixture del torneo, tabla de goleadores, lista de buena fe de un equipo.
3.2. Generador de QR y Códigos de Barra
Responsabilidad: Crear imágenes de códigos QR únicas para cada boleta y credencial de acreditación.
Flujo de Trabajo:
Toma el identificador único (UUID) de una boleta (Boletas_Vendidas.boleta_uuid) o de una acreditación (Acreditaciones_Emitidas.codigo_qr_identificador).
Utiliza una librería para generar una imagen de código QR que contenga ese UUID.
Esta imagen se puede incrustar directamente en la boleta o credencial que genera el Servicio de Generación de Documentos.
3.3. Servicio de Informes de Árbitro (Módulo de Seguridad Crítica)
Responsabilidad: Garantizar la seguridad, autenticidad e inmutabilidad de los informes arbitrales.
Flujo de Trabajo:
Generación de Token: Al asignar un árbitro a un partido, este servicio crea un registro en Informes_Arbitrales y genera un token de acceso único (informe_access_token).
Autenticación por Token: El Portal Seguro para Árbitros (una interfaz web minimalista y segura) requerirá este token para permitir el acceso a la página de redacción del informe. El token es de un solo uso o de tiempo limitado.
Firma Digital (Hashing): Cuando el árbitro "Presenta" su informe, este servicio toma el contenido completo del texto, le aplica un algoritmo de hash criptográfico (como SHA-256) y guarda el resultado (contenido_hash) en la base de datos.
Verificación: Provee una función interna para que los administradores puedan verificar la integridad de un informe, recalculando el hash del texto y comparándolo con el hash guardado.
3.4. PWA de Campo (Interfaz de Usuario Actualizada)
Responsabilidad: Ser la herramienta todo-en-uno para los operadores en los estadios.
Funcionalidades Offline/Online:
Boletería: Tendrá una interfaz de venta (POS) y un botón para "Imprimir Boleta" que se comunicará con una impresora de tickets local (si está configurada).
Control de Acceso: Utilizará la cámara del dispositivo para escanear los QR de las boletas y acreditaciones, verificándolos contra la base de datos local (descargada previamente).
Carga de Resultados: Interfaz para que el veedor o planillero registre los eventos del partido (goles, tarjetas) en tiempo real, guardándolos localmente si no hay conexión.
3.5. Panel de Administración (Interfaz de Usuario Actualizada)
Responsabilidad: Centralizar todas las operaciones de gestión de la liga.
Nuevas Secciones:
Sección de Informes: Un lugar centralizado donde los administradores pueden seleccionar un torneo, una fecha o un club y generar los documentos PDF correspondientes (Acta, Estado de Cuenta, etc.).
Sección de Informes Arbitrales: Una vista de solo lectura de los informes presentados por los árbitros. Aquí, el administrador podrá subir el archivo escaneado del informe físico firmado, vinculándolo al informe digital.
Sección de Acreditaciones: Además de gestionar acreditados, tendrá un botón para "Imprimir Carnet" para una persona o un grupo de personas.
Con esta estructura de sistema actualizada, no solo definimos qué datos guardar, sino también cómo la aplicación los procesará y los transformará en las funcionalidades y documentos que la Liga Villetana necesita para su operación diaria.