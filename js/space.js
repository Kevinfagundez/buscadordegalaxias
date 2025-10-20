// Obtener referencias a los elementos del DOM
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('contenedor');

// Función para buscar imágenes
async function buscarImagenes() {
    const query = inputBuscar.value.trim();
    
    // Validar que el usuario haya ingresado algo
    if (query === '') {
        mostrarMensaje('Por favor, ingresa un término de búsqueda', 'warning');
        return;
    }
    
    // Mostrar mensaje de carga
    contenedor.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    try {
        // Realizar la petición a la API
        const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error en la petición');
        }
        
        const data = await response.json();
        
        // Desestructurar los datos
        const { collection } = data;
        const { items } = collection;
        
        // Verificar si hay resultados
        if (items.length === 0) {
            mostrarMensaje('No se encontraron resultados para tu búsqueda', 'info');
            return;
        }
        
        // Mostrar los resultados
        mostrarResultados(items);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Ocurrió un error al buscar las imágenes. Intenta nuevamente.', 'danger');
    }
}

// Función para mostrar los resultados en tarjetas
function mostrarResultados(items) {
    contenedor.innerHTML = '';
    
    // Crear un row de Bootstrap
    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3';
    
    // Iterar sobre los items y crear tarjetas
    items.forEach(item => {
        // Desestructurar los datos del item
        const { data, links } = item;
        
        // Verificar que existan datos y links
        if (!data || !data[0] || !links || !links[0]) {
            return;
        }
        
        // Desestructurar la información principal
        const { title, description, date_created } = data[0];
        const { href: imageUrl } = links[0];
        
        // Crear la columna
        const col = document.createElement('div');
        col.className = 'col';
        
        // Crear la tarjeta
        const card = `
            <div class="card shadow-sm h-100">
                <img src="${imageUrl}" class="card-img-top" alt="${title || 'Imagen NASA'}" style="height: 225px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${title || 'Sin título'}</h5>
                    <p class="card-text flex-grow-1">${description ? (description.length > 150 ? description.substring(0, 150) + '...' : description) : 'Sin descripción disponible'}</p>
                    <p class="card-text"><small class="text-muted">Fecha: ${date_created ? new Date(date_created).toLocaleDateString('es-ES') : 'No disponible'}</small></p>
                </div>
            </div>
        `;
        
        col.innerHTML = card;
        row.appendChild(col);
    });
    
    contenedor.appendChild(row);
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Event listeners
btnBuscar.addEventListener('click', buscarImagenes);

// Permitir buscar con Enter
inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarImagenes();
    }
});