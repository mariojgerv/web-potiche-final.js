document.addEventListener('DOMContentLoaded', () => {

	fetch('js/compras.json')
		.then(function () {
		})
		.catch(function () {
		});
	// Variables

	let carrito = [];
	const divisa = '$';
	const DOMitems = document.querySelector('#items');
	const DOMcarrito = document.querySelector('#carrito');
	const DOMtotal = document.querySelector('#total');
	const DOMbotonVaciar = document.querySelector('#boton-vaciar');
	const miLocalStorage = window.localStorage;

	// Funciones

	/**. No confundir con el carrito
	*/
	function renderizarProductos() {
		baseDeDatos.forEach(function (info) {

				const miNodo = document.createElement('div');
				miNodo.classList.add('card', 'col-sm-4');

				const miNodoCardBody = document.createElement('div');
				miNodoCardBody.classList.add('card-body');

				const miNodoTitle = document.createElement('h5');
				miNodoTitle.classList.add('card-title');
				miNodoTitle.textContent = info.nombre;
				// Imagen
				const miNodoImagen = document.createElement('img');
				miNodoImagen.classList.add('img-fluid');
				miNodoImagen.setAttribute('src', info.imagen);
				// Precio
				const miNodoPrecio = document.createElement('p');
				miNodoPrecio.classList.add('card-text');
				miNodoPrecio.textContent = `${info.precio}${divisa}`;

				const miNodoBoton = document.createElement('button');
				miNodoBoton.classList.add('btn', 'btn-primary');
				miNodoBoton.textContent = '+';
				miNodoBoton.setAttribute('marcador', info.id);
				miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
				// Insertamos
				miNodoCardBody.appendChild(miNodoImagen);
				miNodoCardBody.appendChild(miNodoTitle);
				miNodoCardBody.appendChild(miNodoPrecio);
				miNodoCardBody.appendChild(miNodoBoton);
				miNodo.appendChild(miNodoCardBody);
				DOMitems.appendChild(miNodo);
			});
	}

	function anyadirProductoAlCarrito(evento) {
		carrito.push(evento.target.getAttribute('marcador'))
		renderizarCarrito();
		guardarCarritoEnLocalStorage();
	}

	function renderizarCarrito() {
		
		DOMcarrito.textContent = '';
		
		const carritoSinDuplicados = [...new Set(carrito)];
		
		carritoSinDuplicados.forEach((item) => {
			const miItem = baseDeDatos.filter((itemBaseDatos) => {
				// ¿Coincide las id?
				return itemBaseDatos.id === parseInt(item);
			});
			const numeroUnidadesItem = carrito.reduce((total, itemId) => {
				// ¿Coincide las id?
				return itemId === item ? total += 1 : total;
			}, 0);
			const miNodo = document.createElement('li');
			miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
			miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
			// Boton de borrar
			const miBoton = document.createElement('button');
			miBoton.classList.add('btn', 'btn-danger', 'mx-5');
			miBoton.textContent = 'X';
			miBoton.style.marginLeft = '1rem';
			miBoton.dataset.item = item;
			miBoton.addEventListener('click', borrarItemCarrito);

			miNodo.appendChild(miBoton);
			DOMcarrito.appendChild(miNodo);
		});
		DOMtotal.textContent = calcularTotal();
	}

	/**
	* borrar del carrito
	*/
	function borrarItemCarrito(evento) {

		const id = evento.target.dataset.item;

		carrito = carrito.filter((carritoId) => {
			return carritoId !== id;
		});

		renderizarCarrito();

		guardarCarritoEnLocalStorage();

	}

	/**
	 * Calcula el precio total teniendo en cuenta los productos repetidos
	 */
	function calcularTotal() {
		return carrito.reduce((total, item) => {
			
			const miItem = baseDeDatos.filter((itemBaseDatos) => {
				return itemBaseDatos.id === parseInt(item);
			});
			// Los sumamos al total
			return total + miItem[0].precio;
		}, 0).toFixed(2);
	}

	
	function vaciarCarrito() {
		
		carrito = [];	
		renderizarCarrito();
		localStorage.clear();

	}

	function guardarCarritoEnLocalStorage () {
		miLocalStorage.setItem('carrito', JSON.stringify(carrito));
	}

	function cargarCarritoDeLocalStorage () {
		// ¿Existe un carrito anterior?
		if (miLocalStorage.getItem('carrito') !== null) {
			
			carrito = JSON.parse(miLocalStorage.getItem('carrito'));
		}
	}

	// Eventos
	DOMbotonVaciar.addEventListener('click', vaciarCarrito);

	// Inicio
	cargarCarritoDeLocalStorage();
	renderizarProductos();
	renderizarCarrito();
});
