// Crear el mapa
const map = L.map('map', {
    crs: L.CRS.Simple, // Sistema de coordenadas para imágenes
    minZoom: -1, // Permite alejarnos del zoom inicial
    maxZoom: 1, // Límite del zoom
});

// Tamaño del plano en píxeles
const imageWidth = 1600; // Ancho de la imagen en píxeles
const imageHeight = 1200; // Alto de la imagen en píxeles

// Configurar límites del mapa basados en el tamaño de la imagen
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Cargar el plano como capa raster
const imageUrl = 'plano-loteo.jpg'; // Cambia a la URL de tu imagen
L.imageOverlay(imageUrl, bounds).addTo(map);

// Ajustar la vista al plano completo
map.fitBounds(bounds);

// Función para determinar el color según el estado
function getColor(estado) {
    return estado === 'disponible' ? 'green' : 'red';
}

// Cargar los datos desde lotes.json
fetch('lotes.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        return response.json();
    })
    .then(lotes => {
        // Dibujar los lotes
        lotes.forEach(lote => {
            const polygon = L.polygon(lote.coords, {
                color: getColor(lote.estado), // Color del borde
                fillColor: getColor(lote.estado), // Color del relleno
                fillOpacity: 0.5, // Transparencia
            }).addTo(map);

            // Crear el contenido del tooltip
            const tooltipContent = `
                <strong>Manzana ${lote.manzana} - Lote ${lote.numero}</strong><br>
                ${lote.detalles}
            `;
            polygon.bindTooltip(tooltipContent, { permanent: false });
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));
