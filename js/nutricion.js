/**
 * ═══════════════════════════════════════════════════════════════
 * nutricion.js — Lógica Completa de Nutrición
 * Proyecto: El Camino al Fútbol Profesional con Dios
 *
 * MÓDULOS:
 *  1. FOOD_DB       → Base de datos de comidas (50+ recetas)
 *  2. Storage       → localStorage — persiste TODO entre recargas
 *  3. Tracker       → Calcula y actualiza macros del día
 *  4. FoodCatalog   → Renderiza y filtra tarjetas de comida
 *  5. LogModule     → Lista de comidas registradas hoy
 *  6. ChartModule   → Gráfico semanal con Chart.js
 *  7. SportProtocol → Sección de nutrición pre/post partido
 *  8. TipsModule    → Tips de nutrición deportiva
 *  9. HydrationMod  → Tracker de hidratación
 * 10. ModalModule   → Modal de detalle de comida
 * 11. ToastModule   → Notificaciones
 * 12. NavModule     → Navbar, hamburger, scroll
 * 13. CursorModule  → Cursor animado
 * 14. ThemeModule   → Modo oscuro/claro
 * 15. INIT          → Punto de entrada
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. FOOD_DB — Base de datos completa de comidas
   ─ Sin pescado, con comidas reales argentinas + internacionales.
   ─ Cada comida tiene: id, nombre, categoría, imagen (Unsplash),
     calorías, proteínas, carbohidratos, grasas, ingredientes, preparación.
═══════════════════════════════════════════════════════════════ */

