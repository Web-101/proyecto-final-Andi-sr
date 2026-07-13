// Cargar la cartelera desde el servidor
fetch('http://localhost:3000/api/cartelera')
    .then(respuesta => respuesta.json())
    .then(data => {
        const peliculas = data.peliculas; //lista de peliculas desde el servidor

        // Mostrar el estreno en la sección correspondiente
        if (peliculas.length > 0) {
            const estreno = peliculas[0];
            const contenedorEstreno = document.getElementById('contenedor-estrenos');
            const generoPrincipal = estreno.genero ? estreno.genero[0] : 'Cine';

            contenedorEstreno.innerHTML = `
                <figure class="portada">
                    <img src="${estreno.poster}" alt="${estreno.titulo}">
                </figure>
                <div class="informacion">
                    <span>${generoPrincipal}</span>
                    <h3>${estreno.titulo}</h3>
                </div>
                <button class="btn-comprar" 
                onclick="window.location.href='detalle-pelicula.html?id=${estreno.id}'">
                    Comprar
                </button>
            `;
        }

        // Mostrar el resto de las películas en la cartelera
        const contenedorCartelera = document.getElementById('contenedor-cartelera');
        contenedorCartelera.innerHTML = '';

        peliculas.slice(1).forEach(pelicula => {
            const generos = pelicula.genero ? pelicula.genero.join(' • ') : 'Género';

            let horariosHTML = '';
            if (pelicula.funciones && pelicula.funciones.length > 0) {
                pelicula.funciones.forEach(hora => {
                    horariosHTML += `<span class="btn-horario">${hora}</span>`;
                });
            }

            const tarjetaHTML = `
                <a href="detalle-pelicula.html?id=${pelicula.id}" class="tarjeta-pelicula">
                    <figure class="pelicula-portada">
                        <img src="${pelicula.poster}" alt="${pelicula.titulo}">
                    </figure>

                    <div class="informacion-cartelera">
                        <div class="titulo">
                            <h3>${pelicula.titulo}</h3>
                            <p>${generos} • ${pelicula.duracion}</p>
                        </div>
                        <div class="horario">
                            ${horariosHTML}
                        </div>
                    </div>
                </a>
            `;

            contenedorCartelera.innerHTML += tarjetaHTML;
        });
    })
    .catch(error => console.error("Error al cargar la cartelera:", error));