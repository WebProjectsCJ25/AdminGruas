import * as global from "../../js/global.js";

//Declaramos variables esenciales para toda la Sección
let idManiobra; //Esencial para BTN Acciones
let data = new Object(); //Esencial para enviar datos a PETICION
//Esenciales para validar FORMS
let form;
let rules;
let msgs;
let formValid;

//Funcionalidad para PINTAR SECCIÓN QUE ESTE ACTIVA DESDE EL INICIO
let activeSection = global.sectionMain(); //Llamamos Funcion SectionMain de global que regresa activeSection
console.log('ESTAMOS EN OPERADORES JS');
console.log(activeSection);

//Agregamos nombre de sección Activa a encabezado
$('#sectionActive').html(activeSection);
$('#titleSection').html(activeSection);

//HACEMOS NUEVA PETICIÓN A AJAX con nombre de sección Activa
data.accion = activeSection;

pintadoOperadores(data); //Inicializamos función Pintado Maniobras y pasamos data

//Función Pintado de MANIOBRAS
function pintadoOperadores(data) {
    //Llamamos funcion peticion(data)
    global.peticion(data).then(function (res) {
        //Función Pintado de MANIOBRAS

        //Vistas
        let mainOperadores = res.mainOperadores; //Vista principal

        //Agregamos vista principal a contenedor de Sección inicial
        $('#containerSection').html(mainOperadores);
        //Agregamos nombre de sección Activa a info de sección
        $('#infoSection').html('Información de ' + activeSection);

        //Declaramos vistas de todos los Modales desde el inicio... por razones de renderizado

        // let modalImgVehiculos = res.modalImgVehiculos; //Modal ver imágenes de los vehículos
        // let modalIngresoDeposito = res.modalIngresoDeposito; //Modal para Ingresar datos del Deposito
        // let modalSalidaDeposito = res.modalSalidaDeposito; //Modal para Salida datos del Deposito
        // let modalEditarManiobra = res.modalEditarManiobra; //Modal para Editar Maniobra 
        // let modalRegistroManiobra = res.modalRegistroManiobra; //Modal que muestra registro de la Maniobra

        //Agregamos vista de Modales a contenedores ubicados en main

        // $('#container_modal1').html(modalImgVehiculos);
        // $('#container_modal2').html(modalIngresoDeposito);
        // $('#container_modal3').html(modalSalidaDeposito);
        // $('#container_modal4').html(modalEditarManiobra);
        // $('#container_modal5').html(modalRegistroManiobra);

        // //Pintamos DATA TABLE
        // //Variables necesarias
        // let maniobras = res.registrosCorralon;
        // // console.log(maniobras);
        // let templateManiobras = ``;
        // let count = 0;
        // //Recorremos maniobras
        // Object.keys(maniobras).forEach(k => {
        //     count++;
        //     let row = maniobras[k]; //Row
        //     templateManiobras += bloqueTblManiobras
        //         .replace(/\[count]/g, count)
        //         .replace(/\[idManiobra]/g, row.idManiobra)
        //         .replace(/\[nombreOperador]/g, row.nombreOperador)
        //         .replace(/\[nombreEncargado]/g, row.nombreEncargado)
        //         .replace(/\[economico]/g, row.economico)
        //         .replace(/\[nombreMunicipio]/g, row.nombreMunicipio)
        //         .replace(/\[ubicacion]/g, row.ubicacion)
        //         .replace(/\[inventario]/g, row.inventario)
        //         .replace(/\[fechaInicio]/g, row.fechaInicio)
        //         .replace(/\[fechaFin]/g, row.fechaFin)
        //         .replace(/\[costo]/g, row.costo)
        //         .replace(/\[observaciones]/g, row.observaciones)
        //         .replace(/\[fechaRegistro]/g, row.fechaRegistro)
        //         .replace(/\[marcaVehiculo]/g, row.marcaVehiculo)
        //         .replace(/\[modeloVehiculo]/g, row.modeloVehiculo)
        //         .replace(/\[anoVehiculo]/g, row.anoVehiculo)
        //         .replace(/\[placaVehiculo]/g, row.placaVehiculo)
        //         .replace(/\[serieVehiculo]/g, row.serieVehiculo)
        //         .replace(/\[color]/g, row.color)
        //         .replace(/\[motor]/g, row.motor)
        //         .replace(/\[remolque]/g, row.remolque)
        //         .replace(/\[serieRemolque]/g, row.serieRemolque)
        //         .replace(/\[placaRemolque]/g, row.placaRemolque)
        //         .replace(/\[segundoRemolque]/g, row.segundoRemolque)
        //         .replace(/\[serieSegundoRemolque]/g, row.serieSegundoRemolque)
        //         .replace(/\[placaSegundoRemolque]/g, row.placaSegundoRemolque)
        //         .replace(/\[dolly]/g, row.dolly)
        //         .replace(/\[serieDolly]/g, row.serieDolly)
        //         .replace(/\[autoridad]/g, row.autoridad)
        //         .replace(/\[motivoRetencion]/g, row.motivoRetencion)
        //         .replace(/\[disposicion]/g, row.disposicion)
        //         .replace(/\[fechaSalida]/g, row.fechaSalida)
        //         .replace(/\[numFactura]/g, row.numFactura)
        //         .replace(/\[costoFinal]/g, row.costoFinal)
        //         .replace(/\[iva]/g, row.iva)
        //         .replace(/\[total]/g, row.total)
        //         .replace(/\[observacionesFinales]/g, row.observacionesFinales)
        //         .replace(/\[estatus]/g, row.estatus)
        // });
        // $("#tblBodyManiobras").html(templateManiobras); //Pintamos contenido de Tabla Maniobras

        // //Verificamos si somos usuario ADMIN
        // console.log('Valor de ADMIN ' + localStorage.getItem('admin'));
        // if (localStorage.getItem('admin') == "false") {
        //     $(".btnEditarManiobra").hide();
        // }

        // //BTN ACCIONES DATATABLE
        // $(".btnVerImgVehiculos").click(function () {
        //     //Envío de objeto
        //     data = new Object();
        //     data.accion = "buscarImgVehiculos";
        //     data.idManiobra = $(this).attr("data-idmaniobra");
        //     mostrarVehiculosManiobra(data)
        // });

        // $(".btnIngresoDeposito").click(function () {
        //     //Envío de objeto
        //     data = new Object();
        //     data.accion = "getModalIngresoDeposito";
        //     data.idManiobra = $(this).attr("data-idmaniobra");
        //     getModalIngresoDeposito(data)
        // });

        // $(".btnSalidaDeposito").click(function () {
        //     //Envío de objeto
        //     data = new Object();
        //     data.accion = "getModalSalidaDeposito";
        //     data.idManiobra = $(this).attr("data-idmaniobra");
        //     getModalSalidaDeposito(data)
        // });

        // $(".btnEditarManiobra").click(function () {
        //     //Envío de objeto
        //     data = new Object();
        //     data.accion = "getModalEditarManiobra";
        //     data.idManiobra = $(this).attr("data-idmaniobra");
        //     getModalEditarManiobra(data)
        // });

        // $(".btnRegistroManiobra").click(function () {
        //     //Envío de objeto
        //     data = new Object();
        //     data.accion = "getModalRegistroManiobra";
        //     data.idManiobra = $(this).attr("data-idmaniobra");
        //     getModalRegistroManiobra(data)
        // });

        // //Agregamos funcionalidad de DATATABLE en tblManiobras
        // new DataTable('#dataTblManiobras');
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}



