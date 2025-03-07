import * as global from "../../js/global.js";

// Pintamos Bienvenida de usuario
if (localStorage.getItem('username')) {
    let username = localStorage.getItem('username');
    $(".username").html(username);
}

//Variables principales
let data = new Object(); //Creación de objeto data
data.accion = "pintadoLeftMenuActual";

//LLAMAMOS funcion peticion(data) de Global
global.peticion(data).then(function (res) {
    //Pintamos LEFT MENU 
    if (res.accion === "pintadoLeftMenuActual") {
        //Vistas
        let bloqueSeccionMain = res.bloqueSeccionMain;
        let bloqueBtnLogOut = res.bloqueBtnLogOut;
        // let bloqueSubSeccionMain = res.bloqueSubSeccionMain;
        // let bloqueSubSeccionLiMain = res.bloqueSubSeccionLiMain;

        //Datos
        let secciones = res.secciones;
        //Declaramos variables necesarias
        let templateSecciones = "";
        let cadBloqueSeccionMain = "";
        let nombreSeccion = "";
        let iconSeccion = "";
        let countSeccion = 0;
        let classSeccion = "";

        //Empezamos recorrido de secciones para PINTADO 
        Object.keys(secciones).forEach(k => {
            countSeccion++; //Incrementamos contador
            //Cuando sea el 1° elemento de la sección agregamos clase Activa
            classSeccion = (countSeccion === 1 ? 'active bg-gradient-primary' : '');
            // console.log(secciones[k]);
            // console.log(secciones[k].seccion);
            nombreSeccion = secciones[k].seccion; //Guardamos nombre de la Seccion
            iconSeccion = secciones[k].iconSeccion //Guardamos icon Seccion
            cadBloqueSeccionMain += bloqueSeccionMain 
                .replace(/\[idSeccion]/g, secciones[k].idSeccion)
                .replace(/\[seccion]/g, nombreSeccion)
                .replace(/\[iconSeccion]/g, iconSeccion)
                .replace(/\[classSeccion]/g, classSeccion);

            templateSecciones += cadBloqueSeccionMain;
            cadBloqueSeccionMain = ""; //Una vez agregado a template, Vaciamos bloque de Seccion
        });

        templateSecciones += bloqueBtnLogOut;
        $("#bloqueSecciones").html(templateSecciones); //Agregamos a Contenedor de Secciones y BTN LOG OUT

        //Funcionalidad LOGOUT/Cerrar sesión
        $("#btnLogOut").click(function () {
            localStorage.removeItem("username");
            localStorage.removeItem('admin');
            //Redirigimos a Login y eliminamos cache
            location.replace('../../login/vista/login.html');
        });

        //FUNCIONALIDAD DE PINTADO DE CONTENIDO DE -> SECCION ACTIVA EN LEFT MENU

        // Funcionalidad SectionMain de global que regresa sección que esta activa desde el Inicio
        let activeSection = global.sectionMain();

        if (activeSection) { //Si seccion Activa es diferente de False ...
            //Agregamos nombre de sección Activa a encabezado
            $('#sectionActive').html(activeSection);
            $('#titleSection').html(activeSection);

            //Convertimos a minusculas nombre de Sección Activa
            const scriptSectionActive = activeSection.toLowerCase();

            //PASAMOS SECCIÓN ACTIVA COMO PARAMETRO PARA LLAMAR RESPECTIVO SCRIPT DE LA SECCION... y posteriormente pintar seccion activa
            global.cargarScript('module', `../../${scriptSectionActive}/js/${scriptSectionActive}.js`, function () {
                return;
            });
        }

        //Funcionalidad clickActiveSection que regresa la Sección a la que se dio click para Activarla y posteriormente pintar seccion activa
        global.clickActiveSection();
    }

    //PINTADO ANTERIOR DE LEFT MENU EN MAIN ANTERIOR CON SUBSECCIONES - PENDIENTE

    if (res.accion === "pintadoLeftMenu") {
        //Vistas
        let bloqueSeccionMain = res.bloqueSeccionMain;
        let bloqueSubSeccionMain = res.bloqueSubSeccionMain;
        let bloqueSubSeccionLiMain = res.bloqueSubSeccionLiMain;

        //Datos
        let secciones = res.secciones;
        //Declaramos variables necesarias
        let subSecciones = {};
        let templateSecciones = "";
        let cadBloqueSeccionMain = "";
        let cadBloqueSubSeccionMain = "";
        let cadBloqueSubSeccionLiMain = "";
        let nombreSeccion = "";
        let countSeccion = 0;
        let classSeccion = "";
        //Empezamos recorrido de secciones para PINTADO 
        Object.keys(secciones).forEach(k => {
            countSeccion++; //Incrementamos contador
            classSeccion = (countSeccion === 1 ? 'active bg-gradient-primary' : '');
            console.log(secciones[k]);
            console.log(secciones[k].seccion);
            nombreSeccion = secciones[k].seccion;
            //Si existe SubSeccion usamos bloque de Seccion->SubSeccion, y recorremos SubSecciones
            if (secciones[k].existeSubSeccion) {
                //Guardamos Subsecciones
                subSecciones = secciones[k].subSection;
                Object.keys(subSecciones).forEach(k => {
                    console.log(subSecciones[k]);
                    cadBloqueSubSeccionLiMain += bloqueSubSeccionLiMain
                        .replace(/\[idSubSeccion]/g, subSecciones[k].idSubSeccion)
                        .replace(/\[subSeccion]/g, subSecciones[k].subseccion);

                    // //Validación si es NULL no pintamos subSeccion
                    // if (subSecciones[k].idSubSeccion === null) {
                    //     console.log("EXISTE NULO")
                    // } else {
                    //     console.log(subSecciones[k].idSubSeccion)
                    // }
                });

                cadBloqueSubSeccionMain += bloqueSubSeccionMain
                    .replace(/\[idSeccion]/g, secciones[k].idSeccion)
                    .replace(/\[seccion]/g, nombreSeccion)
                    .replace(/\[classSeccion]/g, classSeccion)
                    .replace(/\[subSecciones]/g, cadBloqueSubSeccionLiMain); //Agregamos Li a bloque SubSeccion

                cadBloqueSubSeccionLiMain = ""; //Vaciamos bloque de SubSeccion Li
                templateSecciones += cadBloqueSubSeccionMain; //Agregamos Bloque completo de SubSeccion con sus Li
                cadBloqueSubSeccionMain = ""; //Una vez agregado a template, Vaciamos bloque de SubSeccion
            } else { //SI NO ... usamos bloque de Seccion
                cadBloqueSeccionMain += bloqueSeccionMain
                    .replace(/\[idSeccion]/g, secciones[k].idSeccion)
                    .replace(/\[seccion]/g, nombreSeccion)
                    .replace(/\[classSeccion]/g, classSeccion);
                templateSecciones += cadBloqueSeccionMain;
                cadBloqueSeccionMain = ""; //Una vez agregado a template, Vaciamos bloque de Seccion
            }

        });

        $("#bloqueSecciones").html(templateSecciones);
    }

}).catch(function (error) {
    console.log(error);
});

