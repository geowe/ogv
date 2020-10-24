# OGV

<p align="center">
  <img src="https://github.com/geowe/ogv/blob/master/screenshot.png">
</p>

**Open Geodata Viewer** es un proyecto Open-Source basado en la librería **[OpenLayers](https://openlayers.org/)**, desarrollado por la iniciativa **[GeoWE](https://www.geowe.org/)** con el objetivo de ofrecer un visor de mapas libre y online. Para obtener más información, están disponibles los siguientes enlaces:

-   [Web del proyecto](http://ogv.geowe.org/)
-   [Visor en vivo](https://geowe.org/ogv/viewer/?add-layer)
-   [Guía de uso](http://ogv.geowe.org/doc/)
-   [Utilidad para configurar tu propio visor](http://ogv.geowe.org/url-builder/)

## Requerimientos

Para comenzar a desarrollar sobre el proyecto, necesitará tener Node.js instalado en su entorno. Para **ogv** se han utilizado las siguientes versiones:

    $ node --version
    v10.16.3

    $ npm --version
    6.9.0

## Instalación

Como punto de partida es necesario realizar un clonado del proyecto. Una vez disponible el código fuente en local, habrá que instalar las dependencias requeridas del proyecto, para lo cual basta con ejecutar el siguiente comando:

    npm install

## Entorno de desarrollo

Para realizar las pruebas pertinentes del software hay que arrancar el servidor de desarrollo de Node.js, ejecutando la siguiente instrucción:

    npm start

Una vez iniciado el entorno de desarrollo, se podrá acceder al mismo mediante el navegador en la siguiente dirección:

    http://127.0.0.1:9000

## Análisis estático de código

Con objeto de llevar a cabo un control de calidad del código del proyecto, así como detectar posibles errores y vulnerabilidades, se ejecutará el siguiente comando:

    npm run lint:fix

Para obtener un informe más detallado de los errores encontrados, se deberá ejecutar la siguiente línea:

    npm run lint:report

Como resultado se generará un fichero llamado **lint-report.html** en la raíz del proyecto.

## Puesta en producción

Si se desea realizar el despliegue de una instancia propia de OGV, será necesario construir el software mediante el siguiente comando:

    npm run build

Como resultado se creará una carpeta con el nombre **dist** que contiene todos los ficheros necesarios para realizar la puesta en producción.

## Características principales

-   Mapas personalizables desde URL.
-   Soporte de diferentes capas raster de referencia.
-   Carga de conjuntos de datos tanto por URL como por fichero local.
-   Zoom del mapa personalizado durante la carga.
-   Personalización de la estrategia de carga de elementos.
-   Estilos de visualización: paleta de colores, transparencia, etiquetado.
-   Compartir mapa vía URL.
-   Widget de mapa para embeber tus mapas en cualquier web.
-   Diferentes opciones de título de mapa.
-   Soporte de estilos **SLD**.
-   Mapas de agrupados (**cluster**).
-   Mapas de calor (**heatmap**).
-   Mapas **temáticos/coropléticos**.
-   Leyenda de mapa, tanto vertical como horizontal, con personalización en función del tipo de mapa.
-   Información y herramientas adicionales del mapa a través de la leyenda.
-   Vista de mapa general (overview) con tamaño configurable.
-   Vista de mapa a pantalla completa (fullscreen).
-   Mapas con renderizado de imágenes.
-   Visualización y descarga del código QR del mapa.
-   Descarga del mapa en formato PNG y JPG.

## Ejemplos de uso

El **[repositorio de Open Data de GeoWE](http://repo.geowe.org/es)** ofrece algunos mapas de muestra, generados mediante URL (usando el Widget de mapa para embeber en la web) a través de OGV.
