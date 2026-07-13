//datos que vienen de pagina anterior
const urlParams = new URLSearchParams(window.location.search);
const peliculaId = urlParams.get('id');
const horarioSeleccionado = urlParams.get('horario');
const asientosSeleccionados = urlParams.get('asientos');
const totalPagar = urlParams.get('total');

// Mostrar los datos en la página de compra que se obtuvieron de la página de asientos
if (horarioSeleccionado) document.getElementById('compra-horario').textContent = `Hoy, ${horarioSeleccionado}`;
if (asientosSeleccionados) document.getElementById('compra-asientos').textContent = asientosSeleccionados;
if (totalPagar) document.getElementById('compra-total').textContent = `BS ${totalPagar}`;


// obtener el id para trer los datos de la pelicula y mostrarlos en la pagina de compra
if (peliculaId) {
    fetch(`http://localhost:3000/api/pelicula/${peliculaId}`)
        .then(respuesta => respuesta.json())
        .then(data => {
            const pelicula = data.pelicula;
            document.getElementById('compra-titulo').textContent = pelicula.titulo;
            document.getElementById('compra-poster').src = pelicula.poster;
        })
        .catch(error => console.error("Error al cargar la película:", error));
} else {
    document.getElementById('compra-titulo').textContent = "Película no encontrada";
}

// formulario de compra
const formulario = document.getElementById('formulario-compra');

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();   
    const nombreCliente = document.getElementById('nombre').value;
    window.location.href = `comprobante-entrada.html?id=${peliculaId}&horario=${horarioSeleccionado}&asientos=${asientosSeleccionados}&total=${totalPagar}&nombre=${encodeURIComponent(nombreCliente)}`;
});