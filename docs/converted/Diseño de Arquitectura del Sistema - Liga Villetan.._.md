# Converted from Diseño de Arquitectura del Sistema - Liga Villetan.._.docx

Diseño de Arquitectura del Sistema - Liga Villetana
Versión: 1.0 Fecha: 7 de Junio de 2025 Stack Tecnológico de Referencia: Linux (Ubuntu), PostgreSQL, Python/Django, Nginx.
1. Modelo Arquitectónico Propuesto
Para este proyecto, se propone una Arquitectura Monolítica con Frontend Separado (Opcional).
Núcleo Monolítico (Backend): La aplicación principal se desarrollará utilizando el framework Django. Este enfoque monolítico significa que toda la lógica de negocio, la gestión de la base de datos (a través del ORM de Django) y la renderización de las páginas del panel de administración se manejarán dentro de una única base de código. Esto es ideal para la productividad y la robustez, especialmente con un equipo de desarrollo enfocado.
Frontend (Interfaz de Usuario):
Panel de Administración: Se generará utilizando el sistema de plantillas nativo de Django, enriquecido con CSS (Tailwind) y JavaScript ligero para la interactividad.
Portal Público: Se puede abordar de dos maneras:
Opción A (Recomendada para Simplicidad): Utilizar también las plantillas de Django. Esto mantiene todo el proyecto unificado y simplifica el despliegue.
Opción B (Para Mayor Interactividad): Desarrollar un frontend separado como una Aplicación de Página Única (SPA) usando React o Vue.js. Esta SPA se comunicaría con el backend de Django a través de una API REST. Esta opción ofrece una experiencia de usuario más fluida y moderna para el público, pero añade complejidad al desarrollo y al despliegue.
El siguiente diagrama ilustra esta arquitectura, considerando el despliegue en el servidor local de la Liga.
2. Diagrama de Arquitectura del Sistema
Este diagrama muestra los componentes clave y el flujo de comunicación entre ellos.
graph TD
    subgraph "Usuarios Externos (Internet)"
        direction LR
        U1(Aficionado en su casa)
        U2(Delegado/Admin Remoto)
    end

    subgraph "Usuarios Internos (Red Local de la Liga)"
        direction LR
        U3(Administrador de la Liga)
        U4(Operador de Boletería)
    end

    subgraph "Infraestructura Local en la Liga Villetana"
        direction TB
        subgraph "Servidor Físico/Virtual"
            direction LR
            Nginx[Nginx Web Server] --> AppServer{Aplicación Django}
            AppServer <--> DB[(PostgreSQL Database)]
        end
        Firewall(Firewall / Router de la Liga)
    end

    %% Conexiones
    U1 --> Internet --> Firewall
    U2 --> Internet --> Firewall
    U3 --> LAN --> Nginx
    U4 --> LAN --> Nginx
    Internet(Internet)
    LAN(Red Local)

    Firewall -- "Puerto 80/443" --> Nginx

    %% Estilos
    classDef user fill:#e0f2fe,stroke:#0ea5e9,color:#0c4a6e;
    classDef server-component fill:#dcfce7,stroke:#16a34a,color:#14532d;
    classDef network-infra fill:#fefce8,stroke:#ca8a04,color:#713f12;

    class U1,U2,U3,U4 user;
    class Nginx,AppServer,DB server-component;
    class Firewall,Internet,LAN network-infra;


Cómo visualizar el gráfico:
Copia todo el código que comienza con ```mermaid y termina con ` ```.
Pégalo en un editor online de Mermaid, como Mermaid Live Editor.
El diagrama visual se generará automáticamente.
3. Descripción de Componentes y Flujo de Datos
Usuarios (Aficionados, Admins, etc.):
Son los actores que interactúan con el sistema a través de un navegador web en sus dispositivos.
Pueden estar fuera de la liga (accediendo vía Internet) o dentro de la red local de la oficina.
Firewall / Router de la Liga:
Es el punto de entrada y salida de la red de la Liga.
Para que los usuarios externos accedan al portal, se debe configurar para redirigir las solicitudes web (tráfico en los puertos 80 para HTTP y 443 para HTTPS) al servidor Nginx. Esto se conoce como "port forwarding".
Actúa como una barrera de seguridad primaria.
Servidor Nginx (Web Server / Proxy Inverso):
Es el primer software en recibir todas las solicitudes web.
Función 1: Servir Archivos Estáticos. Entrega directamente los archivos que no cambian, como imágenes (logos de clubes), archivos CSS (estilos) y JavaScript. Esto es muy rápido y eficiente.
Función 2: Proxy Inverso. Cuando una solicitud requiere lógica de negocio (ej. ver una tabla de posiciones, guardar un resultado), Nginx no la procesa, sino que la reenvía a la Aplicación Django. Luego, recibe la respuesta de Django y se la devuelve al usuario.
Aplicación Django (Servidor de Aplicación):
Este es el cerebro del sistema. Contiene toda la lógica de negocio.
Procesa las solicitudes reenviadas por Nginx.
Interactúa con la base de datos para leer o escribir información (ej. pide los resultados de los partidos, guarda un nuevo jugador).
Genera las páginas HTML que se envían de vuelta al usuario (o los datos en formato JSON si se usa una API REST).
Base de Datos PostgreSQL:
Es el almacén de datos del sistema.
Guarda de forma persistente y estructurada toda la información en las tablas que hemos diseñado.
Ejemplo de Flujo de Datos: "Un Aficionado consulta la Tabla de Posiciones"
Solicitud: El aficionado escribe la URL del portal en su navegador. La solicitud viaja por Internet hasta el router de la Liga.
Redirección: El router/firewall ve que la solicitud es para el servidor web y la redirige al servidor Nginx.
Proxy: Nginx recibe la solicitud para ver la tabla de posiciones. Como esto requiere lógica, la reenvía a la aplicación Django.
Procesamiento: La aplicación Django recibe la solicitud.
Su lógica consulta a la base de datos PostgreSQL: "Dame los datos de la tabla de posiciones para el Torneo X, Serie Y".
PostgreSQL devuelve los datos solicitados a Django.
Django toma los datos y los inserta en una plantilla HTML.
Respuesta: Django envía la página HTML completa de vuelta a Nginx.
Entrega: Nginx entrega esta página HTML al navegador del aficionado, quien finalmente ve la tabla de posiciones en su pantalla.
4. Consideraciones Específicas para el Servidor Local
Acceso Externo vs. Interno: Es fundamental definir si el sistema será accesible desde fuera de la red de la Liga. Si la respuesta es sí (lo cual es necesario para el portal público y el acceso remoto), la configuración de la red (DNS, port forwarding, IP estática o DNS dinámico) es una tarea técnica crítica.
Seguridad Física y Lógica: El servidor debe estar físicamente seguro. Lógicamente, debe estar protegido con firewalls de software, actualizaciones de seguridad regulares del sistema operativo y de todo el software, y una política de contraseñas robusta.
Mantenimiento y Backups: Se debe establecer un plan estricto para realizar backups automáticos y regulares de la base de datos y de la aplicación. Es crucial que las copias de seguridad se almacenen también en una ubicación externa al servidor físico (ej. un disco duro externo o un servicio en la nube).
Con este diseño de arquitectura, hemos completado la Tarea 2.2. Tenemos un plano claro de cómo funcionará el sistema desde una perspectiva técnica, lo que nos prepara para la siguiente etapa: el diseño visual de las interfaces (UI/UX).