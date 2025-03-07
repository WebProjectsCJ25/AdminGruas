//Función AJAX para enviar datos a php 
export function peticion(data) {
    if (data.hasOwnProperty("formData")) { //Caso especial de envío AJAX con input file y FormData
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: './php/request.php',
                data: data.formData,
                cache: false,
                contentType: false,
                processData: false,
                error: function () {
                    reject(error);
                },
                success: function (res) {
                    resolve(res);
                }
            });            
        });
    } else { //Envío NORMAL DE FORM CON AJAX
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '../../php/request.php',
                data: data,
                cache: false,
                success: function (res) {
                    resolve(res);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }
}

// SWAL ALERT FUNCTION 
export function alert(response) {
    //Variables necesarias para configurar mensaje swal fire dependiendo respuesta
    let icon, title, text = "";
    icon = (response.error === true ? 'error' : 'success');
    title = (response.error === true ? 'Error' : 'Datos enviados');
    text = (response.error === true ? response.mensaje : response.mensaje);

    //Dependiendo accion controlamos MOSTRAR / ESCONDER MODAL
    if (response.showSwalNoti) {
        //Mensaje personalizado dependiendo respuesta
        Swal.fire({
            allowOutsideClick: false,
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: response.confirmBtn
        })
    }
}

//FORM VALIDATION FUNCTION
export function validationForm(form, rules, msgs) {
    $(`#${form}`).validate({
        rules: rules,
        messages: msgs,
        errorPlacement: function (error, element) {
            let spnError = $(element).data("error");
            if (spnError) {
                $(spnError).append(error);
            } else {
                error.insertAfter(element);
            }
        },
    });

    //Si Form valido
    if ($(`#${form}`).valid()) {
        return true;
    } else { //Form invalido
        return false;
    }
}

//Funcionalidad para SECCION ACTVA que este desde el INICIO
export function sectionMain() {
    //Variables necesarias
    let sectionsLinks = document.querySelectorAll('.seccion a'); //Obtenemos todos los Links de las Secciones
    let sectionName;
    let activeSection = false;
    //Recorremos LINKS de secciones hasta encontrar la ACTIVA
    sectionsLinks.forEach(sectionLink => {
        // console.log(sectionLink.className);
        sectionName = sectionLink.querySelector('span'); //Guardamos nombre de la sección del SPAN

        //Si sección activa guardamos Nombre de la Sección..
        if (sectionLink.className.includes('active')) { activeSection = sectionName.textContent }

        // activeSection = sectionLink.className.includes('active') ? sectionName.textContent : false;
    });
    // console.log('EN GLOBAL VALOR DE SECCION ES' + activeSection);
    return activeSection; //Regresamos la Sección que este Activa
}

//Funcionalidad para DETECTAR SECCIÓN ACTIVA cuando se da Click
export function clickActiveSection() {
    //Variables necesarias
    let spnClickSection, nameClickSection;
    //Obtenemos todos los Links de las Secciones y quitamos clase ACTIVA
    document.querySelectorAll('.seccion a').forEach(sectionLink => {
        sectionLink.addEventListener('click', () => {
            spnClickSection = sectionLink.querySelector('span'); //De ese link buscamos el elemento Span
            nameClickSection = spnClickSection.textContent; //Del Span guardamos su contenido(Texto) -> Nombre de la Sección Clickeada

            //Obtenemos todos los Links de las Secciones y quitamos clase ACTIVA
            document.querySelectorAll('.seccion a').forEach(value => {
                value.className = 'nav-link text-white';
            });
            //Agregamos clase Active solo a sección que se de click
            sectionLink.className = 'nav-link active bg-gradient-primary text-white';

            //PASAMOS SECCIÓN CLICKEADA ACTIVA COMO PARAMETRO PARA LLAMAR RESPECTIVO SCRIPT DE LA SECCION... y posteriormente pintar seccion activa
            cargarScript('module', `../../${nameClickSection.toLowerCase()}/js/${nameClickSection.toLowerCase()}.js?v=${Date.now()}`, function () {
                return;
            });

            // return nameClickSection; //Regresamos nombre de la sección activa que se dio click
        })
    });
}

//Funcionalidad para cargar Script de Sección Activa desde el Inicio
export function cargarScript(type, url, callback) {
    const script = document.createElement('script');
    script.type = type;
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}