const FOOD_DB = [

  /* ── DESAYUNOS ─────────────────────────────── */
  {
    id: 'des_01',
    nombre: 'Panqueques de Avena con Banana',
    categoria: 'desayuno',
    imagen: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
    calorias: 420, proteinas: 22, carbos: 58, grasas: 10,
    ingredientes: '1 banana madura, 2 huevos, 80g avena, 1 cdita miel, pizca de canela, aceite de coco',
    preparacion: 'Pisá la banana y mezclá con los huevos batidos y la avena. Cocinás en sartén antiadherente con aceite de coco, 2 minutos por lado a fuego medio. Servís con miel y canela.'
  },
  {
    id: 'des_02',
    nombre: 'Yogur con Avena y Frutas',
    categoria: 'desayuno',
    imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    calorias: 380, proteinas: 18, carbos: 52, grasas: 8,
    ingredientes: '200g yogur griego, 60g avena, 1 banana, 1 puñado de arándanos, 1 cdita de miel, 10g nueces',
    preparacion: 'Colocás el yogur en un bowl, agregás la avena, cortás la banana en rodajas, sumás los arándanos, rociás con miel y decorás con las nueces partidas.'
  },
  {
    id: 'des_03',
    nombre: 'Huevos Revueltos con Pan Integral',
    categoria: 'desayuno',
    imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
    calorias: 340, proteinas: 24, carbos: 28, grasas: 14,
    ingredientes: '3 huevos, 2 rebanadas pan integral, 1 cdita manteca, sal, pimienta, orégano, opcional: tomate cherry',
    preparacion: 'Batís los huevos con sal y pimienta. Calentás la manteca en sartén a fuego bajo, agregás los huevos y revolvés suavemente. Tostás el pan y servís junto con los huevos.'
  },
  {
    id: 'des_04',
    nombre: 'Tostadas con Palta y Huevo',
    categoria: 'desayuno',
    imagen: 'https://images.cookforyourlife.org/wp-content/uploads/2021/12/AvocadoToastWithEgg.jpg',
    calorias: 460, proteinas: 20, carbos: 32, grasas: 28,
    ingredientes: '2 tostadas de pan integral, 1 palta mediana, 2 huevos, jugo de limón, sal, pimienta, semillas de sésamo',
    preparacion: 'Tostás el pan. Pisás la palta con limón, sal y pimienta. Preparás los huevos poché (3 min en agua hirviendo con vinagre). Untás la palta en las tostadas y colocás los huevos encima.'
  },
  {
    id: 'des_05',
    nombre: 'Bowl de Frutas y Granola',
    categoria: 'desayuno',
    imagen: 'https://www.justspices.es/media/recipe/bowl-frutas-granola.jpg',
    calorias: 360, proteinas: 12, carbos: 62, grasas: 9,
    ingredientes: '150g yogur, 50g granola artesanal, 1 banana, fresas, mango, 1 cdita de miel',
    preparacion: 'Colocás el yogur como base, distribuís la granola, cortás las frutas en trozos y las disponés encima. Terminás con un hilo de miel.'
  },
  {
    id: 'des_06',
    nombre: 'Licuado de Proteínas Natural',
    categoria: 'desayuno',
    imagen: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80',
    calorias: 390, proteinas: 28, carbos: 44, grasas: 8,
    ingredientes: '250ml leche descremada, 1 banana, 2 cdas mantequilla de maní, 60g avena, 1 huevo (pasteurizado), 1 cdita cacao',
    preparacion: 'Licuás todos los ingredientes hasta obtener una textura homogénea. Servís frío inmediatamente. Podés agregar hielo si preferís más fresco.'
  },
  {
    id: 'des_07',
    nombre: 'Tostadas Francesas con Miel',
    categoria: 'desayuno',
    imagen: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80',
    calorias: 410, proteinas: 16, carbos: 55, grasas: 14,
    ingredientes: '3 rebanadas pan lactal, 2 huevos, 100ml leche, canela, vainilla, miel, manteca para cocinar',
    preparacion: 'Batís los huevos con leche, canela y vainilla. Remojás el pan en la mezcla. Cocinás en sartén con manteca a fuego medio dorado de ambos lados. Servís con miel.'
  },

  /* ── ALMUERZOS ─────────────────────────────── */
  {
    id: 'alm_01',
    nombre: 'Arroz con Zanahoria y Milanesa de Pollo',
    categoria: 'almuerzo',
    imagen: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80',
    calorias: 620, proteinas: 48, carbos: 65, grasas: 14,
    ingredientes: '200g pechuga de pollo, 150g arroz blanco, 2 zanahorias, 1 huevo, pan rallado, aceite de girasol, ajo en polvo, sal, perejil',
    preparacion: 'Apanás el pollo pasándolo por huevo y pan rallado con condimentos. Freís o cocinás al horno 180°C por 20 min. Hervís el arroz con la zanahoria rallada hasta tiernos. Servís juntos.'
  },
  {
    id: 'alm_02',
    nombre: 'Bife de Novillo con Ensalada Mixta',
    categoria: 'almuerzo',
    imagen: 'https://elcheverin.com/lasmargaritas/wp-content/uploads/sites/10/2025/12/CUADRIL-CON-ENSALADA-MIXTA.jpg',
    calorias: 520, proteinas: 55, carbos: 12, grasas: 28,
    ingredientes: '250g bife de novillo, lechuga, tomate, cebolla morada, zanahoria rallada, aceite de oliva, limón, sal gruesa, romero',
    preparacion: 'Grillás el bife a fuego fuerte 3-4 min por lado. Reposás 5 min. Preparás la ensalada con todos los vegetales, condimentás con aceite y limón. Servís junto al bife cortado.'
  },
  {
    id: 'alm_03',
    nombre: 'Milanesa con Lechuga y Garbanzos',
    categoria: 'almuerzo',
    imagen: 'https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/55c0a5b3381868a5c4d84070ab05ed89.jpg',
    calorias: 590, proteinas: 44, carbos: 55, grasas: 18,
    ingredientes: '200g milanesa de carne, 150g garbanzos cocidos, lechuga, tomate, cebolla, aceite de oliva, limón, sal, orégano',
    preparacion: 'Cocinás la milanesa al horno o a la plancha. Mezclás los garbanzos con los vegetales frescos, condimentás. Servís la milanesa sobre la ensalada de garbanzos.'
  },
  {
    id: 'alm_04',
    nombre: 'Pasta con Pollo a la Provenzal',
    categoria: 'almuerzo',
    imagen: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80',
    calorias: 580, proteinas: 42, carbos: 70, grasas: 12,
    ingredientes: '150g fideos integrales, 200g pechuga pollo, 2 dientes ajo, perejil, aceite de oliva, sal, pimienta, 1 limón',
    preparacion: 'Cocinás la pasta al dente. Salteás el pollo fileteado con ajo y aceite. Al apagar el fuego agregás perejil picado y jugo de limón. Mezclás con la pasta y servís.'
  },
  {
    id: 'alm_05',
    nombre: 'Pollo al Horno con Papas',
    categoria: 'almuerzo',
    imagen: 'https://cdn.avena.io/avena-recipes-v2/agtzfmF2ZW5hLWJvdHIZCxIMSW50ZXJjb21Vc2VyGICAgMW2rJ8LDA/22-04-2020/1587597532219.jpeg',
    calorias: 560, proteinas: 46, carbos: 48, grasas: 16,
    ingredientes: '1 cuarto de pollo, 3 papas medianas, ajo, romero, tomillo, aceite de oliva, sal, pimienta, limón',
    preparacion: 'Condimentás el pollo con ajo, limón y hierbas. Cortás las papas en gajos. Colocás todo en asadera con aceite. Horneás a 200°C por 40-45 minutos hasta dorado.'
  },
  {
    id: 'alm_06',
    nombre: 'Bowl de Arroz Integral con Vegetales',
    categoria: 'almuerzo',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTblAYsXAWhuj7UKGUIJIKlrwxRv2PWMLRanw&s',
    calorias: 480, proteinas: 18, carbos: 75, grasas: 11,
    ingredientes: '180g arroz integral, brócoli, zanahoria, morrón, cebolla, salsa de soja, aceite de sésamo, jengibre, ajo',
    preparacion: 'Cocinás el arroz integral (30 min). Salteás los vegetales en wok con aceite de sésamo, ajo y jengibre. Mezclás con el arroz y condimentás con soja.'
  },
  {
    id: 'alm_07',
    nombre: 'Hamburguesa de Carne con Batata',
    categoria: 'almuerzo',
    imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    calorias: 640, proteinas: 40, carbos: 62, grasas: 22,
    ingredientes: '200g carne picada magra, 2 batatas medianas, lechuga, tomate, cebolla, 1 pan integral, sal, pimienta, ajo',
    preparacion: 'Formás hamburguesas con la carne condimentada. Cocinás en sartén 4 min por lado. Cocinás las batatas al horno en gajos. Armás la hamburguesa con los vegetales frescos.'
  },
  {
    id: 'alm_08',
    nombre: 'Lentejas con Chorizo Pollo',
    categoria: 'almuerzo',
    imagen: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
    calorias: 520, proteinas: 36, carbos: 58, grasas: 14,
    ingredientes: '200g lentejas secas, 1 chorizo de pollo, 1 zanahoria, 1 cebolla, 2 dientes ajo, tomate, laurel, pimentón, sal',
    preparacion: 'Remojás las lentejas 1 hora. Sofreís cebolla, ajo y zanahoria. Agregás el chorizo en rodajas. Sumás las lentejas escurridas con agua y laurel. Cocinás 25-30 min hasta tiernos.'
  },

  /* ── CENAS ─────────────────────────────────── */
  {
    id: 'cen_01',
    nombre: 'Pechuga a la Plancha con Vegetales',
    categoria: 'cena',
    imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    calorias: 380, proteinas: 42, carbos: 22, grasas: 12,
    ingredientes: '200g pechuga de pollo, zucchini, morrón, cebolla morada, aceite de oliva, limón, sal, orégano, tomillo',
    preparacion: 'Condimentás el pollo con sal, limón y orégano. Cocinás a la plancha 5 min por lado. Salteás los vegetales cortados en aceite. Servís todo junto con limón fresco.'
  },
  {
    id: 'cen_02',
    nombre: 'Omelette Vegetal con Queso',
    categoria: 'cena',
    imagen: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&q=80',
    calorias: 320, proteinas: 26, carbos: 12, grasas: 20,
    ingredientes: '3 huevos, espinaca, tomate, cebolla, queso descremado, sal, pimienta, manteca',
    preparacion: 'Batís los huevos. Salteás los vegetales. Derretís manteca en sartén antiadherente, volcás los huevos, distribuís los vegetales y el queso, plegás a la mitad.'
  },
  {
    id: 'cen_03',
    nombre: 'Sopa de Verduras con Pollo',
    categoria: 'cena',
    imagen: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    calorias: 280, proteinas: 28, carbos: 26, grasas: 6,
    ingredientes: '200g pechuga pollo, 2 papas, 2 zanahorias, apio, cebolla, ajo, caldo casero, perejil, sal, pimienta',
    preparacion: 'Hervís el pollo en caldo con cebolla y ajo. Retirás y desmenuzás. Agregás las verduras en cubos al caldo, cocinás 20 min. Volvés a agregar el pollo y condimentás.'
  },
  {
    id: 'cen_04',
    nombre: 'Revuelto de Huevo con Espinaca',
    categoria: 'cena',
    imagen: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
    calorias: 290, proteinas: 22, carbos: 10, grasas: 18,
    ingredientes: '3 huevos, 150g espinaca, 2 dientes ajo, aceite de oliva, sal, pimienta, queso rallado opcional',
    preparacion: 'Saltéas el ajo en aceite, agregás la espinaca hasta que se reduzca. Batís los huevos con sal y pimienta, los volcás sobre la espinaca y revolvés suavemente.'
  },
  {
    id: 'cen_05',
    nombre: 'Arroz con Leche Light',
    categoria: 'cena',
    imagen: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80',
    calorias: 310, proteinas: 10, carbos: 54, grasas: 6,
    ingredientes: '80g arroz, 400ml leche descremada, edulcorante, canela en rama, cáscara de limón, esencia de vainilla',
    preparacion: 'Cocinás el arroz en leche a fuego bajo con la canela y la cáscara de limón, revolviendo constantemente por 25 min. Agregás edulcorante y vainilla al final.'
  },
  {
    id: 'cen_06',
    nombre: 'Pollo al Limón con Brócoli',
    categoria: 'cena',
    imagen: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80',
    calorias: 350, proteinas: 40, carbos: 16, grasas: 14,
    ingredientes: '200g pechuga pollo, brócoli, limón, ajo, aceite de oliva, sal, pimienta, romero',
    preparacion: 'Marinás el pollo en limón, ajo y romero por 20 min. Cocinás al horno 200°C por 20 min. Hervís el brócoli 5 min al vapor. Servís todo junto con jugo de limón.'
  },

  /* ── MERIENDAS ─────────────────────────────── */
  {
    id: 'mer_01',
    nombre: 'Tostadas con Mantequilla de Maní',
    categoria: 'merienda',
    imagen: 'https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000249%2Fv3%2Frect.jpeg',
    calorias: 280, proteinas: 12, carbos: 30, grasas: 14,
    ingredientes: '2 tostadas pan integral, 2 cdas mantequilla de maní natural, 1 banana, canela',
    preparacion: 'Tostás el pan. Untás con mantequilla de maní. Cortás la banana en rodajas y disponés encima. Espolvoreás canela.'
  },
  {
    id: 'mer_02',
    nombre: 'Bowl de Frutas con Miel',
    categoria: 'merienda',
    imagen: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80',
    calorias: 220, proteinas: 4, carbos: 48, grasas: 2,
    ingredientes: 'Banana, manzana, naranja, kiwi, uvas, miel, menta fresca',
    preparacion: 'Cortás todas las frutas en trozos del mismo tamaño. Las mezclás en un bowl. Rociás con miel y decorás con hojas de menta fresca.'
  },
  {
    id: 'mer_03',
    nombre: 'Barra de Avena Casera',
    categoria: 'merienda',
    imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
    calorias: 300, proteinas: 8, carbos: 45, grasas: 10,
    ingredientes: '200g avena, 3 cdas miel, 2 cdas mantequilla de maní, banana pisada, pasas, nueces, canela',
    preparacion: 'Mezclás la avena con miel, mantequilla de maní y banana pisada. Agregás pasas y nueces. Formás una capa en molde y horneás a 170°C por 20 min. Cortás en barras al enfriar.'
  },
  {
    id: 'mer_04',
    nombre: 'Yogur Griego con Nueces',
    categoria: 'merienda',
    imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    calorias: 250, proteinas: 16, carbos: 22, grasas: 10,
    ingredientes: '200g yogur griego natural, 20g nueces, 1 cdita miel, canela, opcional: arándanos',
    preparacion: 'Colocás el yogur en un bowl. Partís las nueces y las ponés encima. Rociás con miel y espolvoreás canela. Añadís arándanos si tenés.'
  },
  {
    id: 'mer_05',
    nombre: 'Licuado Energizante Pre-Tarde',
    categoria: 'merienda',
    imagen: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80',
    calorias: 310, proteinas: 15, carbos: 50, grasas: 6,
    ingredientes: '1 banana, 200ml leche, 2 cdas avena, 1 cdita cacao, 1 cdita miel, hielo',
    preparacion: 'Licuás todos los ingredientes con hielo hasta obtener una bebida cremosa. Servís frío inmediatamente.'
  },

  /* ── PRE-PARTIDO ───────────────────────────── */
  {
    id: 'pre_01',
    nombre: 'Pasta Integral con Pollo',
    categoria: 'pre-partido',
    imagen: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&q=80',
    calorias: 580, proteinas: 40, carbos: 75, grasas: 10,
    ingredientes: '160g fideos integrales, 200g pollo, aceite de oliva, ajo, sal, tomate fresco, albahaca',
    preparacion: 'Cocinás la pasta al dente. Salteás el pollo en tiras con ajo y aceite. Mezclás con la pasta, agregás tomate fresco y albahaca. Ideal 2.5-3 horas antes del partido.'
  },
  {
    id: 'pre_02',
    nombre: 'Arroz con Pollo Liviano',
    categoria: 'pre-partido',
    imagen: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
    calorias: 540, proteinas: 42, carbos: 68, grasas: 8,
    ingredientes: '180g arroz blanco, 200g pechuga pollo, zanahoria, caldo casero, sal, pimienta suave, laurel',
    preparacion: 'Cocinás el arroz en caldo con laurel. Preparás la pechuga hervida o a la plancha simple. Servís juntos. Esta comida liviana no genera pesadez para el partido.'
  },
  {
    id: 'pre_03',
    nombre: 'Banana con Avena y Miel (Snack Pre)',
    categoria: 'pre-partido',
    imagen: 'https://www.chiquita.es/wp-content/uploads/2022/07/N-220707_JUL_Overnight-oats-with-banana.jpg',
    calorias: 280, proteinas: 8, carbos: 52, grasas: 4,
    ingredientes: '2 bananas, 40g avena cocida, 1 cdita miel, pizca de sal',
    preparacion: 'Ideal 60-90 minutos antes del partido. Cocinás la avena con agua. Cortás las bananas en rodajas y mezclás con la avena tibia. Terminás con miel y una pizca de sal.'
  },
  {
    id: 'pre_04',
    nombre: 'Tostadas con Huevo y Tomate',
    categoria: 'pre-partido',
    imagen: 'https://truffle-assets.tastemadecontent.net/7cdd49b9-tostada-con-huevo-desayuno-en-5-min_l_es_thumb.png',
    calorias: 360, proteinas: 22, carbos: 38, grasas: 12,
    ingredientes: '3 tostadas integrales, 2 huevos revueltos, tomate en rodajas, aceite de oliva, sal, orégano',
    preparacion: 'Preparás los huevos revueltos suaves. Tostás el pan. Armás las tostadas con el tomate cortado, los huevos y rociás aceite. Consumís 2-2.5 horas antes.'
  },

  /* ── POST-PARTIDO ──────────────────────────── */
  {
    id: 'pos_01',
    nombre: 'Pollo con Arroz y Verduras (Recuperación)',
    categoria: 'post-partido',
    imagen: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80',
    calorias: 640, proteinas: 52, carbos: 68, grasas: 12,
    ingredientes: '250g pechuga pollo, 200g arroz blanco, brócoli, zanahoria, aceite de oliva, sal, limón, cúrcuma',
    preparacion: 'Cocinás el pollo a la plancha. Hervís el arroz. Salteás las verduras con cúrcuma anti-inflamatoria. Mezclás todo y rociás con limón. Consumís dentro de los 30-45 min post partido.'
  },
  {
    id: 'pos_02',
    nombre: 'Licuado de Recuperación Muscular',
    categoria: 'post-partido',
    imagen: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=600&q=80',
    calorias: 420, proteinas: 32, carbos: 55, grasas: 8,
    ingredientes: '300ml leche, 2 cdas mantequilla de maní, 1 banana, 60g avena, 2 huevos (pasteurizados), miel, cacao',
    preparacion: 'Licuás todo inmediatamente post partido. Es el momento donde el músculo absorbe mejor los nutrientes. Consumís dentro de los primeros 20-30 minutos.'
  },
  {
    id: 'pos_03',
    nombre: 'Bife con Papa Cocida (Recuperación)',
    categoria: 'post-partido',
    imagen: 'https://gourmet.iprospect.cl/wp-content/uploads/2016/09/car10.jpg',
    calorias: 580, proteinas: 50, carbos: 45, grasas: 18,
    ingredientes: '250g bife de novillo, 3 papas medianas, sal, limón, aceite de oliva, ensalada de hojas verdes',
    preparacion: 'Grillás el bife. Hervís las papas con cáscara. Acompañás con ensalada fresca. La combinación proteínas + carbos facilita la recuperación muscular y el rellenado de glucógeno.'
  },
  {
    id: 'pos_04',
    nombre: 'Yogur con Avena y Banana (Post Rápido)',
    categoria: 'post-partido',
    imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    calorias: 380, proteinas: 20, carbos: 58, grasas: 6,
    ingredientes: '250g yogur griego, 60g avena, 1 banana grande, 1 cdita miel, canela',
    preparacion: 'Mezclás el yogur con la avena. Cortás la banana en rodajas. Combinás todo en un bowl con miel y canela. Opción rápida y eficiente cuando no hay tiempo de cocinar.'
  },
  {
    id: 'pos_05',
    nombre: 'Sandwich de Pollo Post-Partido',
    categoria: 'post-partido',
    imagen: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&q=80',
    calorias: 490, proteinas: 38, carbos: 52, grasas: 12,
    ingredientes: '200g pechuga pollo grillada, 2 rebanadas pan integral, lechuga, tomate, zanahoria rallada, mostaza, sal',
    preparacion: 'Cocinás el pollo a la plancha con sal y limón. Armás el sandwich con todos los ingredientes. Opción práctica y completa para llevar al vestuario post partido.'
  },

  /* ── EXTRAS ADICIONALES ────────────────────── */
  {
    id: 'des_08',
    nombre: 'Avena Nocturna (Overnight Oats)',
    categoria: 'desayuno',
    imagen: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80',
    calorias: 400, proteinas: 15, carbos: 60, grasas: 9,
    ingredientes: '80g avena, 200ml leche, 1 banana, 1 cdita chía, miel, canela. Preparar la noche anterior.',
    preparacion: 'La noche anterior mezclás avena, leche, chía y miel en un frasco. Refrigerás toda la noche. A la mañana agregás la banana cortada y canela. Sin cocción necesaria.'
  },
  {
    id: 'alm_09',
    nombre: 'Tarta de Carne y Vegetales',
    categoria: 'almuerzo',
    imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    calorias: 550, proteinas: 35, carbos: 48, grasas: 20,
    ingredientes: '250g carne magra, 1 tapa de tarta, morrón, cebolla, huevo, sal, pimienta, queso descremado',
    preparacion: 'Sofreís la carne con cebolla y morrón. Ligás con el huevo batido. Colocás en tapa de tarta, cubrís con queso y horneás 35 min a 180°C.'
  },
  {
    id: 'alm_10',
    nombre: 'Cazuela de Pollo con Batata',
    categoria: 'almuerzo',
    imagen: 'https://i.blogs.es/ae20d3/pollo-verduras/1366_2000.jpg',
    calorias: 530, proteinas: 44, carbos: 52, grasas: 12,
    ingredientes: '300g muslos de pollo, 2 batatas, cebolla, ajo, tomate, caldo, paprika, comino, sal',
    preparacion: 'Dorás el pollo en cazuela. Agregás cebolla, ajo y tomate. Sumás la batata en cubos y caldo. Cocinás tapado 35-40 min a fuego bajo hasta que la batata esté tierna.'
  },
  {
    id: 'mer_06',
    nombre: 'Crackers con Queso y Tomate',
    categoria: 'merienda',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTY83liG7ljiYhhDhd-7xQCmtTRxyTM9g1hg&s',
    calorias: 200, proteinas: 10, carbos: 22, grasas: 8,
    ingredientes: '6 crackers integrales, 60g queso fresco light, tomate cherry, albahaca, aceite de oliva, sal',
    preparacion: 'Cortás el tomate en mitades. Ponés una rodaja de queso sobre cada cracker. Agregás el tomate, unas gotas de aceite y albahaca fresca.'
  },
  {
    id: 'pre_05',
    nombre: 'Polenta con Pollo (Pre-Partido Invernal)',
    categoria: 'pre-partido',
    imagen: 'https://www.clarin.com/2025/07/07/gSxVGRG-9_2000x1500__1.jpg',
    calorias: 560, proteinas: 40, carbos: 72, grasas: 10,
    ingredientes: '150g polenta, 200g pollo, salsa de tomate natural, sal, parmesano rallado light',
    preparacion: 'Preparás la polenta según instrucciones. Cocinás el pollo en salsa de tomate. Servís la polenta con el pollo encima y el queso rallado. Ideal en días fríos de partido.'
  },
];

