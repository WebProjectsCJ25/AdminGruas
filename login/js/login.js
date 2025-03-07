import * as global from "../../js/global.js";
//Variables principales
let data = new Object(); //Creación de objeto data

//Funcionalidad -> VALIDAR LOGIN
$(".btnLogin").click(function () {
    $("#frmLogin").validate({
        rules: {
            txtNombreUsuario: "required",
            txtToken: "required"
        },
        messages: {
            txtNombreUsuario: "*Favor de llenar el campo requerido.",
            txtToken: "*Favor de llenar el campo requerido."
        },
        errorPlacement: function (error, element) {
            let spnError = $(element).data('error');
            if (spnError) {
                $(spnError).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });

    //Envío de objeto
    data.accion = "validarLogin";
    data.nombreUsuario = $("#txtNombreUsuario").val();
    data.token = $("#txtToken").val();

    if ($("#frmLogin").valid()) { //Si datos del Form NO VACIOS entonces...
        //Llamamos funcion peticion(data) de GLOBAL JS
        global.peticion(data).then(function (res) {
            // console.log(res);
            //Si datos del LOGIN VALIDOS entonces...
            if (res.accion === "validarLogin") {
                console.log(res);
                localStorage.setItem('username', res.nombreUsuario);
                localStorage.setItem('admin', res.rolAdmin);
                //Redirigimos a inicio
                setTimeout(() => {
                    location.replace('../../inicio/vista/main.html');
                }, 2000);
            }

            //Llamamos Funcion Alert de Global para mostrar avisos si es que aplica
            global.alert(res); 

        }).catch(function (error) {
            console.log(error); //Controlamos errores de peticion
        });

        $('#frmLogin').trigger("reset"); //Reseteamos valores de Form
    } else {
        $('#frmLogin').trigger("reset"); //Reseteamos valores de Form
    }
});