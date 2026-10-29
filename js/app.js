const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
// console.log(container, resultado, formulario);

window.addEventListener('load', ()=>{
  formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e){
  e.preventDefault();

  // Validar
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;
  // console.log(ciudad, pais)
  if (ciudad === '' || pais === '') {
    mostrarError('Ambos campos son obligatorios');
    return
  }

  // Consultar la API
  consultarApi(ciudad,pais);
};


function mostrarError(mensaje){
  const alerta = document.querySelector('.bg-red-100');

  if (!alerta) {
      // Crear Alerta
  const alerta = document.createElement('div');
  alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3', 'rounded', 'max-w-md','mx-auto','mt-6', 'text-center');

  alerta.innerHTML = `
  <strong class='font-bold'>Error!</strong>
  <span class='block'>${mensaje}</span>
  `;
container.appendChild(alerta);

  // Eliminar alerta despues 5s
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
};

function consultarApi(ciudad, pais){
  const appID = apiKey;

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=5&appid=${appID}
  `;
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
      mostrarDatos(datos)
    });
};  

  function mostrarDatos(datos){
  if (datos.length > 0) { 
    const { lat, lon } = datos[0]; // Accede al primer elemento del array
    const latitud = lat;
    const longitud = lon;
    // Llamar a la función para consultar el clima con latitud y longitud
    consultarClima(latitud, longitud);
  } else {
    console.log('No se encontraron resultados para la ciudad y país proporcionados.');
    return null; // Retornamos null si no se encontraron resultados
  } 
};

function consultarClima(latitud, longitud) {
  const appID = apiKey;
  const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${appID}
  ` 
  spinner();//Muetra un spinner de carga
  fetch(url2)
    .then(respuesta => respuesta.json())
    .then(datosClima => {
      limpiarHTML();//limpiamos el previo
      if (datosClima.cod === '404') {
        mostrarError('Ciudad no encontrada');
        return;  
      } else {
        mostrarClima(datosClima);
      } 
    })
};

function mostrarClima(datosClima) {
  const { name, main: { temp, temp_max, temp_min } } = datosClima;
  // console.log(temp,temp_max,temp_min);
  const centigrados = KelvinACentigrados(temp);
  const max = KelvinACentigrados(temp_max);
  const min = KelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add('font-bold', 'text-2xl');

  const actual = document.createElement('p');
  actual.innerHTML = `${centigrados} &#8451;`;
  actual.classList.add('font-bold', 'text-6xl');

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `Max: ${max} &#8451; `;
  tempMaxima.classList.add('text-xl');

  const tempMinima = document.createElement('p');
  tempMinima.innerHTML = `Min: ${min} &#8451; `;
  tempMinima.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center','text-white');
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);

};
const KelvinACentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML(){
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
};

function spinner(){
  limpiarHTML();
  const divSpinner = document.createElement('div');
  divSpinner.classList.add('sk-fading-circle');
  divSpinner.innerHTML = `
  <div class="sk-circle1 sk-circle"></div>
  <div class="sk-circle2 sk-circle"></div>
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div>
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>
  `
  resultado.appendChild(divSpinner);
}