/* ═══════════════════════════════════════════════════════════════
   2. STORAGE MODULE
   ─ TODO lo que el usuario registra se guarda en localStorage.
   ─ Claves usadas:
   ─   "elcamino_nut_today_v2"  → {fecha, comidas[], macros, agua}
   ─   "elcamino_nut_history_v2" → Array de días históricos
   ─   "elcamino_nut_theme"     → 'dark' | 'light'
═══════════════════════════════════════════════════════════════ */

const Storage = (() => {
  const KEY_TODAY   = 'elcamino_nut_today_v2';
  const KEY_HISTORY = 'elcamino_nut_history_v2';
  const KEY_THEME   = 'elcamino_nut_theme';

  // Retorna el string YYYY-MM-DD de hoy
  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * getToday() — devuelve los datos del día actual.
   * Si el día guardado es diferente al de hoy,
   * archiva el día anterior en el historial y crea uno nuevo.
   */
  function getToday() {
    try {
      const raw = localStorage.getItem(KEY_TODAY);
      if (!raw) return freshDay();
      const data = JSON.parse(raw);

      // Si el día guardado NO es hoy → archivar y crear nuevo
      if (data.fecha !== todayStr()) {
        if (data.comidas && data.comidas.length > 0) {
          archiveDay(data);
        }
        return freshDay();
      }
      return data;
    } catch {
      return freshDay();
    }
  }

  /** freshDay() — estructura de un día nuevo */
  function freshDay() {
    return {
      fecha: todayStr(),
      comidas: [],
      macros: { calorias: 0, proteinas: 0, carbos: 0, grasas: 0 },
      agua: 0
    };
  }

  /** saveToday() — persiste el día actual */
  function saveToday(data) {
    try { localStorage.setItem(KEY_TODAY, JSON.stringify(data)); } catch {}
  }

  /** archiveDay() — guarda el día en el historial */
  function archiveDay(dayData) {
    const history = getHistory();
    // No duplicar
    const exists = history.find(d => d.fecha === dayData.fecha);
    if (!exists) {
      history.push({
        fecha:    dayData.fecha,
        calorias: dayData.macros.calorias,
        proteinas: dayData.macros.proteinas,
        carbos:   dayData.macros.carbos,
        grasas:   dayData.macros.grasas,
        comidas:  dayData.comidas.length
      });
      // Guardar solo los últimos 90 días
      const trimmed = history.slice(-90);
      try { localStorage.setItem(KEY_HISTORY, JSON.stringify(trimmed)); } catch {}
    }
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(KEY_HISTORY)) || []; } catch { return []; }
  }

  // También guarda el día actual al historial cuando se consulta (para el gráfico)
  function syncTodayToHistory() {
    const today = getToday();
    if (today.comidas.length > 0) {
      const history = getHistory();
      const idx = history.findIndex(d => d.fecha === today.fecha);
      const entry = {
        fecha:     today.fecha,
        calorias:  today.macros.calorias,
        proteinas: today.macros.proteinas,
        carbos:    today.macros.carbos,
        grasas:    today.macros.grasas,
        comidas:   today.comidas.length
      };
      if (idx >= 0) history[idx] = entry;
      else history.push(entry);
      try { localStorage.setItem(KEY_HISTORY, JSON.stringify(history.slice(-90))); } catch {}
    }
  }

  function addFood(food) {
    const today = getToday();
    today.comidas.push({
      foodId:    food.id,
      nombre:    food.nombre,
      categoria: food.categoria,
      imagen:    food.imagen,
      calorias:  food.calorias,
      proteinas: food.proteinas,
      carbos:    food.carbos,
      grasas:    food.grasas,
      hora:      new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      logId:     `log_${Date.now()}`
    });
    recalcMacros(today);
    saveToday(today);
    syncTodayToHistory();
    return today;
  }

  function removeFood(logId) {
    const today = getToday();
    today.comidas = today.comidas.filter(c => c.logId !== logId);
    recalcMacros(today);
    saveToday(today);
    syncTodayToHistory();
    return today;
  }

  function addWater(today) {
    today.agua = Math.min(today.agua + 1, 8);
    saveToday(today);
    return today;
  }

  function resetDay() {
    const fresh = freshDay();
    saveToday(fresh);
    return fresh;
  }

  function recalcMacros(today) {
    today.macros = today.comidas.reduce((acc, c) => ({
      calorias:  acc.calorias  + (c.calorias  || 0),
      proteinas: acc.proteinas + (c.proteinas || 0),
      carbos:    acc.carbos    + (c.carbos    || 0),
      grasas:    acc.grasas    + (c.grasas    || 0)
    }), { calorias: 0, proteinas: 0, carbos: 0, grasas: 0 });
  }

  function getTheme() { try { return localStorage.getItem(KEY_THEME) || 'dark'; } catch { return 'dark'; } }
  function saveTheme(t) { try { localStorage.setItem(KEY_THEME, t); } catch {} }

  return { getToday, saveToday, addFood, removeFood, addWater, resetDay, getHistory, syncTodayToHistory, getTheme, saveTheme };
})();

