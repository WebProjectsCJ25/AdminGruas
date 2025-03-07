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
console.log('ESTAMOS EN MANIOBRAS JS');
console.log(activeSection);

//Agregamos nombre de sección Activa a encabezado
$('#sectionActive').html(activeSection);
$('#titleSection').html(activeSection);

//HACEMOS NUEVA PETICIÓN A AJAX 
// data.accion = activeSection; ESTO ES IGUAL A... data.accion = "Maniobras";
data.accion = 'getRegistrosCorralon';

pintadoManiobras(data); //Inicializamos función Pintado Maniobras y pasamos data

//Función Pintado de MANIOBRAS
function pintadoManiobras(data) {
    //Llamamos funcion peticion(data)
    global.peticion(data).then(function (res) {
        //Declaramos vistas iniciales para el Contenido de la sección
        let mainManiobras = res.mainManiobras; //Vista principal
        let bloqueTblManiobras = res.bloqueTblManiobras; //Bloque para rows de DataTable Maniobras 

        //Declaramos vistas de todos los Modales desde el inicio... por razones de renderizado 
        let modalImgVehiculos = res.modalImgVehiculos; //Modal ver imágenes de los vehículos
        let modalIngresoDeposito = res.modalIngresoDeposito; //Modal para Ingresar datos del Deposito
        let modalSalidaDeposito = res.modalSalidaDeposito; //Modal para Salida datos del Deposito
        let modalEditarManiobra = res.modalEditarManiobra; //Modal para Editar Maniobra 
        let modalRegistroManiobra = res.modalRegistroManiobra; //Modal que muestra registro de la Maniobra

        //Agregamos vista de Modales a contenedores ubicados en main
        $('#container_modal1').html(modalImgVehiculos);
        $('#container_modal2').html(modalIngresoDeposito);
        $('#container_modal3').html(modalSalidaDeposito);
        $('#container_modal4').html(modalEditarManiobra);
        $('#container_modal5').html(modalRegistroManiobra);

        //Agregamos vista principal a contenedor de Sección inicial
        $('#containerSection').html(mainManiobras);
        //Agregamos nombre de sección Activa a info de sección
        $('#infoSection').html('Información de ' + activeSection);

        
        //Pintamos DATA TABLE
        //Variables necesarias
        let maniobras = res.registrosCorralon;
        // console.log(maniobras);
        let templateManiobras = ``;
        let count = 0;
        //Recorremos maniobras
        Object.keys(maniobras).forEach(k => {
            count++;
            let row = maniobras[k]; //Row
            templateManiobras += bloqueTblManiobras
                .replace(/\[count]/g, count)
                .replace(/\[idManiobra]/g, row.idManiobra)
                .replace(/\[nombreOperador]/g, row.nombreOperador)
                .replace(/\[nombreEncargado]/g, row.nombreEncargado)
                .replace(/\[economico]/g, row.economico)
                .replace(/\[nombreMunicipio]/g, row.nombreMunicipio)
                .replace(/\[ubicacion]/g, row.ubicacion)
                .replace(/\[inventario]/g, row.inventario)
                .replace(/\[fechaInicio]/g, row.fechaInicio)
                .replace(/\[fechaFin]/g, row.fechaFin)
                .replace(/\[costo]/g, row.costo)
                .replace(/\[observaciones]/g, row.observaciones)
                .replace(/\[fechaRegistro]/g, row.fechaRegistro)
                .replace(/\[marcaVehiculo]/g, row.marcaVehiculo)
                .replace(/\[modeloVehiculo]/g, row.modeloVehiculo)
                .replace(/\[anoVehiculo]/g, row.anoVehiculo)
                .replace(/\[placaVehiculo]/g, row.placaVehiculo)
                .replace(/\[serieVehiculo]/g, row.serieVehiculo)
                .replace(/\[color]/g, row.color)
                .replace(/\[motor]/g, row.motor)
                .replace(/\[remolque]/g, row.remolque)
                .replace(/\[serieRemolque]/g, row.serieRemolque)
                .replace(/\[placaRemolque]/g, row.placaRemolque)
                .replace(/\[segundoRemolque]/g, row.segundoRemolque)
                .replace(/\[serieSegundoRemolque]/g, row.serieSegundoRemolque)
                .replace(/\[placaSegundoRemolque]/g, row.placaSegundoRemolque)
                .replace(/\[dolly]/g, row.dolly)
                .replace(/\[serieDolly]/g, row.serieDolly)
                .replace(/\[autoridad]/g, row.autoridad)
                .replace(/\[motivoRetencion]/g, row.motivoRetencion)
                .replace(/\[disposicion]/g, row.disposicion)
                .replace(/\[fechaSalida]/g, row.fechaSalida)
                .replace(/\[numFactura]/g, row.numFactura)
                .replace(/\[costoFinal]/g, row.costoFinal)
                .replace(/\[iva]/g, row.iva)
                .replace(/\[total]/g, row.total)
                .replace(/\[observacionesFinales]/g, row.observacionesFinales)
                .replace(/\[estatus]/g, row.estatus)
        });
        $("#tblBodyManiobras").html(templateManiobras); //Pintamos contenido de Tabla Maniobras

        //Verificamos si somos usuario ADMIN
        console.log('Valor de ADMIN ' + localStorage.getItem('admin'));
        if (localStorage.getItem('admin') == "false") {
            $(".btnEditarManiobra").hide();
        }

        //BTN ACCIONES DATATABLE
        $(".btnVerImgVehiculos").click(function () {
            //Envío de objeto
            data = new Object();
            data.accion = "buscarImgVehiculos";
            data.idManiobra = $(this).attr("data-idmaniobra");
            mostrarVehiculosManiobra(data)
        });

        $(".btnIngresoDeposito").click(function () {
            //Envío de objeto
            data = new Object();
            data.accion = "getModalIngresoDeposito";
            data.idManiobra = $(this).attr("data-idmaniobra");
            getModalIngresoDeposito(data)
        });

        $(".btnSalidaDeposito").click(function () {
            //Envío de objeto
            data = new Object();
            data.accion = "getModalSalidaDeposito";
            data.idManiobra = $(this).attr("data-idmaniobra");
            getModalSalidaDeposito(data)
        });

        $(".btnEditarManiobra").click(function () {
            //Envío de objeto
            data = new Object();
            data.accion = "getModalEditarManiobra";
            data.idManiobra = $(this).attr("data-idmaniobra");
            getModalEditarManiobra(data)
        });

        $(".btnRegistroManiobra").click(function () {
            //Envío de objeto
            data = new Object();
            data.accion = "getModalRegistroManiobra";
            data.idManiobra = $(this).attr("data-idmaniobra");
            getModalRegistroManiobra(data)
        });

        //Agregamos funcionalidad de DATATABLE en tblManiobras
        new DataTable('#dataTblManiobras');

    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}


//Función editar Maniobra
function getModalEditarManiobra(data) {
    //Llamamos funcion peticion(data)
    global.peticion(data).then(function (res) {
        //Función Pintado de MANIOBRAS

        //Variables necesarias para funcionalidad de Modal Editar Maniobra
        let datosOperador = res.datosOperador;
        let datosEncargado = res.datosEncargado;
        let datosGrua = res.datosGrua;
        let datosMunicipio = res.datosMunicipio;
        let datosManiobra = res.datosManiobra;
        idManiobra = datosManiobra[0].idManiobra; //Guardamos variable idManiobra
        //Vistas necesarias para Combos/Selects
        let bloqueSelectEditarManiobra = res.bloqueSelectEditarManiobra;

        //Pintamos valores en Combos/Selects/Inputs de Modal Editar Maniobra 
        let templateCmb = ``; //Var necesaria para option select

        //PINTAMOS Combo de operador
        templateCmb = `<option selected>Seleccione una opción</option>`;
        $.each(datosOperador, function (kOp, vOp) {
            templateCmb += bloqueSelectEditarManiobra
                .replace(/\[id]/g, vOp.idOperador)
                .replace(/\[nombre]/g, vOp.nombre)
        });
        $("#txtEditarRegistroOperador").html(templateCmb);
        $('#txtEditarRegistroOperador').val(datosManiobra[0].fkOperador); //Pasamos valor de idOperador

        //Funcionalidad para opción de otro en Combo operador
        // $("#txtOperador").change(function (e) {
        //     let txtOperador = $("#txtOperador").val();
        //     if (txtOperador === "1") { //Opción de otro
        //         $(".cont_txtOperador").show();
        //         boolOperador = true;
        //     } else {
        //         $(".cont_txtOperador").hide();
        //         boolOperador = false;
        //     }
        // });

        //PINTAMOS Combo de operador            
        templateCmb = `<option selected>Seleccione una opción</option>`;
        $.each(datosEncargado, function (kEn, vEn) {
            templateCmb += bloqueSelectEditarManiobra
                .replace(/\[id]/g, vEn.idEncargado)
                .replace(/\[nombre]/g, vEn.nombre)
        });
        $("#txtEditarRegistroEncargado").html(templateCmb);
        $('#txtEditarRegistroEncargado').val(datosManiobra[0].fkEncargado); //Pasamos valor de idEncargado

        //PINTAMOS Combo de Grua            
        templateCmb = `<option selected>Seleccione una opción</option>`;
        $.each(datosGrua, function (kGrua, vGrua) {
            templateCmb += bloqueSelectEditarManiobra
                .replace(/\[id]/g, vGrua.idGrua)
                .replace(/\[nombre]/g, vGrua.economico)
        });
        $("#txtEditarRegistroGrua").html(templateCmb);
        $('#txtEditarRegistroGrua').val(datosManiobra[0].fkGrua); //Pasamos valor de idGrua

        //PINTAMOS Combo de Municipio            
        templateCmb = `<option selected>Seleccione una opción</option>`;
        $.each(datosMunicipio, function (kMun, vMun) {
            templateCmb += bloqueSelectEditarManiobra
                .replace(/\[id]/g, vMun.idMunicipio)
                .replace(/\[nombre]/g, vMun.nombre)
        });
        $("#txtEditarRegistroMunicipio").html(templateCmb);
        $('#txtEditarRegistroMunicipio').val(datosManiobra[0].fkMunicipio); //Pasamos valor de idMunicipio

        //Continuamos pintando valores de inputs
        $('#txtEditarRegistroUbicacion').val(datosManiobra[0].ubicacion);
        $('#txtEditarRegistroInventario').val(datosManiobra[0].inventario);
        $('#txtEditarRegistroFechaInicio').val(datosManiobra[0].fechaInicio);
        $('#txtEditarRegistroFechaFin').val(datosManiobra[0].fechaFin);
        $('#txtEditarRegistroCosto').val(datosManiobra[0].costo);
        $('#txtEditarRegistroImagen').val(datosManiobra[0].nombreImagen);
        $('#txtEditarRegistroObservaciones').val(datosManiobra[0].observaciones);
        $('#txtEditarRegistroFechaRegistro').val(datosManiobra[0].fechaRegistro);

        $('#txtEditarRegistroMarca').val(datosManiobra[0].marcaVehiculo);
        $('#txtEditarRegistroTipo').val(datosManiobra[0].modeloVehiculo);
        $('#txtEditarRegistroPlaca').val(datosManiobra[0].placaVehiculo);
        $('#txtEditarRegistroSerie').val(datosManiobra[0].serieVehiculo);

        $('#txtEditarRegistroMotor').val(datosManiobra[0].motor);
        $('#txtEditarRegistroModelo').val(datosManiobra[0].anoVehiculo);
        $('#txtEditarRegistroColor').val(datosManiobra[0].color);

        $('#txtEditarRegistroRemolque').val(datosManiobra[0].remolque);
        $('#txtEditarRegistroSerieRemolque').val(datosManiobra[0].serieRemolque);
        $('#txtEditarRegistroPlacaRemolque').val(datosManiobra[0].placaRemolque);

        $('#txtEditarRegistroSegundoRemolque').val(datosManiobra[0].segundoRemolque);
        $('#txtEditarRegistroSerieSegundoRemolque').val(datosManiobra[0].serieSegundoRemolque);
        $('#txtEditarRegistroPlacaSegundoRemolque').val(datosManiobra[0].placaSegundoRemolque);

        $('#txtEditarRegistroDolly').val(datosManiobra[0].dolly);
        $('#txtEditarRegistroSerieDolly').val(datosManiobra[0].serieDolly);

        $('#txtEditarRegistroAutoridad').val(datosManiobra[0].autoridad);
        $('#txtEditarRegistroMotivoRetencion').val(datosManiobra[0].motivoRetencion);
        $('#txtEditarRegistroDisposicion').val(datosManiobra[0].disposicion);
        $('#txtEditarRegistroFechaSalida').val(datosManiobra[0].fechaSalida);

        $('#txtEditarRegistroAutoridad').val(datosManiobra[0].autoridad);
        $('#txtEditarRegistroMotivoRetencion').val(datosManiobra[0].motivoRetencion);
        $('#txtEditarRegistroDisposicion').val(datosManiobra[0].disposicion);
        $('#txtEditarRegistroFechaSalida').val(datosManiobra[0].fechaSalida);

        $('#txtEditarRegistroNumeroFactura').val(datosManiobra[0].numFactura);
        $('#txtEditarRegistroCostoFinal').val(datosManiobra[0].costoFinal);
        $('#txtEditarRegistroIva').val(datosManiobra[0].iva);
        $('#txtEditarRegistroTotal').val(datosManiobra[0].total);
        $('#txtEditarRegistroObservacionesFinales').val(datosManiobra[0].observacionesFinales);

        $('#txtEditarRegistroEstatus').val(datosManiobra[0].estatus); //Combo Estatus Maniobra

        //GUARDAR EDITAR MANIOBRA
        $("#btnGuardarEditarManiobra").click(function () {
            //Variables necesarias
            data = new Object(); //Creación de nuevo objeto data
            form = 'frmEditarManiobra';
            rules = {
                txtEditarRegistroOperador: "required",
                txtEditarRegistroEncargado: "required",
                txtEditarRegistroGrua: "required",
                txtEditarRegistroMunicipio: "required",
                txtEditarRegistroUbicacion: "required",
                txtEditarRegistroInventario: "required",
                txtEditarRegistroFechaInicio: "required",
                txtEditarRegistroFechaFin: "required",
                txtEditarRegistroCosto: "required",
                txtEditarRegistroObservaciones: "required",
                txtEditarRegistroFechaRegistro: "required",
                txtEditarRegistroMarca: "required",
                txtEditarRegistroTipo: "required",
                txtEditarRegistroPlaca: "required",
                txtEditarRegistroSerie: "required",
                txtEditarRegistroMotor: "required",
                txtEditarRegistroModelo: "required",
                txtEditarRegistroColor: "required",
                txtEditarRegistroRemolque: "required",
                txtEditarRegistroPlacaRemolque: "required",
                txtEditarRegistroSegundoRemolque: "required",
                txtEditarRegistroSerieSegundoRemolque: "required",
                txtEditarRegistroPlacaSegundoRemolque: "required",
                txtEditarRegistroDolly: "required",
                txtEditarRegistroSerieDolly: "required",
                txtEditarRegistroAutoridad: "required",
                txtEditarRegistroMotivoRetencion: "required",
                txtEditarRegistroDisposicion: "required",
                txtEditarRegistroFechaSalida: "required",
                txtEditarRegistroNumeroFactura: "required",
                txtEditarRegistroCostoFinal: "required",
                txtEditarRegistroIva: "required",
                txtEditarRegistroTotal: "required",
                txtEditarRegistroObservacionesFinales: "required",
                txtEditarRegistroEstatus: "required",
            }
            msgs = {
                txtEditarRegistroOperador: "Favor de llenar el campo requerido.",
                txtEditarRegistroEncargado: "Favor de llenar el campo requerido.",
                txtEditarRegistroGrua: "Favor de llenar el campo requerido.",
                txtEditarRegistroMunicipio: "Favor de llenar el campo requerido.",
                txtEditarRegistroUbicacion: "Favor de llenar el campo requerido.",
                txtEditarRegistroInventario: "Favor de llenar el campo requerido.",
                txtEditarRegistroFechaInicio: "Favor de llenar el campo requerido.",
                txtEditarRegistroFechaFin: "Favor de llenar el campo requerido.",
                txtEditarRegistroCosto: "Favor de llenar el campo requerido.",
                txtEditarRegistroObservaciones: "Favor de llenar el campo requerido.",
                txtEditarRegistroFechaRegistro: "Favor de llenar el campo requerido.",
                txtEditarRegistroMarca: "Favor de llenar el campo requerido.",
                txtEditarRegistroTipo: "Favor de llenar el campo requerido.",
                txtEditarRegistroPlaca: "Favor de llenar el campo requerido.",
                txtEditarRegistroSerie: "Favor de llenar el campo requerido.",
                txtEditarRegistroMotor: "Favor de llenar el campo requerido.",
                txtEditarRegistroModelo: "Favor de llenar el campo requerido.",
                txtEditarRegistroColor: "Favor de llenar el campo requerido.",
                txtEditarRegistroRemolque: "Favor de llenar el campo requerido.",
                txtEditarRegistroPlacaRemolque: "Favor de llenar el campo requerido.",
                txtEditarRegistroSegundoRemolque: "Favor de llenar el campo requerido.",
                txtEditarRegistroSerieSegundoRemolque: "Favor de llenar el campo requerido.",
                txtEditarRegistroPlacaSegundoRemolque: "Favor de llenar el campo requerido.",
                txtEditarRegistroDolly: "Favor de llenar el campo requerido.",
                txtEditarRegistroSerieDolly: "Favor de llenar el campo requerido.",
                txtEditarRegistroAutoridad: "Favor de llenar el campo requerido.",
                txtEditarRegistroMotivoRetencion: "Favor de llenar el campo requerido.",
                txtEditarRegistroDisposicion: "Favor de llenar el campo requerido.",
                txtEditarRegistroFechaSalida: "Favor de llenar el campo requerido.",
                txtEditarRegistroNumeroFactura: "Favor de llenar el campo requerido.",
                txtEditarRegistroCostoFinal: "Favor de llenar el campo requerido.",
                txtEditarRegistroIva: "Favor de llenar el campo requerido.",
                txtEditarRegistroTotal: "Favor de llenar el campo requerido.",
                txtEditarRegistroObservacionesFinales: "Favor de llenar el campo requerido.",
                txtEditarRegistroEstatus: "Favor de llenar el campo requerido.",
            }

            //Mandamos llamar función del Global Validation form... que nos devuelve valor booleano TRUE/FALSE dependiendo si Form es valido
            formValid = global.validationForm(form, rules, msgs);
            if (formValid) {
                //Envío de objeto para PETICION
                data.accion = "guardarEditarManiobra";
                data.idManiobra = idManiobra; //Pasamaos valor de idManiobra

                data.idOperador = $("#txtEditarRegistroOperador").val();
                data.idEncargado = $("#txtEditarRegistroEncargado").val();
                data.idGrua = $("#txtEditarRegistroGrua").val();
                data.idMunicipio = $("#txtEditarRegistroMunicipio").val();
                data.ubicacion = $("#txtEditarRegistroUbicacion").val();
                data.fechaInicio = $("#txtEditarRegistroFechaInicio").val();
                data.fechaFin = $("#txtEditarRegistroFechaFin").val();
                data.costo = $("#txtEditarRegistroCosto").val();
                data.observaciones = $("#txtEditarRegistroObservaciones").val();
                data.fechaRegistro = $("#txtEditarRegistroFechaRegistro").val();

                data.inventario = $("#txtEditarRegistroInventario").val();
                data.marcaVehiculo = $("#txtEditarRegistroMarca").val();
                data.tipoVehiculo = $("#txtEditarRegistroTipo").val();
                data.modeloVehiculo = $("#txtEditarRegistroModelo").val();
                data.serieVehiculo = $("#txtEditarRegistroSerie").val();
                data.colorVehiculo = $("#txtEditarRegistroColor").val();
                data.motorVehiculo = $("#txtEditarRegistroMotor").val();
                data.placaVehiculo = $("#txtEditarRegistroPlaca").val();

                data.remolque = $("#txtEditarRegistroRemolque").val();
                data.serieRemolque = $("#txtEditarRegistroSerieRemolque").val();
                data.placaRemolque = $("#txtEditarRegistroPlacaRemolque").val();
                data.segundoRemolque = $("#txtEditarRegistroSegundoRemolque").val();
                data.serieSegundoRemolque = $("#txtEditarRegistroSerieSegundoRemolque").val();
                data.placaSegundoRemolque = $("#txtEditarRegistroPlacaSegundoRemolque").val();
                data.dolly = $("#txtEditarRegistroDolly").val();
                data.serieDolly = $("#txtEditarRegistroSerieDolly").val();

                data.autoridad = $("#txtEditarRegistroAutoridad").val();
                data.motivoRetencion = $("#txtEditarRegistroMotivoRetencion").val();
                data.disposicion = $("#txtEditarRegistroDisposicion").val();

                data.fechaSalida = $("#txtEditarRegistroFechaSalida").val();
                data.numeroFactura = $("#txtEditarRegistroNumeroFactura").val();
                data.costoFinal = $("#txtEditarRegistroCostoFinal").val();
                data.iva = $("#txtEditarRegistroIva").val();
                data.total = $("#txtEditarRegistroTotal").val();
                data.observacionesFinales = $("#txtEditarRegistroObservacionesFinales").val();
                data.estatus = $("#txtEditarRegistroEstatus").val();

                //Pasamos parámetro Obj data para que se envíe a PETICION
                guardarEditarManiobra(data);
                //Reseteamos todos los valores del form
                $(`#${form}`).trigger("reset");
            } else { //Form invalido
                //Creamos Obj con los parametros necesarios para la alerta
                let alerta = {
                    showSwalNoti: true,
                    confirmBtn: true,
                    error: true,
                    mensaje: 'Favor de verificar que todos los campos tengan datos y no esten vacíos.'
                }
                //Llamamos Funcion Alert de Global
                global.alert(alerta); //Pasamos Obj alerta con los parámetros necesarios
            }
        });
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}

//Función para Guardar Editar Maniobra
function guardarEditarManiobra(data) {
    global.peticion(data).then(function (res) {
        //Cerramos Modal Editar Maniobra
        $("#btnCerrarEditarManiobra").trigger("click");
        //Llamamos Funcion Alert de Global
        global.alert(res); //Pasamos Obj de Respuesta de php con los parámetros necesarios
        //Volvemos a pintar Maniobras
        data = new Object(); //Creación de nuevo objeto data
        data.accion = 'getRegistrosCorralon'; //Acción de pintado de Maniobras
        pintadoManiobras(data); //Pasamos Obj data con la accion del pintado Principal de Maniobras
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}

//Función que muestra imágenes de vehículos por maniobra
function mostrarVehiculosManiobra(data) {
    //Llamamos funcion peticion(data)
    global.peticion(data).then(function (res) {
        //Guardamos variables de respuesta necesarias para PINTADO DE IMG / IMGS DE VEHICULO SI HUBO COINCIDENCIA
        let imgVehiculos = res.imgVehiculos; //Recibimos Array de imágenes
        idManiobra = res.idManiobra;
        //Siempre vacíamos contenedores de Img Vehículo / Slider Imgs vehículo
        $("#cont_vehiculo").html("");

        //Si número de Array de imágenes es < a 2 o algo Mayor / SOLO EXISTE 1 IMAGEN
        if (imgVehiculos.length < 2) {
            //Usamos vista de Bloque Vehículo
            let bloqueImgVehiculo = res.bloqueImgVehiculo;

            bloqueImgVehiculo = bloqueImgVehiculo
                .replace(/\[idManiobra]/g, idManiobra)
                .replace(/\[imgVehiculo]/g, imgVehiculos[0]);

            $("#cont_vehiculo").show(); //Mostramos contenedor de Img vehículo
            $("#cont_vehiculo").html(bloqueImgVehiculo); //Agregamos templateImg a Contenedor
            $(".sliderVehiculo ").hide(); //Escondemos contenedor de Slider Imgs
        } else { //SI SON 2 O MAS IMAGENES DE VEHICULO
            //Usamos vista de Slider Vehículo
            let bloqueSliderImgVehiculo = res.bloqueSliderImgVehiculo;
            //Declaramos template vacío para ir almacenando Bloques Slider Vehículo
            let templateSliderImg = ``;
            //Declaramos slider class Active para 1 img del Slider
            let sliderClassImg = "";
            for (const kImg in imgVehiculos) {
                sliderClassImg = kImg === '0' ? 'active' : ''; //1° Elemento img se agrega clase Active

                templateSliderImg += bloqueSliderImgVehiculo
                    .replace(/\[idManiobra]/g, idManiobra)
                    .replace(/\[imgVehiculo]/g, imgVehiculos[kImg])
                    .replace(/\[sliderClassImg]/g, sliderClassImg);
            }
            $(".sliderVehiculo").show(); //Mostramos slider de 2 o MAS Imgs Vehículo
            $(".sliderVehiculo").html(templateSliderImg); //Agregamos templateSliderImg a Contenedor de slides
            $("#cont_vehiculo").hide();  //Escondemos bloque img vehículo
        }
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}


//Función que muestra Modal Ingreso Deposito para captura de datos
function getModalIngresoDeposito(data) {
    //Llamamos funcion peticion(data)
    global.peticion(data).then(function (res) {
        //Guardamos variable de respuesta necesaria
        idManiobra = res.idManiobra; //Recibimos idManiobra

        //CERRAR INGRESO DEPOSITO
        $("#btnCerrarIngresoDeposito").click(function () {
            //Reseteamos todos los valores del form
            $('#frmIngresoDeposito').trigger("reset");
        })

        //GUARDAR INGRESO DEPOSITO
        $("#btnGuardarIngresoDeposito").click(function () {
            //Variables necesarias
            data = new Object(); //Creación de nuevo objeto data
            form = 'frmIngresoDeposito';
            rules = {
                txtIngresoDepositoNumeroInventario: "required",
                txtIngresoDepositoMarcaVehiculo: "required",
                txtIngresoDepositoTipoVehiculo: "required",
                txtIngresoDepositoSerieVehiculo: "required",
                txtIngresoDepositoModeloVehiculo: "required",
                txtIngresoDepositoColorVehiculo: "required",
                txtIngresoDepositoMotorVehiculo: "required",
                txtIngresoDepositoPlacaVehiculo: "required",
                txtIngresoDepositoRemolque: "required",
                txtIngresoDepositoSerieRemolque: "required",
                txtIngresoDepositoPlacasRemolque: "required",
                txtIngresoDepositoSegundoRemolque: "required",
                txtIngresoDepositoSerieSegundoRemolque: "required",
                txtIngresoDepositoPlacasSegundoRemolque: "required",
                txtIngresoDepositoDolly: "required",
                txtIngresoDepositoSerieDolly: "required",
                txtIngresoDepositoAutoridad: "required",
                txtIngresoDepositoMotivoRetencion: "required",
                txtIngresoDepositoDisposicion: "required",
            }
            msgs = {
                txtIngresoDepositoNumeroInventario: "Favor de llenar el campo requerido.",
                txtIngresoDepositoMarcaVehiculo: "Favor de llenar el campo requerido.",
                txtIngresoDepositoTipoVehiculo: "Favor de llenar el campo requerido.",
                txtIngresoDepositoSerieVehiculo: "Favor de llenar el campo requerido.",
                txtIngresoDepositoModeloVehiculo: "Favor de llenar el campo requerido.",
                txtIngresoDepositoColorVehiculo: "Favor de llenar el campo requerido.",
                txtIngresoDepositoMotorVehiculo: "Favor de llenar el campo requerido.",
                txtIngresoDepositoPlacaVehiculo: "Favor de llenar el campo requerido.",
                txtIngresoDepositoRemolque: "Favor de llenar el campo requerido.",
                txtIngresoDepositoSerieRemolque: "Favor de llenar el campo requerido.",
                txtIngresoDepositoPlacasRemolque: "Favor de llenar el campo requerido.",
                txtIngresoDepositoSegundoRemolque: "Favor de llenar el campo requerido.",
                txtIngresoDepositoSerieSegundoRemolque: "Favor de llenar el campo requerido.",
                txtIngresoDepositoPlacasSegundoRemolque: "Favor de llenar el campo requerido.",
                txtIngresoDepositoDolly: "Favor de llenar el campo requerido.",
                txtIngresoDepositoSerieDolly: "Favor de llenar el campo requerido.",
                txtIngresoDepositoAutoridad: "Favor de llenar el campo requerido.",
                txtIngresoDepositoMotivoRetencion: "Favor de llenar el campo requerido.",
                txtIngresoDepositoDisposicion: "Favor de llenar el campo requerido.",
            }

            //Mandamos llamar función del Global Validation form... que nos devuelve valor booleano TRUE/FALSE dependiendo si Form es valido
            formValid = global.validationForm(form, rules, msgs);
            if (formValid) {
                //Envío de objeto para PETICION
                data.accion = "guardarIngresoDeposito";
                data.idManiobra = idManiobra; //Pasamaos valor de idManiobra
                data.inventario = $("#txtIngresoDepositoNumeroInventario").val();
                data.marcaVehiculo = $("#txtIngresoDepositoMarcaVehiculo").val();
                data.tipoVehiculo = $("#txtIngresoDepositoTipoVehiculo").val();
                data.modeloVehiculo = $("#txtIngresoDepositoModeloVehiculo").val();
                data.serieVehiculo = $("#txtIngresoDepositoSerieVehiculo").val();
                data.colorVehiculo = $("#txtIngresoDepositoColorVehiculo").val();
                data.motorVehiculo = $("#txtIngresoDepositoMotorVehiculo").val();
                data.placaVehiculo = $("#txtIngresoDepositoPlacaVehiculo").val();
                data.colorVehiculo = $("#txtIngresoDepositoColorVehiculo").val();

                data.remolque = $("#txtIngresoDepositoRemolque").val();
                data.serieRemolque = $("#txtIngresoDepositoSerieRemolque").val();
                data.placaRemolque = $("#txtIngresoDepositoPlacasRemolque").val();
                data.segundoRemolque = $("#txtIngresoDepositoSegundoRemolque").val();
                data.serieSegundoRemolque = $("#txtIngresoDepositoSerieSegundoRemolque").val();
                data.placaSegundoRemolque = $("#txtIngresoDepositoPlacasSegundoRemolque").val();
                data.dolly = $("#txtIngresoDepositoDolly").val();
                data.serieDolly = $("#txtIngresoDepositoSerieDolly").val();

                data.autoridad = $("#txtIngresoDepositoAutoridad").val();
                data.motivoRetencion = $("#txtIngresoDepositoMotivoRetencion").val();
                data.disposicion = $("#txtIngresoDepositoDisposicion").val();

                //Pasamos parámetro Obj data para que se envíe a PETICION
                guardarIngresoDeposito(data);

                //Reseteamos todos los valore del form
                $(`#${form}`).trigger("reset");
            } else { //Form invalido
                //Creamos Obj con los parametros necesarios para la alerta
                let alerta = {
                    showSwalNoti: true,
                    confirmBtn: true,
                    error: true,
                    mensaje: 'Favor de verificar que todos los campos tengan datos y no esten vacíos.'
                }
                //Llamamos Funcion Alert de Global
                global.alert(alerta); //Pasamos Obj alerta con los parámetros necesarios
            }
        });
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}

//Función para Guardar Ingreso del Deposito
function guardarIngresoDeposito(data) {
    global.peticion(data).then(function (res) {
        //Cerramos Modal Ingreso Deposito
        $("#btnCerrarIngresoDeposito").trigger("click");
        //Llamamos Funcion Alert de Global
        global.alert(res); //Pasamos Obj de Respuesta de php con los parámetros necesarios
        //Volvemos a pintar Maniobras
        data = new Object(); //Creación de nuevo objeto data
        data.accion = 'getRegistrosCorralon'; //Acción de pintado de Maniobras
        pintadoManiobras(data); //Pasamos Obj data con la accion del pintado Principal de Maniobras
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}

//Función que muestra Modal Salida Deposito para captura de datos de salida
function getModalSalidaDeposito(data) {
    //Llamamos funcion peticion(data)
    global.peticion(data).then(function (res) {
        //Guardamos variable de respuesta necesaria
        idManiobra = res.idManiobra; //Recibimos idManiobra
        //CERRAR SALIDA DEPOSITO
        $("#btnCerrarSalidaDeposito").click(function () {
            //Reseteamos todos los valores del form
            $('#frmSalidaDeposito').trigger("reset");
        })
        //GUARDAR SALIDA DEPOSITO
        $("#btnGuardarSalidaDeposito").click(function () {
            //Variables necesarias
            data = new Object(); //Creación de nuevo objeto data
            form = 'frmSalidaDeposito';
            rules = {
                txtSalidaDepositoFechaSalida: "required",
                txtSalidaDepositoNumeroFactura: "required",
                txtSalidaDepositoCostoFinal: "required",
                txtSalidaDepositoIva: "required",
                txtSalidaDepositoTotal: "required",
                txtSalidaDepositoObservacionesFinales: "required"
            }
            msgs = {
                txtSalidaDepositoFechaSalida: "Favor de llenar el campo requerido.",
                txtSalidaDepositoNumeroFactura: "Favor de llenar el campo requerido.",
                txtSalidaDepositoCostoFinal: "Favor de llenar el campo requerido.",
                txtSalidaDepositoIva: "Favor de llenar el campo requerido.",
                txtSalidaDepositoTotal: "Favor de llenar el campo requerido.",
                txtSalidaDepositoObservacionesFinales: "Favor de llenar el campo requerido."
            }

            //Mandamos llamar función del Global Validation form... que nos devuelve valor booleano TRUE/FALSE dependiendo si Form es valido
            formValid = global.validationForm(form, rules, msgs);
            if (formValid) {
                //Envío de objeto para PETICION
                data.accion = "guardarSalidaDeposito";
                data.idManiobra = idManiobra; //Pasamaos valor de idManiobra
                data.fechaSalida = $("#txtSalidaDepositoFechaSalida").val();
                data.numeroFactura = $("#txtSalidaDepositoNumeroFactura").val();
                data.costoFinal = $("#txtSalidaDepositoCostoFinal").val();
                data.iva = $("#txtSalidaDepositoIva").val();
                data.total = $("#txtSalidaDepositoTotal").val();
                data.observacionesFinales = $("#txtSalidaDepositoObservacionesFinales").val();

                //Pasamos parámetro Obj data para que se envíe a PETICION
                guardarSalidaDeposito(data);
                //Reseteamos todos los valore del form
                $(`#${form}`).trigger("reset");
            } else { //Form invalido
                //Creamos Obj con los parametros necesarios para la alerta
                let alerta = {
                    showSwalNoti: true,
                    confirmBtn: true,
                    error: true,
                    mensaje: 'Favor de verificar que todos los campos tengan datos y no esten vacíos.'
                }
                //Llamamos Funcion Alert de Global
                global.alert(alerta); //Pasamos Obj alerta con los parámetros necesarios
            }
        });
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}

//Función para Guardar Salida del Deposito
function guardarSalidaDeposito(data) {
    global.peticion(data).then(function (res) {
        //Cerramos Modal Salida Deposito
        $("#btnCerrarSalidaDeposito").trigger("click");
        //Llamamos Funcion Alert de Global
        global.alert(res); //Pasamos Obj de Respuesta de php con los parámetros necesarios
        //Volvemos a pintar Maniobras
        data = new Object(); //Creación de nuevo objeto data
        data.accion = 'getRegistrosCorralon'; //Acción de pintado de Maniobras
        pintadoManiobras(data); //Pasamos Obj data con la accion del pintado Principal de Maniobras
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}

//Función que muestra datos de Registro de la Maniobra
function getModalRegistroManiobra(data) {
    //Llamamos funcion peticion(data)
    global.peticion(data).then(function (res) {
        //PINTADO DE REGISTRO MANIOBRA

        //Guardamos variables de respuesta necesaria
        let datosManiobra = res.datosManiobra;
        idManiobra = datosManiobra[0].idManiobra; //Guardamos variable idManiobra

        //Pintamos valores en Inputs de Modal Registro Maniobra 
        $('#txtModalRegistroInventario').val(datosManiobra[0].inventario);
        $('#txtModalRegistroFechaInicio').val(datosManiobra[0].fechaInicio);

        $('#txtModalRegistroMarca').val(datosManiobra[0].marcaVehiculo);
        $('#txtModalRegistroTipo').val(datosManiobra[0].modeloVehiculo);
        $('#txtModalRegistroNoSerie').val(datosManiobra[0].serieVehiculo);


        $('#txtModalRegistroModelo').val(datosManiobra[0].anoVehiculo);
        $('#txtModalRegistroColor').val(datosManiobra[0].color);
        $('#txtModalRegistroMotor').val(datosManiobra[0].motor);
        $('#txtModalRegistroPlaca').val(datosManiobra[0].placaVehiculo);

        $('#txtModalRegistroRemolque').val(datosManiobra[0].remolque);
        $('#txtModalRegistroSerieRemolque').val(datosManiobra[0].serieRemolque);
        $('#txtModalRegistroPlacaRemolque').val(datosManiobra[0].placaRemolque);

        $('#txtModalRegistroSegundoRemolque').val(datosManiobra[0].segundoRemolque);
        $('#txtModalRegistroSegundoSerieRemolque').val(datosManiobra[0].serieSegundoRemolque);
        $('#txtModalRegistroSegundoPlacaRemolque').val(datosManiobra[0].placaSegundoRemolque);

        $('#txtModalRegistroDolly').val(datosManiobra[0].dolly);
        $('#txtModalRegistroSerieDolly').val(datosManiobra[0].serieDolly);

        $('#txtModalRegistroAutoridad').val(datosManiobra[0].autoridad);
        $('#txtModalRegistroMotivo').val(datosManiobra[0].motivoRetencion);
        $('#txtModalRegistroDisposicion').val(datosManiobra[0].disposicion);


        $('#txtModalRegistroFechaSalida').val(datosManiobra[0].fechaSalida);
        $('#txtModalRegistroNumFactura').val(datosManiobra[0].numFactura);
        $('#txtModalRegistroCostoFinal').val(datosManiobra[0].costoFinal);
        $('#txtModalRegistroIva').val(datosManiobra[0].iva);
        $('#txtModalRegistroTotal').val(datosManiobra[0].total);

        $('#txtModalRegistroObservacionesFinales').val(datosManiobra[0].observacionesFinales);
        $('#txtModalRegistroEstatus').val(datosManiobra[0].estatus);
    }).catch(function (error) {
        console.log(error); //Controlamos errores de peticion
    });
}