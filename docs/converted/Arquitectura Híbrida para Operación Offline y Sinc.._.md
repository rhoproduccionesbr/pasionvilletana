# Converted from Arquitectura Híbrida para Operación Offline y Sinc.._.docx

Arquitectura Híbrida: Servidor Local con Clientes Offline
Versión: 2.0 (Revisada y Ampliada) Fecha: 7 de Junio de 2025 Objetivo: Diseñar una arquitectura que permita el uso de un servidor central privado en las oficinas de la Liga Villetana, garantizando la operación continua de todos los módulos de campo (Boletería, Control de Acreditación, Carga de Resultados) en ubicaciones remotas con conectividad a internet intermitente o nula.
1. Visión General de la Arquitectura
Proponemos una Arquitectura de Cliente Inteligente con Servidor Central. Este enfoque es la base para todas las operaciones que se realizan fuera de la sede de la Liga.
Servidor Central (en la Liga): El servidor físico ubicado en la sede de la Liga actuará como la única fuente de verdad. Albergará la base de datos principal (PostgreSQL) y la aplicación principal (Django). Será el encargado de consolidar toda la información del torneo.
Cliente Inteligente (en los Estadios): La aplicación utilizada en el campo no será una simple página web. Será una Aplicación Web Progresiva (PWA) diseñada con una lógica "Offline-First". Esto significa que la aplicación está construida para funcionar perfectamente sin internet, y considera la conexión como una mejora para sincronizar datos. Cada módulo necesario para la operación del día de partido estará disponible dentro de esta PWA.
2. Diagrama de la Arquitectura Híbrida
Este diagrama ilustra cómo interactúan los componentes en este modelo. Los "POS" (Puntos de Venta) ahora se entienden como "Puntos de Operación" que pueden incluir venta de entradas, control de acceso y carga de resultados.
graph TD
    subgraph "Ubicaciones Remotas (Estadios)"
        direction LR
        subgraph "Punto de Operación Estadio 1"
            PWA1[PWA de Operaciones en Laptop/Tablet]
            LocalDB1[(Base de Datos del Navegador <br> IndexedDB)]
            PWA1 <--> LocalDB1
        end
        subgraph "Punto de Operación Estadio 2"
            PWA2[PWA de Operaciones en Laptop/Tablet]
            LocalDB2[(Base de Datos del Navegador <br> IndexedDB)]
            PWA2 <--> LocalDB2
        end
    end

    subgraph "Sede Central de la Liga Villetana"
        direction TB
        subgraph "Servidor Privado Local"
            direction LR
            Nginx[Nginx Web Server] --> AppServer{Aplicación Django}
            AppServer <--> CentralDB[(Base de Datos Principal <br> PostgreSQL)]
        end
        Router(Router / Firewall de la Liga)
    end

    %% Conexiones
    Internet(Internet Público)
    PWA1 -- "Sincronización Automática" --> Internet
    PWA2 -- "Sincronización Automática" --> Internet
    Internet --> Router
    Router -- "Acceso Remoto (Puerto 443)" --> Nginx

    subgraph "Flujo de Sincronización Manual (Fallback)"
        direction LR
        Export[Exportar Archivo de Datos (.json)]
        Import[Importar Archivo en el Sistema Central]
        PWA1 --> Export
        Export -- "USB / Email" --> AppServer
    end


    %% Estilos
    classDef pos fill:#fefce8,stroke:#ca8a04,color:#713f12;
    classDef central fill:#dcfce7,stroke:#16a34a,color:#14532d;
    classDef network fill:#e0f2fe,stroke:#0ea5e9,color:#0c4a6e;

    class PWA1,PWA2,LocalDB1,LocalDB2,Export,Import pos;
    class Nginx,AppServer,CentralDB,Router central;
    class Internet network;

(Para visualizar el gráfico, copia este código en el Mermaid Live Editor)
3. Flujo de Funcionamiento Detallado para Módulos Offline
El siguiente flujo se aplica a todos los módulos que necesitan operar en el campo.
Paso 1: Preparación (Antes del Día del Partido)
Sincronización Inicial: El operador (de boletería, de acceso, veedor del partido) abre la PWA en su dispositivo mientras tiene una buena conexión a internet.
Descarga de Datos Relevantes: La PWA se conecta al servidor central y descarga la información necesaria para sus tareas específicas del día:
Para Boletería: Datos del partido, tipos de entrada y precios.
Para Control de Acceso: Lista de Acreditaciones_Emitidas válidas para ese partido (nombre, documento, tipo, QR, etc.).
Para Carga de Resultados: Datos del partido y la lista de jugadores (Jugadores_Equipos) de ambos equipos.
Almacenamiento Local: Toda esta información se guarda de forma segura en la base de datos interna del navegador del dispositivo, IndexedDB.
Estado "Listo para Operar Offline": La PWA confirma que tiene todos los datos necesarios y está lista para funcionar de forma autónoma.
Paso 2: Operación en el Estadio (Día del Partido)
Modo Offline por Defecto: El operador utiliza la interfaz de la PWA para realizar sus tareas sin necesidad de conexión a internet.
Registro Local de Datos:
Boletería: Cada venta se guarda como un nuevo registro en la IndexedDB.
Control de Acceso: Al escanear un QR, la PWA lo verifica contra la lista local. Si se quiere registrar la entrada, se guarda un "evento de acceso" en la IndexedDB.
Carga de Resultados: Cada evento del partido (gol, tarjeta, cambio) se guarda como un nuevo registro en la IndexedDB.
Sincronización Automática (cuando hay conexión):
La PWA intentará periódicamente detectar si hay conexión a internet.
Si hay conexión, enviará todos los registros locales (ventas, eventos de acceso, eventos de partido) que estén pendientes de sincronización al servidor central.
El servidor procesa los datos, los guarda en la base de datos PostgreSQL, y devuelve una confirmación.
La PWA marca los registros locales como "sincronizados".
Paso 3: Cierre de Operaciones y Sincronización Final
Al final de la jornada, si no se pudo establecer una conexión a internet estable, se activa el mecanismo de sincronización manual para todos los módulos.
Exportación de Datos: La PWA tendrá una función para "Exportar Datos de la Jornada". Esto generará un archivo .json que contiene todas las transacciones (ventas, eventos, etc.) guardadas localmente.
Transferencia del Archivo: El operador guarda este archivo en una unidad USB o lo envía por otros medios al administrador de la Liga.
Importación en el Sistema Central: El administrador, desde el panel de administración, tendrá una sección para "Importar Datos de Jornada". Subirá el archivo y el sistema consolidará toda la información en la base de datos principal.
4. Implicaciones Técnicas y Requisitos Críticos
PWA Multifuncional: El frontend debe ser una aplicación robusta que contenga la lógica para todos los módulos de campo necesarios.
API de Sincronización Versátil: El backend Django debe tener "endpoints" específicos y seguros para recibir lotes de datos de diferentes tipos (ventas, eventos de partido, etc.) y para manejar la importación de archivos.
Seguridad y Mantenimiento del Servidor Privado: La necesidad de exponer el servidor a internet para la sincronización refuerza la importancia crítica de una configuración de red segura (IP estática, firewall, HTTPS), monitoreo constante y una estricta política de backups.
Esta arquitectura híbrida generalizada asegura que todas las operaciones críticas en el campo sean resilientes a fallos de conectividad, respetando la decisión de mantener un servidor central privado y proporcionando un método de contingencia manual robusto.