/* ═══════════════════════════════════════════════════════════════
   3. TRACKER MODULE
   ─ Actualiza los anillos SVG y barras de progreso de macros.
   ─ Las metas diarias para un futbolista de 70kg:
   ─   Calorías: 2800 kcal · Proteínas: 160g · Carbos: 350g · Grasas: 90g
═══════════════════════════════════════════════════════════════ */

const Tracker = (() => {
  const METAS = { calorias: 2800, proteinas: 160, carbos: 350, grasas: 90 };
  const CIRCUNFERENCIA = 327; // 2π * r(52px)

  function update(macros) {
    setRing('Cal',  macros.calorias,  METAS.calorias,  CIRCUNFERENCIA);
    setRing('Prot', macros.proteinas, METAS.proteinas, CIRCUNFERENCIA);
    setRing('Carb', macros.carbos,    METAS.carbos,    CIRCUNFERENCIA);
    setRing('Fat',  macros.grasas,    METAS.grasas,    CIRCUNFERENCIA);
  }

  function setRing(id, valor, meta, circ) {
    const pct   = Math.min(valor / meta, 1);
    const offset = circ - (circ * pct);
    const ringEl = document.getElementById(`ring${id}`);
    const valEl  = document.getElementById(`ring${id}Val`);
    const barEl  = document.getElementById(`bar${id}`);

    if (ringEl) ringEl.style.strokeDashoffset = offset;
    if (valEl)  valEl.textContent = Math.round(valor);
    if (barEl)  barEl.style.width = (pct * 100).toFixed(1) + '%';

    // Feedback visual si supera la meta
    const card = document.getElementById(`macro${id}Card`);
    if (card) card.classList.toggle('over-meta', valor > meta);
  }

  function updateDate() {
    const el = document.getElementById('trackerDate');
    if (el) {
      el.textContent = new Date().toLocaleDateString('es-AR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  function updateFoodCount(count) {
    const el = document.getElementById('tlCount');
    if (el) el.textContent = `${count} comida${count !== 1 ? 's' : ''}`;
  }

  return { update, updateDate, updateFoodCount, METAS };
})();

/* ═══════════════════════════════════════════════════════════════
   4. FOOD CATALOG MODULE
   ─ Renderiza el grid de tarjetas de comida.
   ─ Maneja filtros por categoría y búsqueda de texto.
═══════════════════════════════════════════════════════════════ */

const FoodCatalog = (() => {
  let activeFilter = 'all';
  let searchTerm   = '';
  let visibleCount = 12;
  const PAGE_SIZE  = 12;

  const catLabels = {
    desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena',
    merienda: 'Merienda', 'pre-partido': 'Pre-Partido', 'post-partido': 'Post-Partido'
  };

  function getFiltered() {
    return FOOD_DB.filter(f => {
      const matchCat  = activeFilter === 'all' || f.categoria === activeFilter;
      const matchSrch = !searchTerm ||
        f.nombre.toLowerCase().includes(searchTerm) ||
        f.ingredientes.toLowerCase().includes(searchTerm) ||
        catLabels[f.categoria]?.toLowerCase().includes(searchTerm);
      return matchCat && matchSrch;
    });
  }

  function buildCard(food) {
    const catLabel = catLabels[food.categoria] || food.categoria;
    return `
      <article class="food-card" data-id="${food.id}" data-cat="${food.categoria}">
        <div class="food-card-img-wrap">
          <img src="${food.imagen}" alt="${food.nombre}" class="food-card-img" loading="lazy"/>
          <span class="food-cat-pill ${food.categoria}">${catLabel}</span>
          <div class="food-cal-badge">
            <span class="food-cal-num">${food.calorias}</span>
            <span class="food-cal-lbl">kcal</span>
          </div>
        </div>
        <div class="food-card-body">
          <h3 class="food-card-name">${food.nombre}</h3>
          <p class="food-card-ingredients">${food.ingredientes}</p>
          <div class="food-macros-row">
            <span class="macro-pill p-prot">
              <i class="fas fa-drumstick-bite"></i><strong>${food.proteinas}g</strong> prot
            </span>
            <span class="macro-pill p-carb">
              <i class="fas fa-bread-slice"></i><strong>${food.carbos}g</strong> carbos
            </span>
            <span class="macro-pill p-fat">
              <i class="fas fa-tint"></i><strong>${food.grasas}g</strong> grasas
            </span>
          </div>
        </div>
        <div class="food-card-footer">
          <button class="btn-add-food" data-id="${food.id}">
            <i class="fas fa-plus"></i> Agregar
          </button>
          <button class="btn-view-food" data-id="${food.id}" title="Ver detalle">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </article>
    `;
  }

  function render() {
    const grid = document.getElementById('foodGrid');
    if (!grid) return;

    const filtered = getFiltered();
    const visible  = filtered.slice(0, visibleCount);

    grid.innerHTML = visible.map(buildCard).join('');

    // Load more
    const lm = document.getElementById('loadMoreCenter');
    if (lm) lm.style.display = filtered.length > visibleCount ? 'block' : 'none';

    // Bind eventos de tarjetas
    grid.querySelectorAll('.btn-add-food').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const food = FOOD_DB.find(f => f.id === btn.dataset.id);
        if (food) App.addFood(food, btn);
      });
    });

    grid.querySelectorAll('.btn-view-food').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const food = FOOD_DB.find(f => f.id === btn.dataset.id);
        if (food) ModalModule.open(food);
      });
    });

    // Click en la card también abre modal
    grid.querySelectorAll('.food-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        const food = FOOD_DB.find(f => f.id === card.dataset.id);
        if (food) ModalModule.open(food);
      });
    });
  }

  function setFilter(cat) {
    activeFilter = cat;
    visibleCount = PAGE_SIZE;
    document.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
      btn.setAttribute('aria-selected', btn.dataset.cat === cat);
    });
    render();
  }

  function setSearch(term) {
    searchTerm = term.toLowerCase().trim();
    visibleCount = PAGE_SIZE;
    render();
  }

  function loadMore() {
    visibleCount += PAGE_SIZE;
    render();
  }

  return { render, setFilter, setSearch, loadMore };
})();

