const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const SESSION_PATH = path.join(__dirname, 'fb_session');

// PALABRAS CLAVE
const KEYWORDS = ['LVF', 'LIGA VILLETANA', 'SUPER LIGA', 'SÚPER LIGA', 'SUPERLIGAVILLETANA'];

// Utility for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runSmartScraper() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

    console.clear();
    console.log("███████████████████████████████████████████████");
    console.log("█   ESCÁNER ROBUSTO - 'VER MÁS' + FECHAS 2025 █");
    console.log("███████████████████████████████████████████████");
    console.log("   • INTELIGENCIA: Deduce año 2025 si falta");
    console.log("   • FUERZA BRUTA: Clic agresivo en 'Ver más'");
    console.log("   • LIMPIEZA: Auto-borra posts viejos de RAM");
    console.log("███████████████████████████████████████████████\n");

    const browser = await puppeteer.launch({
        headless: false, // VER EL NAVEGADOR
        defaultViewport: null,
        protocolTimeout: 300000,
        args: [
            '--window-size=1000,800', // Ventana "pequeña" no maximizada
            '--disable-notifications',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--autoplay-policy=user-gesture-required',
            `--user-data-dir=${SESSION_PATH}`
        ]
    });

    try {
        let pages = await browser.pages();
        let page = pages.length > 0 ? pages[0] : await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const type = req.resourceType();
            if (['image', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'].includes(type)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        if (!page.url().includes('facebook.com')) {
            await page.goto('https://www.facebook.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
        }

        const SCANS_DIR = path.join(__dirname, 'scans');
        fs.ensureDirSync(SCANS_DIR);

        while (true) {
            console.log("\n-------------------------------------------------------------");
            const input = await askQuestion('👉 Pega URL (o "salir"): ');
            const trimmed = input.trim();

            if (trimmed.toLowerCase() === 'salir' || trimmed.toLowerCase() === 'exit') break;

            if (trimmed.length > 0 && trimmed.includes('facebook.com')) {
                process.stdout.write(`\n🌐 Cargando ${trimmed} ... `);
                try {
                    await page.goto(trimmed, { waitUntil: 'networkidle2', timeout: 90000 });
                    console.log(" ✅ Hecho.");
                } catch (e) {
                    console.log(" (Timeout, seguimos) ");
                }
            } else {
                console.log("⚠️ URL vacía o inválida. Usando actual...");
            }

            // Nombre Archivo (Restored)
            let pageTitle = "fb_page";
            try { pageTitle = (await page.title()).replace(/[^a-z0-9áéíóúñ]/gi, '_').substring(0, 30); } catch (e) { }

            // Resume Capability: Check for existing file
            let currentFilePath;
            const existingFile = getLatestScanFile(SCANS_DIR, pageTitle);
            const currentScanSeen = new Set();
            let loadedCount = 0;

            if (existingFile) {
                console.log(`\n📂 Se encontró un escaneo previo: ${path.basename(existingFile)}`);
                const ans = await askQuestion('¿Quieres CONTINUAR este archivo (c) o empezar uno NUEVO (n)? [c/n]: ');
                if (ans.toLowerCase().startsWith('n')) {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                    currentFilePath = path.join(SCANS_DIR, `scan_${pageTitle}_${timestamp}.txt`);
                    await fs.appendFile(currentFilePath, `=== REPORTE: ${await page.url()} ===\nRANGO OBJETIVO: HASTA 2024 (Inclusive)\n\n`);
                } else {
                    currentFilePath = existingFile;
                    console.log("📥 Cargando posts previos para no duplicar...");
                    try {
                        const content = await fs.readFile(currentFilePath, 'utf-8');
                        const blocks = content.split('----------------------------------------');
                        blocks.forEach(b => {
                            const clean = b.replace('[POST]', '').trim();
                            if (clean.length > 20) {
                                currentScanSeen.add(clean);
                                loadedCount++;
                            }
                        });
                        console.log(`✅ ${loadedCount} posts cargados en memoria.`);
                    } catch (err) {
                        console.log("⚠️ Error leyendo archivo, iniciando vacío.");
                    }
                }
            } else {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                currentFilePath = path.join(SCANS_DIR, `scan_${pageTitle}_${timestamp}.txt`);
                console.log(`\n📄 Nuevo Archivo: scans/${path.basename(currentFilePath)}`);
                await fs.appendFile(currentFilePath, `=== REPORTE: ${await page.url()} ===\nRANGO OBJETIVO: HASTA 2024 (Inclusive)\n\n`);
            }

            console.log("⏳ ANALIZANDO RANGO: Retrocediendo en el tiempo...");
            console.log("🎯 OBJETIVO: Guardar TODO hasta llegar al 2024.");

            let stopScanning = false;
            let scrollCount = 0;
            let lastDate = "Iniciando...";
            let postsRemoved = 0;
            let exitReason = "Desconocido";

            // State for dynamic date tracking
            const now = new Date();
            const currentMonthIndex = now.getMonth(); // 0 = Enero
            const currentYearActual = now.getFullYear();

            // Heuristic state
            let presumedYear = currentYearActual;
            let lastSeenMonthIndex = currentMonthIndex;

            while (!stopScanning) {
                scrollCount++;
                const spinner = ['|', '/', '-', '\\'][scrollCount % 4];
                process.stdout.write(`\r${spinner} Scroll #${scrollCount} | 💾 Base: ${currentScanSeen.size} (+${loadedCount} old) | 🗑️ RAM: ${postsRemoved} | 📅 ${lastDate}    `);

                // 1. DOM OPERATION: FORCE CLICK "SEE MORE" + EXTRACT + CLEAN
                let result = { posts: [], cleanedCount: 0 };
                try {
                    result = await page.evaluate(() => {
                        // --- A. ESTRATEGIA "VER MÁS" ROBUSTA ---
                        const candidates = document.querySelectorAll('div[role="button"], span, a, div[dir="auto"]');
                        candidates.forEach(el => {
                            const text = (el.innerText || "").trim().toLowerCase();
                            if (text === 'ver más' || text === 'see more' || text.includes('... ver más')) {
                                el.click();
                            }
                        });

                        // 2. Extracción
                        const out = [];
                        const articles = Array.from(document.querySelectorAll('div[role="article"]'));
                        articles.forEach(el => {
                            let text = el.innerText || "";
                            const markers = ['Todas las reacciones:', 'Me gusta\nComentar', 'Escribe un comentario'];
                            for (const m of markers) if (text.includes(m)) text = text.split(m)[0];
                            if (text.trim().length > 30) out.push(text.trim());
                        });

                        // 3. Limpieza RAM
                        let removed = 0;
                        if (articles.length > 50) {
                            const toRemove = articles.slice(0, articles.length - 40);
                            toRemove.forEach(n => { n.remove(); removed++; });
                        }
                        return { posts: out, cleanedCount: removed };
                    });
                } catch (e) { }

                await delay(800);
                postsRemoved += (result.cleanedCount || 0);

                // 2. FILTRADO INTELIGENTE Y DETECCIÓN DE FECHA
                let savedBatch = "";
                let countBatch = 0;

                for (const post of (result.posts || [])) {
                    // Regex Fecha (Header usually)
                    const dateMatch = post.match(/(\d{1,2})\s+de\s+([a-zA-Z]+)(?:\s+de\s+(\d{4}))?/i);

                    if (dateMatch) {
                        const day = parseInt(dateMatch[1]);
                        const monthStr = dateMatch[2].toLowerCase();
                        let year = dateMatch[3] ? parseInt(dateMatch[3]) : null;

                        // -- LÓGICA DINÁMICA DE AÑO --
                        if (!year) {
                            const mesMap = {
                                'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
                                'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
                            };
                            const postMonthIdx = mesMap[monthStr] !== undefined ? mesMap[monthStr] : -1;

                            if (postMonthIdx !== -1) {
                                // Si saltamos de Enero (0) a Diciembre (11) sin año explícito, bajamos un año (Retrocedimos)
                                // PERO cuidado con posts desordenados.
                                // Regla Simple: Si el mes del post es MAYOR que el mes actual (del sistema),
                                // y NO hay año, DEBE ser del año pasado.
                                // (Ej: Sys: Marzo. Post: Diciembre -> Obvio 2024 si estamos en 2025).

                                if (post.includes('202') && !year) {
                                    // A veces el regex falla el año pero el texto lo tiene cerca?
                                    // No, confiamos en regex para " de YYYY"
                                }

                                if (postMonthIdx > currentMonthIndex && presumedYear === currentYearActual) {
                                    year = currentYearActual - 1;
                                } else {
                                    year = presumedYear;
                                    // Falta: Qué pasa si scrolleamos MUCHO (más de 12 meses) y FB no pone año?
                                    // FB SIEMPRE pone año si tiene más de 12 meses (aprox). 
                                    // Asumimos que si no hay año, es "fresco" (< 1 año).
                                }
                            }
                        } else {
                            // Si leemos un año explícito, actualizamos nuestra presunción para posts siguientes sin año
                            if (year < presumedYear) presumedYear = year;
                        }

                        // VALIDACIÓN ESTRICTA DE "NO MENCIÓN"
                        // El usuario dice: "si se menciona 2024 en el texto NO cuenta, solo fecha de posteo".
                        // 'year' aquí viene de dateMatch (el header usualmente).
                        // ¿Puede dateMatch haber atrapado una fecha del cuerpo?
                        // dateMatch usa .match() que devuelve la PRIMERA ocurrencia.
                        // En un post de FB, la fecha de publicación CASI SIEMPRE está antes del contenido.
                        // Confiramos 'year' como la fecha real del post.

                        if (year) lastDate = `${day} de ${monthStr} de ${year}`;

                        // -- REGLAS DE PARADA (STOP) --
                        // Queremos "bajar hasta el 2024".
                        // --- REGLAS DE PARADA Y GUARDADO ---
                        if (year === 2026) continue; // Ignorar (muy nuevo)

                        // SANITY CHECK: Facebook no existía antes de 2004.
                        // Si detectamos 1927, probablemente sea un texto del body ("Nació en 1927").
                        if (year < 2005) {
                            // Ignoramos esta fecha "histórica" y seguimos buscando.
                            continue;
                        }

                        if (year <= 2024) {
                            console.log(`\n\n🛑 FIN: Llegamos a ${lastDate}. (Tope 2024)`);
                            console.log("📝 POST QUE DETONÓ EL FIN:\n" + post.substring(0, 300) + "...\n");

                            exitReason = `Se detectó fecha límite: ${year} (${lastDate}).\nPost Sample: ${post.substring(0, 100)}...`;
                            stopScanning = true;
                            break;
                        }
                    }

                    // -- GUARDADO (Deduplicación) --
                    // Guardamos todo lo que NO sea 2024 (ya que paramos al llegar)
                    // O guardamos todo lo que vemos mientras stopScanning sea false.

                    if (!stopScanning) {
                        const upper = post.toUpperCase();
                        // Filtrar por keywords? 
                        // El usuario dijo: "haga el ecraper de todas las fechas... rastrear toodo".
                        // ¿Quiere FILTRO o TODO? 
                        // "rastrear toodo bajando hasta el 2024". -> Suena a que quiere TODO lo que encuentre hasta 2024?
                        // Pero el script original tiene KEYWORDS.
                        // "analiza el script... dime quetal esta" -> User liked it.
                        // Voy a mantener el filtro de KEYWORDS porque es un scraper específico ("LIGAVILLETANA").
                        // Si quita el filtro, tendría gigas de basura. Asumo mantiene lógica de keywords.

                        if (KEYWORDS.some(k => upper.includes(k)) && !currentScanSeen.has(post)) {
                            currentScanSeen.add(post);
                            savedBatch += `[POST]\n${post}\n----------------------------------------\n`;
                            countBatch++;
                        }
                    }
                }

                if (countBatch > 0) await fs.appendFile(currentFilePath, savedBatch);
                if (stopScanning) break;

                // 3. SCROLL ROBUSTO
                try {
                    const previousHeight = await page.evaluate('document.body.scrollHeight');
                    await page.evaluate('window.scrollBy(0, 1000)');
                    await delay(1500);

                    const newHeight = await page.evaluate('document.body.scrollHeight');
                    if (newHeight === previousHeight) {
                        process.stdout.write(" (Esperando...)");

                        // ESTRATEGIA "SUPER-LENTO" para Internet Lento
                        let attempts = 0;
                        let stillStuck = true;
                        const MAX_RETRIES = 10; // Subimos de 3 a 10 intentos

                        while (attempts < MAX_RETRIES) {
                            attempts++;
                            // Espera progresiva: más intentos = más espera (5s, 6s, 7s...)
                            const waitTime = 5000 + (attempts * 1000);
                            await delay(waitTime);

                            // Jiggle Agresivo: Subir bastante y bajar fuerte para forzar trigger de carga
                            await page.evaluate(() => {
                                window.scrollBy(0, -600); // Subir más
                                setTimeout(() => window.scrollBy(0, 800), 1000); // Bajar más después de 1s
                            });

                            await delay(3000); // Esperar a que reaccione el DOM

                            const retryHeight = await page.evaluate('document.body.scrollHeight');
                            if (retryHeight > previousHeight) {
                                stillStuck = false; // Se destrabó!
                                console.log(" ✅ RECUPERADO! (Contador reiniciado a 0)");
                                break;
                            }
                            process.stdout.write(` Intento ${attempts}/${MAX_RETRIES}... `);
                        }

                        if (stillStuck) {
                            exitReason = `No carga más contenido tras ${MAX_RETRIES} intentos (Posible fin o Internet muy lento)`;
                            stopScanning = true;
                        }
                    }
                } catch (e) { }
            }
            console.log(`\n✨ Fin sesión. Posts capturados: ${currentScanSeen.size}`);
            console.log(`📋 Motivo de finalización: ${exitReason}`);

            // Log final en el archivo también
            await fs.appendFile(currentFilePath, `\n\n=== REPORTE FINAL DE SESIÓN ===\nFin: ${new Date().toLocaleString()}\nMotivo: ${exitReason}\nTotal Unicos: ${currentScanSeen.size}\n`);
        }
    } catch (e) {
        console.error("Error fatal:", e);
    } finally {
        await browser.close();
        rl.close();
        process.exit(0);
    }
}

function matchDateStr(m) {
    if (!m) return "???";
    return m[0];
}

// Helper to find the latest scan file for a page
function getLatestScanFile(dir, pageTitle) {
    try {
        const files = fs.readdirSync(dir).filter(f => f.startsWith(`scan_${pageTitle}_`) && f.endsWith('.txt'));
        if (files.length === 0) return null;
        // Sort by time (filename has timestamp)
        files.sort().reverse();
        return path.join(dir, files[0]);
    } catch (e) {
        return null;
    }
}

runSmartScraper();
