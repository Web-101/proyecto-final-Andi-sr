
const urlParams = new URLSearchParams(window.location.search);
const peliculaId = urlParams.get('id');

// Variable maestra para guardar la hora que elija el usuario
let horarioSeleccionado = null;

if (peliculaId) {
    fetch(`http://localhost:3000/api/pelicula/${peliculaId}`)
        .then(respuesta => respuesta.json())
        .then(data => {
            const pelicula = data.pelicula;
            if (!pelicula) throw new Error("Datos no encontrados");

            //Datos de la película encontrda
            const portada = document.getElementById('portada-img');
            if (portada) portada.src = pelicula.poster;
            
            const clasificacion = document.getElementById('clasificacion-texto');
            if (clasificacion) clasificacion.textContent = pelicula.clasificacion || 'ATP';
            
            const duracion = document.getElementById('duracion-texto');
            if (duracion) duracion.textContent = pelicula.duracion;
            
            const titulo = document.getElementById('titulo-pelicula');
            if (titulo) titulo.textContent = pelicula.titulo.toUpperCase();
            
            const sinopsis = document.getElementById('sinopsis-texto');
            if (sinopsis) sinopsis.textContent = pelicula.sinopsis;

           
            const contenedorGeneros = document.getElementById('contenedor-generos');
            if (contenedorGeneros) {
                contenedorGeneros.innerHTML = '';
                if (pelicula.genero) {
                    pelicula.genero.forEach(gen => {
                        contenedorGeneros.innerHTML += `<p>${gen}</p>`;
                    });
                }
            }

            
            const contenedorHorarios = document.getElementById('contenedor-horarios');
            if (contenedorHorarios) {
                contenedorHorarios.innerHTML = '';
                if (pelicula.funciones) {
                    pelicula.funciones.forEach(hora => {
                        
                        
                        const btn = document.createElement('button');
                        btn.className = 'btn-horario';
                        btn.textContent = hora;
                        
                        
                        btn.onclick = () => {
                            
                            const todosLosBotones = contenedorHorarios.querySelectorAll('.btn-horario');
                            todosLosBotones.forEach(b => {
                                b.style.backgroundColor = ''; 
                                b.style.color = '';
                            });
                            
                            btn.style.backgroundColor = '#9e4f8b';
                            btn.style.color = 'white';
                            horarioSeleccionado = hora;
                        };
                        
                        contenedorHorarios.appendChild(btn);
                    });
                }
            }

            
            const btnReserva = document.getElementById('btn-reserva');
            if (btnReserva) {
                btnReserva.onclick = () => {
                    
                    if (!horarioSeleccionado) {
                        alert("¡Por favor, selecciona un horario antes de continuar!");
                        return; 
                    }
                    window.location.href = `asientos.html?id=${pelicula.id}&horario=${horarioSeleccionado}`;
                };
            }
        })
        .catch(error => {
            console.error("Error al cargar los detalles:", error);
            const titulo = document.getElementById('titulo-pelicula');
            if (titulo) titulo.textContent = "Película no encontrada";
        });
} else {
    const titulo = document.getElementById('titulo-pelicula');
    if (titulo) titulo.textContent = "Ninguna película seleccionada";
}