/* ═══════════════════════════════════════════════════════════════
   5. LOG MODULE
   ─ Muestra las comidas registradas hoy.
   ─ Persisten en localStorage → sobreviven a la recarga.
═══════════════════════════════════════════════════════════════ */

const LogModule = (() => {

  function buildLogItem(logEntry) {
    return `
      <div class="log-item" data-logid="${logEntry.logId}">
        <img src="${logEntry.imagen}" alt="${logEntry.nombre}" class="log-item-img" loading="lazy"/>
        <div class="log-item-info">
          <div class="log-item-name">${logEntry.nombre}</div>
          <div class="log-item-cat">${logEntry.categoria}</div>
          <div class="log-item-macros">
            <span class="lim-pill"><strong>${logEntry.calorias}</strong> kcal</span>
            <span class="lim-pill">P: <strong>${logEntry.proteinas}g</strong></span>
            <span class="lim-pill">C: <strong>${logEntry.carbos}g</strong></span>
          </div>
        </div>
        <span class="log-item-time">${logEntry.hora}</span>
        <button class="btn-log-delete" data-logid="${logEntry.logId}" title="Eliminar">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  }

  function render(comidas) {
    const list   = document.getElementById('todayLogList');
    const empty  = document.getElementById('logEmpty');
    if (!list) return;

    // Vaciar elementos previos excepto el empty state
    list.querySelectorAll('.log-item').forEach(el => el.remove());

    if (comidas.length === 0) {
      if (empty) empty.style.display = 'block';
    } else {
      if (empty) empty.style.display = 'none';
      comidas.forEach(entry => {
        list.insertAdjacentHTML('beforeend', buildLogItem(entry));
      });
    }

    // Bind delete
    list.querySelectorAll('.btn-log-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        App.removeFood(btn.dataset.logid);
      });
    });

    Tracker.updateFoodCount(comidas.length);
  }

  return { render };
})();

/* ═══════════════════════════════════════════════════════════════
   6. CHART MODULE
   ─ Gráfico semanal usando Chart.js.
   ─ Lee el historial REAL de localStorage para los últimos 7 días.
   ─ Usa fechas reales del sistema (sin desfase).
═══════════════════════════════════════════════════════════════ */

const ChartModule = (() => {
  let chartInstance = null;
  let activeMetric  = 'calorias';

  const METAS = { calorias: 2800, proteinas: 160, carbos: 350 };
  const COLORS = {
    calorias:  { border: '#ff6d00', bg: 'rgba(255,109,0,0.15)' },
    proteinas: { border: '#00c853', bg: 'rgba(0,200,83,0.15)'  },
    carbos:    { border: '#f5c518', bg: 'rgba(245,197,24,0.15)' }
  };

  /** Genera array de los últimos N días en formato YYYY-MM-DD */
  function lastNDays(n) {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }

  function init() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    const days    = lastNDays(7);
    const history = Storage.getHistory();

    const labels = days.map(d => {
      const date = new Date(d + 'T00:00:00');
      return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' });
    });

    const getData = (metric) => days.map(d => {
      const entry = history.find(h => h.fecha === d);
      return entry ? (entry[metric] || 0) : 0;
    });

    const data    = getData(activeMetric);
    const color   = COLORS[activeMetric];
    const metaVal = METAS[activeMetric];

    chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1),
            data,
            backgroundColor: color.bg,
            borderColor: color.border,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          },
          {
            label: 'Meta',
            data: new Array(7).fill(metaVal),
            type: 'line',
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,21,13,0.9)',
            borderColor: color.border,
            borderWidth: 1,
            titleColor: '#f0f7f0',
            bodyColor: '#8a9e8a',
            padding: 12,
            callbacks: {
              label: ctx => {
                const u = activeMetric === 'calorias' ? ' kcal' : 'g';
                return ` ${ctx.dataset.label}: ${ctx.raw}${u}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,200,83,0.06)', drawBorder: false },
            ticks: { color: '#8a9e8a', font: { family: 'DM Sans', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(0,200,83,0.06)', drawBorder: false },
            ticks: { color: '#8a9e8a', font: { family: 'DM Sans', size: 11 } },
            beginAtZero: true
          }
        }
      }
    });

    updateStats(days, history);
  }

  function switchMetric(metric) {
    if (!chartInstance) return;
    activeMetric = metric;

    const days    = lastNDays(7);
    const history = Storage.getHistory();
    const data    = days.map(d => {
      const entry = history.find(h => h.fecha === d);
      return entry ? (entry[metric] || 0) : 0;
    });
    const color   = COLORS[metric];
    const metaVal = METAS[metric];

    chartInstance.data.datasets[0].data        = data;
    chartInstance.data.datasets[0].label       = metric.charAt(0).toUpperCase() + metric.slice(1);
    chartInstance.data.datasets[0].borderColor = color.border;
    chartInstance.data.datasets[0].backgroundColor = color.bg;
    chartInstance.data.datasets[1].data        = new Array(7).fill(metaVal);
    chartInstance.options.plugins.tooltip.borderColor = color.border;
    chartInstance.update('active');

    updateStats(days, history);
  }

  function updateStats(days, history) {
    const values = days.map(d => {
      const e = history.find(h => h.fecha === d);
      return e ? (e[activeMetric] || 0) : 0;
    }).filter(v => v > 0);

    const avg  = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    const best = values.length ? Math.max(...values) : 0;
    const unit = activeMetric === 'calorias' ? ' kcal' : 'g';

    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('csAvg',  avg  ? avg  + unit : '—');
    el('csBest', best ? best + unit : '—');
    el('csDays', values.length + ' / 7 días');
  }

  function refresh() {
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    init();
  }

  return { init, switchMetric, refresh };
})();

