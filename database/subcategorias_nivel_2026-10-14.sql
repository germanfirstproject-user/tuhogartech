-- Subcategorías como nivel propio (14-10-2026). Ya aplicado en Supabase como migración subcategorias_nivel_propio.
-- Deshacer: update subcategories s set has_page=b.has_page, h1=b.h1, intro=b.intro, seo_title=b.seo_title, seo_description=b.seo_description from subcategories_backup_20261014b b where b.id=s.id;
create table if not exists public.subcategories_backup_20261014b as select * from public.subcategories;
alter table public.subcategories_backup_20261014b enable row level security;
alter table public.subcategories add column if not exists description varchar(160), add column if not exists image_url text;
update public.subcategories x set h1=v.h1, seo_title=v.t, seo_description=v.d, intro=v.i, has_page=true, updated_at=now() from (values
('baterias-y-energia','accesorios',$q$Accesorios para estaciones de energía y paneles solares$q$,$q$Accesorios para estaciones de energía$q$,$q$Bolsas de transporte para estaciones de energía portátiles y clips para paneles solares: qué protegen, con qué modelos encajan y cuándo merecen la pena.$q$,$q$Los accesorios no dan energía, pero alargan la vida de lo que sí la da. Una estación de energía pesa entre 10 y 30 kilos y no tiene asas pensadas para cargarla en el maletero entre otras cosas; una bolsa acolchada evita golpes en las salidas y guarda los cables en el mismo sitio.

En los paneles solares fijos, los clips de drenaje dejan escapar el agua y la suciedad que se acumula en el borde inferior del marco. Antes de comprar cualquiera de estos accesorios, comprueba las medidas exactas de tu estación o el grosor del marco del panel: es lo que decide si encaja.$q$),
('escaner','escaneres-de-libros',$q$Escáneres de libros cenitales para digitalizar sin desencuadernar$q$,$q$Escáneres de libros cenitales$q$,$q$Escáneres cenitales CZUR para libros y documentos A3: cómo aplanan la curva de la página, resolución real, velocidad y para quién compensan.$q$,$q$Un escáner de libros cenital fotografía las páginas desde arriba, con el libro abierto boca arriba sobre la mesa. No hace falta aplastar el lomo contra un cristal ni desencuadernar nada, y se pasa página a página mucho más rápido que con un escáner plano.

El software corrige la curvatura de la página y borra los dedos que la sujetan. Fíjate en el tamaño máximo (A3 cubre casi cualquier libro abierto), en si incluye pedal para disparar sin tocar el aparato y en la calidad del reconocimiento de texto (OCR), que es lo que convierte el escaneo en un PDF donde se puede buscar.$q$),
('papel','papel-termico',$q$Rollos de papel térmico para TPV, datáfonos y cámaras infantiles$q$,$q$Rollos de papel térmico 80x80 y 57 mm$q$,$q$Rollos de papel térmico 80x80 y 57 mm para TPV, datáfonos e impresoras de bolsillo: medidas, cuántos metros traen, papel sin BPA y cuánto dura la tinta.$q$,$q$El papel térmico no lleva tinta: la impresora calienta el papel y este se oscurece. Por eso solo vale el rollo con la medida exacta de tu aparato. El 80x80 es el de las impresoras de tiques de comercio y hostelería; el de 57 mm, el de los datáfonos y muchas impresoras portátiles.

El primer número es el ancho del rollo y el segundo el diámetro exterior, que da una idea de cuántos metros trae. Para documentos que haya que guardar, busca papel sin BPA y con más años de conservación garantizados: los tiques baratos se borran al sol o con el calor en pocos meses.$q$),
('papel','papel-fotografico',$q$Papel fotográfico Kodak para imprimir en casa$q$,$q$Papel fotográfico Kodak 10x15 y Zink$q$,$q$Papel fotográfico Kodak 10x15 para impresoras de inyección y papel Zink adhesivo 2x3 para impresoras de bolsillo: con qué aparatos funciona cada uno.$q$,$q$No todo el papel fotográfico sirve para cualquier impresora. El de 10x15 cm es el formato de la foto de toda la vida y se usa en impresoras de inyección de tinta normales. El papel Zink, en cambio, lleva los colores dentro y solo funciona en impresoras y cámaras que usan esa tecnología, sin cartuchos.

Comprueba siempre la compatibilidad exacta con tu modelo, el acabado (brillo o mate) y si el reverso es adhesivo, algo práctico para pegar las fotos en una libreta o en la nevera.$q$),
('plotters','plotters-de-impresion',$q$Plotters de impresión A1 de 24 pulgadas$q$,$q$Plotters A1 de 24 pulgadas HP y Epson$q$,$q$Plotters HP DesignJet y Epson SureColor de 24 pulgadas para planos y carteles A1: velocidad por plano, conexión WiFi, coste de tinta y para quién son.$q$,$q$Un plotter de impresión es una impresora de gran formato que trabaja con rollos de papel. Los de 24 pulgadas (unos 61 cm) imprimen planos y carteles en A1, que es lo que necesitan estudios de arquitectura, ingenierías, copisterías y profesores.

Mira cuánto tarda en sacar un plano A1, si imprime también en hojas sueltas además de rollo, si tiene WiFi para mandar trabajos desde el móvil y, sobre todo, el precio de los cartuchos: en un plotter el gasto de tinta pesa más que el del aparato.$q$),
('plotters','plotters-de-corte',$q$Plotters de corte para vinilo, papel y tela$q$,$q$Plotters de corte para vinilo y tela$q$,$q$Plotters de corte como el Brother ScanNCut para vinilo, cartulina y tela: tamaño de corte, si escanea dibujos y qué materiales admite.$q$,$q$Un plotter de corte no imprime: corta con una cuchilla las formas que le mandas. Sirve para hacer vinilos, pegatinas, tarjetas, patrones de costura y manualidades de todo tipo.

Algunos, como el Brother ScanNCut, llevan escáner incorporado y recortan directamente un dibujo hecho a mano sin pasar por el ordenador. Antes de elegir, mira el ancho máximo de corte, qué materiales admite (vinilo, cartulina, tela, goma eva) y si el programa de diseño es gratuito o de suscripción.$q$),
('streaming','reproductores-multimedia',$q$Reproductores multimedia Fire TV Stick para la tele$q$,$q$Fire TV Stick 4K y HD: reproductores$q$,$q$Fire TV Stick 4K Plus y Fire TV Stick HD comparados: resolución, WiFi 6, mando con Alexa y cuál conviene según tu tele.$q$,$q$Un reproductor multimedia como el Fire TV Stick se enchufa al HDMI de la tele y le añade Netflix, Prime Video, Disney+, YouTube y el resto de aplicaciones, aunque la tele no sea inteligente o se haya quedado sin actualizaciones.

La elección depende de la tele: si es 4K, el 4K Plus aprovecha la resolución y el HDR, y su WiFi 6 aguanta mejor el streaming en alta calidad. Si es Full HD, el modelo HD hace lo mismo por menos dinero. Los dos traen mando por voz con Alexa.$q$),
('seguridad-inteligente','cerraduras-y-mirillas',$q$Cerraduras inteligentes y mirillas digitales$q$,$q$Cerraduras inteligentes y mirillas digitales$q$,$q$Cerraduras inteligentes con Matter como Nuki y mirillas digitales WiFi con pantalla: instalación sin obra, apertura desde el móvil y qué pasa sin batería.$q$,$q$La puerta de casa es donde la domótica tiene que ser más fiable. Una cerradura inteligente como Nuki se monta por dentro sobre el cilindro que ya tienes y abre con el móvil, con la voz o al llegar a casa, sin cambiar la llave de siempre.

Una mirilla digital sustituye la mirilla óptica por una cámara con pantalla y avisa en el móvil cuando alguien llama. En ambas, comprueba la compatibilidad con tu puerta, cuánto dura la batería y qué ocurre cuando se agota: la llave física debe seguir funcionando.$q$),
('sistemas-de-alimentacion','sai',$q$SAI para ordenador y router: sistemas de alimentación ininterrumpida$q$,$q$SAI para ordenador, router y NAS$q$,$q$SAI de 650 a 1.300 VA para ordenador, router y NAS: autonomía real, cuántos enchufes protegidos tiene y cómo apaga el equipo solo si se va la luz.$q$,$q$Un SAI es una batería que se coloca entre el enchufe y el ordenador. Cuando se va la luz, sigue dando corriente unos minutos para que guardes el trabajo y apagues con calma, y filtra los picos de tensión que pueden estropear una fuente de alimentación o un NAS.

La potencia en VA dice cuántos aparatos aguanta, no cuánto tiempo. Para un ordenador de oficina y el router basta con 650 a 800 VA; para un PC potente con monitor, mejor 1.000 VA o más. Mira también cuántos enchufes van protegidos por batería y si trae USB para que el equipo se apague solo.$q$),
('sistemas-de-alimentacion','estabilizadores-de-tension',$q$Estabilizadores de tensión para proteger tus aparatos$q$,$q$Estabilizadores de tensión para casa$q$,$q$Estabilizadores de tensión para casas con subidas y bajadas de luz: qué hacen, en qué se diferencian de un SAI y qué potencia necesitas.$q$,$q$Un estabilizador de tensión corrige la electricidad cuando llega por encima o por debajo de lo normal, algo habitual en casas de campo, al final de una línea o en edificios antiguos. Protege neveras, calderas y equipos electrónicos de las bajadas que los obligan a trabajar forzados.

A diferencia de un SAI, no lleva batería: si se corta la luz, se corta. Elige la potencia en VA con margen sobre la suma de los aparatos que vas a conectar.$q$),
('sistemas-de-sonido','receptores-av',$q$Receptores AV 7.2 con Dolby Atmos para cine en casa$q$,$q$Receptores AV 7.2 con Dolby Atmos$q$,$q$Receptores AV Denon y Marantz 7.2 con Dolby Atmos y HDMI 8K: canales, potencia, calibración de sala y cuál encaja con tus altavoces.$q$,$q$Un receptor AV es el centro de un cine en casa: recibe la imagen y el sonido de la consola, el reproductor o el Fire TV, manda la imagen a la tele y reparte el sonido entre todos los altavoces de la sala.

Los modelos 7.2 permiten montar un 5.1.2 con altavoces de techo para Dolby Atmos. Fíjate en cuántas entradas HDMI 2.1 tiene (las que pasan 4K a 120 Hz para consolas), en el sistema de calibración que ajusta el sonido a tu habitación y en la potencia real por canal con todos funcionando a la vez.$q$),
('sistemas-de-sonido','amplificadores-estereo',$q$Amplificadores estéreo HiFi para altavoces de estantería$q$,$q$Amplificadores estéreo HiFi$q$,$q$Amplificadores estéreo HiFi como el Yamaha A-S301 para música: potencia, entradas ópticas y de tocadiscos, y cómo elegir según tus altavoces.$q$,$q$Un amplificador estéreo es la pieza clave de un equipo para escuchar música con dos altavoces. A diferencia de un receptor AV, no se ocupa de la imagen ni del sonido envolvente: lo pone todo en sonar bien en estéreo.

Mira la potencia por canal según la impedancia de tus altavoces, si tiene entrada de fono para conectar un tocadiscos sin previo y si incluye entrada óptica o coaxial para la tele.$q$),
('smart-home','robots-aspiradores',$q$Robots aspiradores y friegasuelos con autovaciado$q$,$q$Robots aspiradores con autovaciado$q$,$q$Robots aspiradores y friegasuelos Roborock y Tapo con autovaciado: potencia de succión, mapas, cómo friegan y qué mantenimiento piden.$q$,$q$Un robot aspirador limpia el suelo solo mientras estás fuera. Los de ahora mapean la casa con láser, se manejan desde el móvil y muchos también friegan. La base de autovaciado vacía el depósito del robot en una bolsa grande, así que no tienes que tocarlo en semanas.

La succión en Pa es lo más anunciado, pero importa más cómo esquiva cables y obstáculos, si levanta las mopas al pasar por alfombras y si la base lava y seca las mopas sola.$q$),
('smart-home','persianas-inteligentes',$q$Motores para persianas inteligentes$q$,$q$Motores para persianas inteligentes$q$,$q$Motores para persianas inteligentes como el RolloTron: instalación sobre la cinta, horarios, control por voz y compatibilidad con Alexa y Google.$q$,$q$Motorizar las persianas permite subirlas y bajarlas con el móvil, con la voz o a horas fijas, sin cambiar la persiana. Los motores de cinta como el RolloTron se colocan en el hueco del recogedor de la pared y tiran de la cinta de siempre.

Comprueba el ancho de la cinta y el peso que puede levantar, si necesita un puente para conectarse a internet y con qué asistentes funciona.$q$),
('smart-home','difusores-de-aroma',$q$Difusores de aroma inteligentes$q$,$q$Difusores de aroma con altavoz y luz$q$,$q$Difusores de aroma con altavoz Bluetooth y luz: capacidad del depósito, horas de uso, ruido y si se programan desde el móvil.$q$,$q$Un difusor de aroma reparte en la habitación una niebla fría de agua con unas gotas de aceite esencial. Algunos suman luz ambiental de colores o un altavoz Bluetooth, así que también hacen de lámpara de mesilla.

Fíjate en la capacidad del depósito, que marca cuántas horas funciona seguidas, en el ruido y en si se apaga solo cuando se queda sin agua.$q$)
) as v(cat,slug,h1,t,d,i), public.categories c where c.slug=v.cat and x.category_id=c.id and x.slug=v.slug;
update public.subcategories x set description=v.d, updated_at=now() from (values
('baterias-y-energia','estaciones-de-energia',$q$Baterías con enchufes de 230 V para acampar, trabajar fuera o aguantar un apagón.$q$),
('baterias-y-energia','power-banks',$q$Baterías de bolsillo para cargar el móvil, la tableta o el portátil por USB-C.$q$),
('baterias-y-energia','paneles-solares',$q$Paneles plegables y fijos para recargar tu estación de energía con el sol.$q$),
('baterias-y-energia','accesorios',$q$Bolsas de transporte y clips para cuidar estaciones y paneles solares.$q$),
('cultivo-inteligente','huertos-hidroponicos',$q$Huertos de interior sin tierra que riegan e iluminan las plantas solos.$q$),
('cultivo-inteligente','lamparas-de-cultivo',$q$Luces LED de espectro completo para que las plantas crezcan dentro de casa.$q$),
('cultivo-inteligente','riego-automatico',$q$Sistemas que riegan tus macetas o el jardín a su hora, aunque estés fuera.$q$),
('impresoras-de-etiquetas','etiquetadoras-bluetooth',$q$Etiquetadoras pequeñas que imprimen desde el móvil para ordenar la casa.$q$),
('impresoras-de-etiquetas','rotuladoras',$q$Rotuladoras con teclado para etiquetar cables, carpetas y cuadros eléctricos.$q$),
('impresoras-de-etiquetas','etiquetas-de-envio',$q$Impresoras térmicas de etiquetas 4x6 para envíos de Amazon, Vinted o Shopify.$q$),
('impresoras-de-etiquetas','etiquetas-de-sobremesa',$q$Impresoras de etiquetas para oficina y almacén, con más velocidad y rollos más grandes.$q$),
('escaner','escaneres-portatiles',$q$Escáneres de mano y de alimentador para documentos, facturas y recibos.$q$),
('escaner','escaneres-de-documentos',$q$Escáneres planos y con alimentador para digitalizar papeles en casa o la oficina.$q$),
('escaner','escaneres-de-fotos-y-negativos',$q$Escáneres de película y planos con luz para fotos, negativos y diapositivas.$q$),
('escaner','escaneres-de-libros',$q$Escáneres cenitales que digitalizan libros abiertos sin aplastar el lomo.$q$),
('papel','papel-termico',$q$Rollos térmicos 80x80 y 57 mm para TPV, datáfonos y cámaras infantiles.$q$),
('papel','papel-fotografico',$q$Papel Kodak 10x15 para inyección y papel Zink adhesivo para impresoras de bolsillo.$q$),
('plotters','plotters-de-impresion',$q$Plotters de 24 pulgadas para imprimir planos y carteles en A1.$q$),
('plotters','plotters-de-corte',$q$Máquinas que cortan vinilo, cartulina y tela con la forma que les mandes.$q$),
('impresoras-portatiles','impresoras-de-fotos',$q$Impresoras de bolsillo que sacan fotos en papel directamente desde el móvil.$q$),
('impresoras-portatiles','impresoras-termicas',$q$Impresoras térmicas sin tinta para notas, listas y documentos A4 en movimiento.$q$),
('almacenamiento','nas',$q$Servidores para casa que guardan fotos, copias y películas de toda la familia.$q$),
('almacenamiento','discos-para-nas',$q$Discos duros CMR pensados para funcionar las 24 horas dentro de un NAS.$q$),
('almacenamiento','discos-duros-externos',$q$Discos USB para copias de seguridad y para llevar archivos de un lado a otro.$q$),
('almacenamiento','ssd',$q$Unidades SSD SATA y NVMe para que el ordenador arranque en segundos.$q$),
('proyectores','proyectores-4k',$q$Proyectores 4K para montar un cine en el salón con imagen de verdad.$q$),
('proyectores','proyectores-full-hd',$q$Proyectores 1080p con buena relación entre brillo, imagen y precio.$q$),
('proyectores','mini-proyectores',$q$Proyectores pequeños y portátiles para el dormitorio, viajes o el jardín.$q$),
('proyectores','pantallas-de-proyeccion',$q$Pantallas de trípode, pared y suelo para proyectar sobre algo mejor que la pared.$q$),
('streaming','webcams',$q$Webcams 1080p y 4K que se ven bien con la luz de una habitación normal.$q$),
('streaming','microfonos',$q$Micrófonos USB, dinámicos y de solapa para directos, pódcast y vídeos.$q$),
('streaming','capturadoras',$q$Capturadoras HDMI para grabar y emitir la consola o una cámara en el PC.$q$),
('streaming','reproductores-multimedia',$q$Fire TV Stick para añadir Netflix, Prime Video y más a cualquier tele.$q$),
('seguridad-inteligente','sensores-y-alarmas',$q$Kits de alarma, sensores de puerta y detectores que avisan en el móvil.$q$),
('seguridad-inteligente','camaras-de-vigilancia',$q$Cámaras WiFi de interior y exterior con visión nocturna y avisos.$q$),
('seguridad-inteligente','cerraduras-y-mirillas',$q$Cerraduras que abren con el móvil y mirillas digitales con cámara.$q$),
('conectividad-docking','hubs-usb-c',$q$Hubs y docks USB-C para conectar monitores, red y periféricos al portátil.$q$),
('conectividad-docking','hdmi-inalambrico',$q$Transmisores HDMI sin cables para llevar la imagen a la tele o al proyector.$q$),
('realidad-virtual','gafas-vr',$q$Gafas de realidad virtual autónomas y para PC, comparadas por imagen y juegos.$q$),
('realidad-virtual','accesorios-vr',$q$Correas, fundas y accesorios para usar las gafas VR más cómodo y más tiempo.$q$),
('sistemas-de-alimentacion','sai',$q$Baterías que mantienen encendidos el ordenador y el router si se va la luz.$q$),
('sistemas-de-alimentacion','estabilizadores-de-tension',$q$Equipos que corrigen las subidas y bajadas de tensión de la red eléctrica.$q$),
('sistemas-de-sonido','receptores-av',$q$Receptores 7.2 con Dolby Atmos para el centro de un cine en casa.$q$),
('sistemas-de-sonido','amplificadores-estereo',$q$Amplificadores HiFi para escuchar música con dos buenos altavoces.$q$),
('smart-home','iluminacion-inteligente',$q$Bombillas, tiras LED y lámparas que se controlan con la voz o el móvil.$q$),
('smart-home','termostatos-inteligentes',$q$Termostatos y cabezales que ajustan la calefacción y ahorran en la factura.$q$),
('smart-home','enchufes-inteligentes',$q$Enchufes WiFi y Matter para programar y apagar aparatos a distancia.$q$),
('smart-home','asistentes-de-voz',$q$Altavoces con Alexa, hubs y mandos para controlar toda la domótica.$q$),
('smart-home','robots-aspiradores',$q$Robots que aspiran y friegan solos, con base de autovaciado.$q$),
('smart-home','persianas-inteligentes',$q$Motores que suben y bajan las persianas con horarios o con la voz.$q$),
('smart-home','difusores-de-aroma',$q$Difusores de aroma con luz y altavoz que se programan desde el móvil.$q$)
) as v(cat,slug,d), public.categories c where c.slug=v.cat and x.category_id=c.id and x.slug=v.slug;
