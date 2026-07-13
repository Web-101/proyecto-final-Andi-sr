const urlParams = new URLSearchParams(window.location.search);
const peliculaId = urlParams.get('id');
const horarioSeleccionado = urlParams.get('horario');


const precioPorEntrada = 30.00; // Precio fijo por entrada
let asientosElegidos = [];
let asientosOcupados = [];


const textoAsientos = document.getElementById('asientos-resumen');
const textoPrecio = document.getElementById('precio-resumen');
const btnContinuar = document.getElementById('btn-continuar');

// Función para actualizar el resumen de asientos y precio
function actualizarResumen() {
    if (asientosElegidos.length === 0) {
        textoAsientos.textContent = "Ninguno";
        textoPrecio.textContent = "BS 0.00";
    } else {
        textoAsientos.textContent = asientosElegidos.join(', ');
        const total = (asientosElegidos.length * precioPorEntrada).toFixed(2);
        textoPrecio.textContent = `BS ${total}`;
    }
}


if (peliculaId && horarioSeleccionado) {
    
    // Fetch de la información de la película y los asientos ocupados
    Promise.all([
        fetch(`http://localhost:3000/api/pelicula/${peliculaId}`).then(res => res.json()),
        fetch(`http://localhost:3000/api/funcion/${peliculaId}/${horarioSeleccionado}`).then(res => res.json())
    ])
    .then(([dataPelicula, dataAsientos]) => {
        const pelicula = dataPelicula.pelicula;
        asientosOcupados = dataAsientos.asientosOcupados || []; // Viene del servidor aleatoriamente

        
        document.getElementById('portada-resumen').src = pelicula.poster;
        document.getElementById('nombre-resumen').textContent = pelicula.titulo;
        document.getElementById('fecha-resumen').textContent = `Hoy, ${horarioSeleccionado}`;

        
        const contenedor = document.getElementById('contenedor-asientos');
        const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // Crear los asientos dinámicamente
        filas.forEach(letraFila => {
            const divFila = document.createElement('div');  // Contenedor de la fila
            divFila.className = 'fila';

            for (let numAsiento = 1; numAsiento <= 8; numAsiento++) {
                const codigoAsiento = `${letraFila}${numAsiento}`; // Ej: "A1", "F5"
                
                const btnAsiento = document.createElement('button');
                btnAsiento.className = 'asiento';
                
                // Marcar el asiento como ocupado si está en la lista de asientos ocupados
                if (asientosOcupados.includes(codigoAsiento)) {
                    btnAsiento.classList.add('ocupado');
                    
                    // si esta libre puede seleccionarse
                } else {
                    btnAsiento.onclick = () => {
                        if (btnAsiento.classList.contains('seleccionado')) {
                            btnAsiento.classList.remove('seleccionado');
                            asientosElegidos = asientosElegidos.filter(a => a !== codigoAsiento);
                        } 
                        else {
                            btnAsiento.classList.add('seleccionado');
                            asientosElegidos.push(codigoAsiento);
                        }
                        
                        actualizarResumen(); 
                    };
                }

                divFila.appendChild(btnAsiento);

                //cada 4 asientos, agregar un espacio para el pasillo
                if (numAsiento === 4) {
                    const pasillo = document.createElement('div');
                    pasillo.className = 'pasillo';
                    divFila.appendChild(pasillo);
                }
            }

            contenedor.appendChild(divFila);
        });

        
        btnContinuar.onclick = () => {
            if (asientosElegidos.length === 0) {
                alert("Por favor, selecciona al menos un asiento.");
                return;
            }
            
            
            const asientosParams = asientosElegidos.join(',');
            const total = (asientosElegidos.length * precioPorEntrada).toFixed(2);
            
    
            window.location.href = `compra.html?id=${pelicula.id}&horario=${horarioSeleccionado}&asientos=${asientosParams}&total=${total}`;
        };
    })
    .catch(error => {
        console.error("Error al cargar la sala:", error);
        document.getElementById('nombre-resumen').textContent = "Error de conexión";
    });
} else {
    document.getElementById('nombre-resumen').textContent = "Película no seleccionada";
}