/* ═══════════════════════════════════════════════════════════════
   7. SPORT PROTOCOL MODULE
   ─ Sección de nutrición pre/post partido y día previo.
═══════════════════════════════════════════════════════════════ */

const SportProtocol = (() => {

  const data = {
    prev: {
      items: [
        'Aumentá los carbohidratos complejos: pasta, arroz, papa',
        'Mantené la proteína normal: pollo, huevo, carne magra',
        'Hidratate extra: 2.5-3 litros de agua durante el día',
        'Evitá alimentos muy grasos o con mucha fibra',
        'Cena temprana y liviana: arroz con pollo o pasta'
      ],
      tip: 'La carga de glucógeno el día previo es clave. Tu "tanque" de energía necesita estar lleno para el partido.'
    },
    pre: {
      items: [
        '2-3 hs antes: comida completa con carbos y proteína (pasta, arroz, pollo)',
        '60-90 min antes: snack liviano (banana, tostadas, avena)',
        '30 min antes: solo hidratación, nada sólido',
        'Evitá alimentos nuevos que no hayas probado antes',
        'No entres en ayunas: baja glucosa = peor rendimiento'
      ],
      tip: 'Los carbohidratos son el combustible del fútbol. Come suficiente pero no tan pesado que te genere malestar.'
    },
    post: {
      items: [
        'Primeros 30 min: recuperación rápida con proteína + carbos simples',
        'Licuado con leche, banana, avena y maní (ideal inmediato)',
        'Comida completa 1-2 hs después: pollo + arroz + vegetales',
        'Hidratate agresivamente: perdiste 1-2L de líquido',
        'Incluí antioxidantes: frutas, vegetales de color'
      ],
      tip: 'La ventana anabólica post-partido es real. En los primeros 30 minutos tu músculo absorbe mejor los nutrientes para repararse.'
    }
  };

  function render() {
    const fill = (listId, tipId, items, tip) => {
      const list = document.getElementById(listId);
      const tipEl = document.getElementById(tipId);
      if (list) list.innerHTML = items.map(i => `<li>${i}</li>`).join('');
      if (tipEl) tipEl.textContent = tip;
    };
    fill('sportListPrev', 'sportTipPrev', data.prev.items, data.prev.tip);
    fill('sportListPre',  'sportTipPre',  data.pre.items,  data.pre.tip);
    fill('sportListPost', 'sportTipPost', data.post.items, data.post.tip);
  }

  return { render };
})();

