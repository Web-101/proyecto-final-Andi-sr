//datos que vienen de pagina anterior
const urlParams = new URLSearchParams(window.location.search);
const peliculaId = urlParams.get('id');
const horarioSeleccionado = urlParams.get('horario');
const asientosSeleccionados = urlParams.get('asientos');
const totalPagar = urlParams.get('total');
const nombreCliente = urlParams.get('nombre');


if (horarioSeleccionado) document.getElementById('compra-horario').textContent = horarioSeleccionado;
if (asientosSeleccionados) document.getElementById('compra-asientos').textContent = asientosSeleccionados;
if (totalPagar) document.getElementById('compra-total').textContent = `$${totalPagar}`;


if (nombreCliente) {
    document.getElementById('mensaje-gracias').textContent = `¡Gracias por tu compra, ${nombreCliente}!`;
}


if (peliculaId) {
    fetch(`http://localhost:3000/api/pelicula/${peliculaId}`)
        .then(respuesta => respuesta.json())
        .then(data => {
            document.getElementById('compra-pelicula').textContent = data.pelicula.titulo;
        })
        .catch(error => {
            console.error("Error al cargar la película:", error);
            document.getElementById('compra-pelicula').textContent = "Película no encontrada";
        });
} else {
    document.getElementById('compra-pelicula').textContent = "Ninguna película seleccionada";
}


const btnVolver = document.getElementById('btn-volver');
if (btnVolver) {
    btnVolver.onclick = () => {
        window.location.href = 'cartelera.html';
    };
}