/* ═══════════════════════════════════════════════════════════════
   8. TIPS MODULE
   ─ Consejos de nutrición deportiva con versículos.
═══════════════════════════════════════════════════════════════ */

const TipsModule = (() => {
  const tips = [
    {
      icono: 'fa-drumstick-bite',
      color: '#00c853', bg: 'rgba(0,200,83,0.1)',
      titulo: 'Proteína en Cada Comida',
      texto: 'Como futbolista necesitás 1.8-2.2g de proteína por kilo de peso. Distribuila en todas las comidas del día, no solo en una.',
      versiculo: '"¿O no saben que su cuerpo es templo del Espíritu Santo?" — 1 Cor 6:19'
    },
    {
      icono: 'fa-tint',
      color: '#2979ff', bg: 'rgba(41,121,255,0.1)',
      titulo: 'Hidratación = Rendimiento',
      texto: 'Perder solo el 2% de tu peso en sudor reduce el rendimiento deportivo un 20%. Tomá agua antes, durante y después del entrenamiento.',
      versiculo: null
    },
    {
      icono: 'fa-bread-slice',
      color: '#f5c518', bg: 'rgba(245,197,24,0.1)',
      titulo: 'Carbohidratos: tu Combustible',
      texto: 'El fútbol consume entre 1200-1600 kcal en 90 minutos. La mayor parte viene del glucógeno muscular. Nunca entrenés con tanque vacío.',
      versiculo: null
    },
    {
      icono: 'fa-clock',
      color: '#ff6d00', bg: 'rgba(255,109,0,0.1)',
      titulo: 'Timing Importa',
      texto: 'La nutrición pre y post entrenamiento es tan importante como el entrenamiento mismo. El músculo se construye con descanso y comida adecuada.',
      versiculo: '"Todo tiene su tiempo." — Eclesiastés 3:1'
    },
    {
      icono: 'fa-carrot',
      color: '#ff8f00', bg: 'rgba(255,143,0,0.1)',
      titulo: 'Vegetales Todos los Días',
      texto: 'Los micronutrientes de las verduras son esenciales para la recuperación. La vitamina C, el hierro y los antioxidantes reducen la inflamación post-partido.',
      versiculo: null
    },
    {
      icono: 'fa-moon',
      color: '#7c4dff', bg: 'rgba(124,77,255,0.1)',
      titulo: 'Alimentación Nocturna',
      texto: 'Durante el sueño se produce la mayor síntesis de proteína muscular. Una cena con proteína de calidad optimiza la recuperación nocturna.',
      versiculo: '"El da esto a sus amados, incluso mientras duermen." — Salmos 127:2'
    },
  ];

  function render() {
    const grid = document.getElementById('tipsGrid');
    if (!grid) return;
    grid.innerHTML = tips.map(t => `
      <div class="tip-card reveal">
        <div class="tip-card-icon" style="background:${t.bg}; color:${t.color};">
          <i class="fas ${t.icono}"></i>
        </div>
        <h3 class="tip-card-title">${t.titulo}</h3>
        <p class="tip-card-text">${t.texto}</p>
        ${t.versiculo ? `<em class="tip-card-verse">${t.versiculo}</em>` : ''}
      </div>
    `).join('');
  }

  return { render };
})();

/* ═══════════════════════════════════════════════════════════════
   9. HYDRATION MODULE
   ─ 8 vasos de agua, clickeables, persistidos en localStorage.
═══════════════════════════════════════════════════════════════ */

const HydrationModule = (() => {

  function render(agua) {
    const container = document.getElementById('hydGlasses');
    const counter   = document.getElementById('hydCurrent');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const div = document.createElement('div');
      div.className = `hyd-glass${i < agua ? ' filled' : ''}`;
      div.title = `Vaso ${i + 1}`;
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', `Vaso de agua ${i + 1}${i < agua ? ' tomado' : ''}`);
      div.addEventListener('click', () => App.toggleWater(i));
      container.appendChild(div);
    }

    if (counter) counter.textContent = `${agua} / 8 vasos`;
  }

  return { render };
})();

/* ═══════════════════════════════════════════════════════════════
   10. MODAL MODULE
   ─ Modal de detalle completo de una comida.
═══════════════════════════════════════════════════════════════ */

const ModalModule = (() => {
  const overlay = document.getElementById('foodModal');
  const content = document.getElementById('modalNutContent');
  const closeBtn = document.getElementById('modalCloseNut');

  function open(food) {
    if (!overlay || !content) return;
    const catLabels = {
      desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena',
      merienda: 'Merienda', 'pre-partido': 'Pre-Partido', 'post-partido': 'Post-Partido'
    };

    content.innerHTML = `
      <img src="${food.imagen}" alt="${food.nombre}" class="modal-img-nut" loading="lazy"/>
      <div class="modal-body-nut">
        <h2 class="modal-food-name">${food.nombre}</h2>
        <span class="modal-food-cat">${catLabels[food.categoria] || food.categoria}</span>
        <div class="modal-macros-grid">
          <div class="mmg-item"><span class="mmg-val">${food.calorias}</span><span class="mmg-lbl">kcal</span></div>
          <div class="mmg-item"><span class="mmg-val">${food.proteinas}g</span><span class="mmg-lbl">Proteínas</span></div>
          <div class="mmg-item"><span class="mmg-val">${food.carbos}g</span><span class="mmg-lbl">Carbos</span></div>
          <div class="mmg-item"><span class="mmg-val">${food.grasas}g</span><span class="mmg-lbl">Grasas</span></div>
        </div>
        <span class="modal-section-label"><i class="fas fa-list"></i> Ingredientes</span>
        <p class="modal-ingredients">${food.ingredientes}</p>
        <span class="modal-section-label"><i class="fas fa-utensils"></i> Preparación</span>
        <p class="modal-preparation">${food.preparacion}</p>
        <button class="modal-btn-add-main" id="modalAddBtn">
          <i class="fas fa-plus"></i> Agregar a comidas de hoy
        </button>
      </div>
    `;

    document.getElementById('modalAddBtn').addEventListener('click', () => {
      App.addFood(food);
      close();
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  return { open, close };
})();

/* ═══════════════════════════════════════════════════════════════
   11. TOAST MODULE
═══════════════════════════════════════════════════════════════ */

const ToastModule = (() => {
  const icons = { success: 'fa-check-circle', warning: 'fa-exclamation-circle', error: 'fa-times-circle', info: 'fa-info-circle' };

  function show(title, sub = '', type = 'success', duration = 3200) {
    const cont = document.getElementById('toastCont');
    if (!cont) return;
    const t = document.createElement('div');
    t.className = `toast-nut ${type}`;
    t.innerHTML = `
      <i class="fas ${icons[type]} toast-icon-nut"></i>
      <div class="toast-txt">
        <strong>${title}</strong>
        ${sub ? `<span>${sub}</span>` : ''}
      </div>
    `;
    cont.appendChild(t);
    setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, duration);
  }

  return { show };
})();

/* ═══════════════════════════════════════════════════════════════
   12. NAV MODULE
═══════════════════════════════════════════════════════════════ */

const NavModule = (() => {
  function init() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileClose');

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });
    }
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    if (mobileNav) {
      mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }));
    }

    // Hero scroll
    const heroScroll = document.getElementById('heroScroll');
    if (heroScroll) {
      heroScroll.addEventListener('click', () => {
        document.getElementById('trackerSection')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Intersection Observer reveal
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   13. CURSOR MODULE
═══════════════════════════════════════════════════════════════ */

const CursorModule = (() => {
  function init() {
    const cur  = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cur || !ring) return;
    let cx = 0, cy = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    });
    const animate = () => {
      rx += (cx - rx) * 0.1; ry += (cy - ry) * 0.1;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animate);
    };
    animate();
    document.querySelectorAll('a, button, .food-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.style.background = 'var(--dorado)';
        ring.style.width = '52px'; ring.style.height = '52px';
        ring.style.borderColor = 'var(--dorado)';
      });
      el.addEventListener('mouseleave', () => {
        cur.style.background = 'var(--verde)';
        ring.style.width = '36px'; ring.style.height = '36px';
        ring.style.borderColor = 'var(--verde)';
      });
    });
  }
  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   14. THEME MODULE
═══════════════════════════════════════════════════════════════ */

const ThemeModule = (() => {
  function init() {
    const btn  = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const saved = Storage.getTheme();
    apply(saved, icon);
    if (btn) {
      btn.addEventListener('click', () => {
        const cur  = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        apply(next, icon);
        Storage.saveTheme(next);
        ToastModule.show(next === 'light' ? '☀️ Modo claro' : '🌙 Modo oscuro', '', 'info', 1800);
      });
    }
  }
  function apply(theme, icon) {
    document.documentElement.setAttribute('data-theme', theme);
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   APP — Coordinador central
   ─ Conecta todos los módulos y maneja las acciones del usuario.
═══════════════════════════════════════════════════════════════ */

const App = {

  todayData: null,

  /** Recarga el estado completo desde localStorage y actualiza la UI */
  refresh() {
    this.todayData = Storage.getToday();
    Tracker.update(this.todayData.macros);
    LogModule.render(this.todayData.comidas);
    HydrationModule.render(this.todayData.agua);
    ChartModule.refresh();
  },

  /** Agrega una comida al registro del día */
  addFood(food, btnEl) {
    this.todayData = Storage.addFood(food);
    Tracker.update(this.todayData.macros);
    LogModule.render(this.todayData.comidas);
    HydrationModule.render(this.todayData.agua);
    ChartModule.refresh();

    // Feedback visual en el botón
    if (btnEl) {
      const orig = btnEl.innerHTML;
      btnEl.innerHTML = '<i class="fas fa-check"></i> Agregado';
      btnEl.style.background = 'linear-gradient(135deg, #007a2f, #00c853)';
      setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.background = ''; }, 1500);
    }

    ToastModule.show(
      `✅ ${food.nombre}`,
      `+${food.calorias} kcal · +${food.proteinas}g prot`,
      'success'
    );

    // Scroll suave al tracker
    document.getElementById('trackerSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  /** Elimina una comida del registro */
  removeFood(logId) {
    this.todayData = Storage.removeFood(logId);
    Tracker.update(this.todayData.macros);
    LogModule.render(this.todayData.comidas);
    ChartModule.refresh();
    ToastModule.show('Comida eliminada', '', 'warning');
  },

  /** Toggle vaso de agua */
  toggleWater(idx) {
    const agua = this.todayData.agua;
    const newAgua = idx < agua ? idx : idx + 1;
    this.todayData.agua = Math.max(0, Math.min(8, newAgua));
    Storage.saveToday(this.todayData);
    HydrationModule.render(this.todayData.agua);
    if (this.todayData.agua >= 8) {
      ToastModule.show('🎉 ¡Meta de hidratación!', '8 vasos completados hoy', 'success');
    }
  },

  /** Resetea el día actual */
  resetDay() {
    if (!confirm('¿Reiniciar el registro de hoy? Los datos de hoy se perderán.')) return;
    this.todayData = Storage.resetDay();
    Tracker.update(this.todayData.macros);
    LogModule.render(this.todayData.comidas);
    HydrationModule.render(this.todayData.agua);
    ChartModule.refresh();
    ToastModule.show('Día reiniciado', 'Empezá a registrar tus comidas', 'info');
  }
};

/* ═══════════════════════════════════════════════════════════════
   15. INIT — Punto de entrada
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🥗 El Camino — Nutrición Deportiva', 'color:#00c853;font-size:1.1rem;font-weight:bold;');
  console.log('%c"¿O no saben que su cuerpo es templo?" — 1 Cor 6:19', 'color:#f5c518;');

  // 1. Tema (primero para evitar flash)
  ThemeModule.init();

  // 2. Navegación
  NavModule.init();

  // 3. Cursor
  CursorModule.init();

  // 4. Fecha en tracker
  Tracker.updateDate();

  // 5. Cargar datos y actualizar UI
  App.todayData = Storage.getToday();
  Tracker.update(App.todayData.macros);
  LogModule.render(App.todayData.comidas);
  HydrationModule.render(App.todayData.agua);

  // 6. Catálogo de comidas
  FoodCatalog.render();

  // 7. Protocolo deportivo
  SportProtocol.render();

  // 8. Tips
  TipsModule.render();

  // 9. Gráfico (con pequeño delay para que el DOM esté listo)
  setTimeout(() => ChartModule.init(), 100);

  // 10. Bind eventos globales

  // Filtros de categoría
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => FoodCatalog.setFilter(btn.dataset.cat));
  });

  // Búsqueda
  const searchInput = document.getElementById('catalogSearch');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => FoodCatalog.setSearch(searchInput.value), 280);
    });
  }

  // Load more
  document.getElementById('btnLoadMore')?.addEventListener('click', () => FoodCatalog.loadMore());

  // Reset day
  document.getElementById('btnResetDay')?.addEventListener('click', () => App.resetDay());

  // Hidratación
  document.getElementById('btnAddWater')?.addEventListener('click', () => {
    if (App.todayData.agua >= 8) {
      ToastModule.show('Ya completaste los 8 vasos', 'Bien hidratado! ⚡', 'info');
      return;
    }
    App.todayData = Storage.addWater(App.todayData);
    HydrationModule.render(App.todayData.agua);
    if (App.todayData.agua >= 8) {
      ToastModule.show('🎉 ¡Meta de hidratación!', '8 vasos completados hoy', 'success');
    }
  });

  // Gráfico: toggle de métrica
  document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ChartModule.switchMetric(btn.dataset.metric);
    });
  });

  // Re-observar reveals después de renderizado dinámico
  setTimeout(() => {
    const obs2 = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 70);
          obs2.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs2.observe(el));
  }, 200);

  console.log('%c✓ Módulos cargados correctamente', 'color:#8a9e8a;');
});
