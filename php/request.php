<?php
include_once('connection.php');
include_once("../php/SimpleXLSXGen.php");

date_default_timezone_set('America/Mexico_City');
$respuesta = new stdClass(); //Creamos objeto para guardar respuestas dependiendo acción
$data = new stdClass(); //Creamos objeto data donde recibimos los datos de JS
$vista = new stdClass(); //Creamos obj vista para guardar los bloques de html/phtml


//Función general para generar CADENA DE CARACTERES RANDOM
function generarCodigo($longitud)
{
    $key = '';
    $pattern = '1234567890ABCDEFGH';
    $max = strlen($pattern) - 1;
    for ($i = 0; $i < $longitud; $i++)
        $key .= $pattern[mt_rand(0, $max)];
    return $key;
}

// Función para subir archivos de tipo imágen
function uploadImage()
{
    $img = new stdClass(); //Creamos objeto img
    $root = 'C:/xampp/htdocs/gRojas/';
    $target_dir = $root . 'archivos/maniobras/vehiculos/';
    $allowed_mime_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg', 'image/webp'];
    $max_file_size = 2 * 1024 * 1024; // 2MB

    // Check if file was uploaded
    if (!isset($_FILES['file']) || $_FILES['file']['error'] != UPLOAD_ERR_OK) {
        // $error = 'No file uploaded or upload error occurred.';
        $img->messageError = 'No file uploaded or upload error occurred.';
        $img->error = true;
        return $img;
    } else {
        // Validate file type
        $mime_type = mime_content_type($_FILES['file']['tmp_name']);
        if (!in_array($mime_type, $allowed_mime_types)) {
            // $error = 'Invalid file type. Only JPEG, , and GIF are allowed.';
            $img->messageError = 'Invalid file type. Only JPEG, , and GIF are allowed.';
        }

        // Validate file size
        if ($_FILES['file']['size'] > $max_file_size) {
            // $error = 'File size exceeds the maximum limit of 2MB.';
            $img->messageError = 'File size exceeds the maximum limit of 2MB.';
        }

        // Si se declara variable error-> significa que hubo error en alguna validación de IMG
        if (isset($img->messageError)) {
            $img->error = true;
            return $img;
            // echo '<p style="color: red;">' . $error . '</p>';
        } else { // UPLOAD EXITOSA -> guardamos en carpeta
            // Generate unique filename
            $prefijo = 'vehiculo_';
            $idImg = uniqid();
            $idImg = substr($idImg, 0, 6); //contendrá los primeros 6 caracteres del id
            $target_file = $target_dir . $prefijo . $idImg . '.' . pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
            $nameImg = $prefijo . $idImg . '.' . pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION); //Guardamos nombre de imágen
            $img->nameImg = $nameImg; //Pasamos nombre de imagen a img Obj

            // Attempt to move uploaded file
            if (!move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
                $error = 'Error moving uploaded file to destination.';
                $img->messageError = 'Error moving uploaded file to destination.';
                $img->error = true;
                return $img;
            }

            $img->error = false;
            return $img;
            //     echo '<p style="color: green;">Image uploaded successfully!</p>';
        }
    }
}

// Validación si GET no esta vacío
if (!empty($_GET)) {
    //Recorremos todos los keys con sus valores del array para agregarlos a las propiedades del obj data con sus valores
    foreach ($_GET as $k => $v) {
        $data->$k = $v;
    }
}

// validación si POST no esta vacío
if (!empty($_POST)) {
    // print_r($_POST); 
    //Recorremos todos los keys con sus valores del array para agregarlos a las propiedades del obj data con sus valores
    foreach ($_POST as $k => $v) {
        $data->$k = $v;
    }
}

function getVista($data)
{
    // SCH_URL_DATA
    // $vista = SCH_URL_DATA . $data->archivo . ".phtml";
    $vista = $data->archivo . ".phtml";
    if (file_exists($vista)) {
        if (fopen($vista, "r")) {
            ob_start();
            require($vista);
            $template = ob_get_clean();
        } else {
            $template = "El archivo '$vista' no se ha podido abrir.";
        }
    } else {
        $template = "La vista '$vista' no existe ERROR: ";
    }
    // print_r($template);
    // exit;
    return ($template);
}

// --------------------------- CASOS DE LOGIN --------------------------- 
if ($data->accion === "validarLogin") {
    $concatDataUser = $data->nombreUsuario . $data->token;

    $sql = "
        SELECT
            u.rowid,
            u.nombre,
            u.fkPuesto as idPuesto
        FROM
            gr_usuario u
        WHERE
            concat(u.username,u.token) REGEXP ?
        AND
            u.fkEstatusUsuario = ?;
    ";
    $query = $pdoconnection->prepare($sql);
    $query->execute(array($concatDataUser, 1));

    //Encontro coincidencia de credenciales de Usuario 
    if ($query->rowCount() > 0) {
        $datosUsuario = $query->fetchAll(); //Guardamos datos Usuario
        //Guardamos valores de datosUsuario que necesitamos
        $nombreUsuario = $datosUsuario[0]->nombre;
        $rolAdmin = ($datosUsuario[0]->idPuesto === 1) ? true : false; //Si es 1 es Admin
        //Regresamos respuesta con datos de Usuario TKN OPERADOR 
        $respuesta->accion = $data->accion;
        $respuesta->error = false;
        $respuesta->showSwalNoti = true;
        $respuesta->mensaje = "Bienvenido $nombreUsuario";
        $respuesta->confirmBtn = false;
        $respuesta->nombreUsuario = $nombreUsuario;
        $respuesta->rolAdmin = $rolAdmin;
    } else {
        $respuesta->error = true;
        $respuesta->showSwalNoti = true;
        $respuesta->mensaje = "Error, por favor vuelva a escribir sus credenciales.";
        $respuesta->confirmBtn = true;
    }
}

// --------------------------- CASOS ADMIN --------------------------- 
if ($data->accion === "datosOperadores") {
    $sql = "
        SELECT
            go.rowid as idOperador,
            go.nombre,
            go.estatus
        FROM
            gr_operador go;
    ";
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosOperadores = $query->fetchAll(); //Guardamos datos Usuario
    // print_r($datosOperadores); exit;
    foreach ($datosOperadores as $k => $v) {
        $v->estatusOperador = ($v->estatus == 1) ? "Disponible" : "No disponible";
    }
    //Regresamos respuesta con datos de cajas y turnos
    $respuesta->accion = $data->accion;
    $respuesta->error = false;
    $respuesta->messageSwal = false;
    $respuesta->datosOperadores = $datosOperadores;
}

// --------------------------- CASOS DE INICIO(MAIN) ---------------------------
if ($data->accion === "pintadoLeftMenuActual") {
    $sql = "
        SELECT 
            gs.rowid as idSeccion, 
            gs.nombre as seccion,
            gs.estatus as estatusSeccion,
            gs.orden
        FROM
            gr_secciones gs
        WHERE
            gs.estatus = 1
        AND
            gs.orden ORDER BY gs.orden ASC LIMIT 10;
    ";
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $secciones = $query->fetchAll(); //Guardamos datos de secciones

    //Creamos objeto inicial que usaremos
    $sections = new stdClass();

    //Recorremos objeto $secciones de la repuesta de la consulta
    foreach ($secciones as $key => $row) {
        if ($row->seccion === 'Maniobras') {
            $row->iconSeccion = 'fa-car-crash'; 
        } else if ($row->seccion === 'Gruas') {
            $row->iconSeccion = 'fa-truck-pickup';
        } else if ($row->seccion === 'Operadores') {
            $row->iconSeccion = 'fa-user';
        } else if ($row->seccion === 'Encargados') {
            $row->iconSeccion = 'fa-user-tie';
        } else {
            $row->iconSeccion = 'fa-dragon';
        }

        //Guardamos cada ID ÚNICO de idSeccion en variable
        $idSeccion = $row->idSeccion;

        //Guardamos orden de cada Sección
        $ordenSeccion = $row->orden;

        //Si no esta declarado objeto $sections->$ordenSeccion entonces...
        if (!isset($sections->$ordenSeccion)) {
            //Creamos objeto sections y agregamos propiedades
            $sections->$ordenSeccion = new stdClass();
            $sections->$ordenSeccion->idSeccion = $idSeccion;
            $sections->$ordenSeccion->seccion = $row->seccion;
            $sections->$ordenSeccion->iconSeccion = $row->iconSeccion;
        }
    }

    // print_r($secciones); exit;

    //Para funcionalidad de bloques de Vistas
    $data->archivo = "../inicio/vista/bloqueSeccionMain";
    $respuesta->bloqueSeccionMain = getVista($data);
    // $data->archivo = "../inicio/vista/bloqueSubSeccionMain";
    // $respuesta->bloqueSubSeccionMain = getVista($data);
    // $data->archivo = "../inicio/vista/bloqueSubSeccionLiMain";
    // $respuesta->bloqueSubSeccionLiMain = getVista($data);
    $data->archivo = "../inicio/vista/bloqueBtnLogOut";
    $respuesta->bloqueBtnLogOut = getVista($data);

    //Regresamos respuesta con datos de cajas y turnos
    $respuesta->accion = $data->accion;
    $respuesta->error = false;
    $respuesta->messageSwal = false; // Es false porque es pintado
    $respuesta->secciones = $sections; //Pasamos obj sections a respuesta
}

// --------------------------- CASOS DE MANIOBRAS ---------------------------
if ($data->accion === "Maniobras") {
    $sql = "
            SELECT
                m.rowid as idManiobra,
                m.fkOperador,
                m.otroOperador,
                m.fkEncargado,
                m.otroEncargado,
                m.fkGrua,
                m.otroGrua,
                m.fkMunicipio,
                m.otroMunicipio,
                m.inventario,
                m.marcaVehiculo,
                m.modeloVehiculo,
                m.anoVehiculo,
                m.placaVehiculo,
                m.serieVehiculo,
                m.ubicacion,
                m.fechaInicio,
                m.fechaFin,
                m.costo,
                m.nombreImagen,
                m.observaciones,
                m.fechaRegistro,
                m.estatus,
                o.nombre as nombreOperador,
                e.nombre as nombreEncargado,
                g.economico,
                mu.nombre as nombreMunicipio
            FROM
                gr_maniobra m
                LEFT JOIN gr_operador o ON o.rowid = m.fkOperador
                LEFT JOIN gr_encargado e ON e.rowid = m.fkEncargado
                LEFT JOIN gr_grua g ON g.rowid = m.fkGrua
                LEFT JOIN gr_municipio mu ON mu.rowid = m.fkMunicipio;
    ";

    //print_r($sql);
    //exit;
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosManiobras = $query->fetchAll(); //Guardamos datos Usuario
    foreach ($datosManiobras as $k => $v) {
        $v->estatusOperador = ($v->estatus == 1) ? "Disponible" : "No disponible";
        $v->nombreOperador = ($v->fkOperador == 1) ? $v->otroOperador : $v->nombreOperador;
        $v->nombreEncargado = ($v->fkOperador == 1) ? $v->otroEncargado : $v->nombreEncargado;
        $v->economico = ($v->fkGrua == 1) ? $v->otroGrua : $v->economico;
        $v->nombreMunicipio = ($v->fkMunicipio == 1) ? $v->otroMunicipio : $v->nombreMunicipio;
    }

    //Regresamos bloques de Vistas necesarios para vista Maniobras 
    $data->archivo = "../maniobras/vista/mainManiobras";
    $respuesta->mainManiobras = getVista($data);
    $data->archivo = "../maniobras/vista/bloqueTblManiobras";
    $respuesta->bloqueTblManiobras = getVista($data);

    //Regresamos respuesta con datos de cajas y turnos
    $respuesta->accion = $data->accion;
    $respuesta->error = false;
    $respuesta->showSwalNoti = false;
    $respuesta->datosManiobras = $datosManiobras;
    //print_r($respuesta); exit;
}

// ---------------------------------
// AQUI EMPIEZAN NUEVOS DATOS
// -------------------------------------

if ($data->accion === "getRegistrosCorralon") {
    $sql = "
        SELECT
            m.rowid as idManiobra,
            m.fkOperador,
            m.otroOperador,
            m.fkEncargado,
            m.otroEncargado,
            m.fkGrua,
            m.otroGrua,
            m.fkMunicipio,
            m.otroMunicipio,
            m.inventario,
            m.marcaVehiculo,
            m.modeloVehiculo,
            m.anoVehiculo,
            m.placaVehiculo,
            m.serieVehiculo,
            m.ubicacion,
            m.fechaInicio,
            m.fechaFin,
            m.costo,
            m.nombreImagen,
            m.observaciones,
            m.fechaRegistro,
            m.color,
            m.motor,
            m.remolque,
            m.serieRemolque,
            m.placaRemolque,
            m.segundoRemolque,
            m.serieSegundoRemolque,
            m.placaSegundoRemolque,
            m.dolly,
            m.serieDolly,
            m.autoridad,
            m.motivoRetencion,
            m.disposicion,
            m.fechaSalida,
            m.numFactura,
            m.costoFinal,
            m.iva,
            m.total,
            m.observacionesFinales,
            m.estatus,
            o.nombre as nombreOperador,
            e.nombre as nombreEncargado,
            g.economico,
            mu.nombre as nombreMunicipio
        FROM
            gr_maniobra m
            LEFT JOIN gr_operador o ON o.rowid = m.fkOperador
            LEFT JOIN gr_encargado e ON e.rowid = m.fkEncargado
            LEFT JOIN gr_grua g ON g.rowid = m.fkGrua
            LEFT JOIN gr_municipio mu ON mu.rowid = m.fkMunicipio
        ORDER BY m.rowid ASC
    ;";

    //print_r($sql);
    //exit;
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $registrosCorralon = $query->fetchAll(); //Guardamos datos Usuario
    foreach ($registrosCorralon as $k => $v) {
        $v->estatusOperador = ($v->estatus == 1) ? "Disponible" : "No disponible";
        $v->nombreOperador = ($v->fkOperador == 1) ? $v->otroOperador : $v->nombreOperador;
        $v->nombreEncargado = ($v->fkOperador == 1) ? $v->otroEncargado : $v->nombreEncargado;
        $v->economico = ($v->fkGrua == 1) ? $v->otroGrua : $v->economico;
        $v->nombreMunicipio = ($v->fkMunicipio == 1) ? $v->otroMunicipio : $v->nombreMunicipio;
        if ($v->estatus == 1) {
            $v->estatus = "EN MANIOBRA";
        }
        if ($v->estatus == 2) {
            $v->estatus = "INGRESO AL CORRALON";
        }
        if ($v->estatus == 3) {
            $v->estatus = "SALIO DEL CORRALON";
        }
    }

    //Regresamos bloques de Vistas necesarios para vista Maniobras 
    $data->archivo = "../maniobras/vista/mainManiobras";
    $respuesta->mainManiobras = getVista($data);
    $data->archivo = "../maniobras/vista/bloqueTblManiobras";
    $respuesta->bloqueTblManiobras = getVista($data);
    $data->archivo = "../maniobras/vista/modalManiobra";
    $respuesta->modalManiobra = getVista($data);

    // REGRESAMOS DESDE EL INICIO VISTAS DE MODALES QUE USAREMOS

    //Regresamos bloque de Vista necesario para Modal Img Vehiculos
    $data->archivo = "../maniobras/vista/modalImgVehiculos/modalImgVehiculos";
    $respuesta->modalImgVehiculos = getVista($data);
    //Regresamos bloque de Vista necesario para Modal Ingreso Deposito
    $data->archivo = "../maniobras/vista/modalIngresoDeposito/modalIngresoDeposito";
    $respuesta->modalIngresoDeposito = getVista($data);
    //Regresamos bloque de Vista necesario para Modal Salida Deposito
    $data->archivo = "../maniobras/vista/modalSalidaDeposito/modalSalidaDeposito";
    $respuesta->modalSalidaDeposito = getVista($data);
    //Regresamos Bloque de Vista necesario para Modal Editar Maniobra
    $data->archivo = "../maniobras/vista/modalEditarManiobra/modalEditarManiobra";
    $respuesta->modalEditarManiobra = getVista($data);
    //Regresamos Bloque de Vista necesario para Modal Registro Maniobra
    $data->archivo = "../maniobras/vista/modalRegistroManiobra/modalRegistroManiobra";
    $respuesta->modalRegistroManiobra = getVista($data);

    //Regresamos respuesta
    $respuesta->accion = $data->accion;
    $respuesta->error = false;
    $respuesta->showSwalNoti = false;
    $respuesta->registrosCorralon = $registrosCorralon;
    //print_r($respuesta); exit;
}

if ($data->accion === "getModalEditarManiobra") {
    // print_r('SI ENTRA EN EDITAR MANIOBRA');
    // print_r($data);
    // exit;
    $sql = "
         SELECT
             m.rowid as idManiobra,
             m.fkOperador,
             m.otroOperador,
             m.fkEncargado,
             m.otroEncargado,
             m.fkGrua,
             m.otroGrua,
             m.fkMunicipio,
             m.otroMunicipio,
             m.inventario,
             m.marcaVehiculo,
             m.modeloVehiculo,
             m.anoVehiculo,
             m.placaVehiculo,
             m.serieVehiculo,
             m.ubicacion,
             m.fechaInicio,
             m.fechaFin,
             m.costo,
             m.nombreImagen,
             m.observaciones,
             m.fechaRegistro,
             m.color,
             m.motor,
             m.remolque,
             m.serieRemolque,
             m.placaRemolque,
             m.segundoRemolque,
             m.serieSegundoRemolque,
             m.placaSegundoRemolque,
             m.dolly,
             m.serieDolly,
             m.autoridad,
             m.motivoRetencion,
             m.disposicion,
             m.fechaSalida,
             m.numFactura,
             m.costoFinal,
             m.iva,
             m.total,
             m.observacionesFinales,
             m.estatus,
             o.nombre as nombreOperador,
             e.nombre as nombreEncargado,
             g.economico,
             mu.nombre as nombreMunicipio
         FROM
             gr_maniobra m
             LEFT JOIN gr_operador o ON o.rowid = m.fkOperador
             LEFT JOIN gr_encargado e ON e.rowid = m.fkEncargado
             LEFT JOIN gr_grua g ON g.rowid = m.fkGrua
             LEFT JOIN gr_municipio mu ON mu.rowid = m.fkMunicipio
        WHERE
            m.rowid = $data->idManiobra;
    ";

    // print_r($sql);
    // exit;
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosManiobra = $query->fetchAll(); //Guardamos datos Usuario
    foreach ($datosManiobra as $k => $v) {
        $v->estatusOperador = ($v->estatus == 1) ? "Disponible" : "No disponible";
        $v->nombreOperador = ($v->fkOperador == 1) ? $v->otroOperador : $v->nombreOperador;
        $v->nombreEncargado = ($v->fkOperador == 1) ? $v->otroEncargado : $v->nombreEncargado;
        $v->economico = ($v->fkGrua == 1) ? $v->otroGrua : $v->economico;
        $v->nombreMunicipio = ($v->fkMunicipio == 1) ? $v->otroMunicipio : $v->nombreMunicipio;
    }

    //Realizamos consultas para traer todos los datos del ComboBox / Select, en los campos que sea necesario

    //Consulta datos operadores
    $sql = "
        SELECT
            go.rowid as idOperador,
            go.nombre,
            go.estatus as estatusOperador
        FROM
            gr_operador go;
    ";
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosOperador = $query->fetchAll(); //Guardamos datos Operadores

    //Consulta datos encargados
    $sql = "
        SELECT
            ge.rowid as idEncargado,
            ge.nombre,
            ge.estatus as estatusEncargado
        FROM
            gr_encargado ge;
    ";
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosEncargado = $query->fetchAll(); //Guardamos datos encargados

    //Consulta datos gruas
    $sql = "
        SELECT
            gg.rowid as idGrua,
            gg.economico,
            gg.estatus as estatusGrua
        FROM
            gr_grua gg;
    ";
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosGrua = $query->fetchAll(); //Guardamos datos gruas

    //Consulta datos municipios
    $sql = "
        SELECT 
            gm.rowid as idMunicipio,
            gm.nombre,
            gm.estatus as estatusMunicipio
        FROM
            gr_municipio gm;
    ";
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosMunicipio = $query->fetchAll(); //Guardamos datos municipios

    //Regresamos respuesta
    $respuesta->error = false;
    $respuesta->showSwalNoti = false;
    $respuesta->datosManiobra = $datosManiobra; //Pasamos datos de Maniobra
    $respuesta->datosOperador = $datosOperador; //Pasamos datos de los operadores para Combo
    $respuesta->datosEncargado = $datosEncargado; //Pasamos datos de los encargados para Combo
    $respuesta->datosGrua = $datosGrua; //Pasamos datos de las gruas para Combo
    $respuesta->datosMunicipio = $datosMunicipio; //Pasamos datos de los municipios para Combo

    //Regresamos Bloques de Vistas necesarios para pintado de contenido de Modal Editar Maniobra
    $data->archivo = "../maniobras/vista/ModalEditarManiobra/bloqueSelectEditarManiobra";
    $respuesta->bloqueSelectEditarManiobra = getVista($data);

    //print_r($respuesta); exit;
}

//Funcionalidad que actualiza los datos de Editar Maniobra
if ($data->accion === "guardarEditarManiobra") {
    $sql = "
       UPDATE 
           gr_maniobra 
       SET 
           fkOperador = ?,
           fkEncargado = ?,
           fkGrua = ?,
           fkMunicipio = ?,
           inventario = ?,
           marcaVehiculo = ?,
           modeloVehiculo = ?,
           anoVehiculo = ?,
           placaVehiculo = ?,
           serieVehiculo = ?,
           ubicacion = ?,
           fechaInicio = ?,
           fechaFin = ?,
           costo = ?,
           observaciones = ?,
           color = ?,
           motor = ?,
           remolque = ?,
           serieRemolque = ?,
           placaRemolque = ?,
           segundoRemolque = ?,
           serieSegundoRemolque = ?,
           placaSegundoRemolque = ?,
           dolly = ?,
           serieDolly = ?,
           autoridad = ?,
           motivoRetencion = ?,
           disposicion = ?,
           fechaSalida = ?,
           numFactura = ?,
           costoFinal = ?,
           iva = ?,
           total = ?,
           observacionesFinales = ?,
           estatus = ?
       WHERE 
           rowid = ? 
   ";
    // print_r($sql);
    //exit;
    $query = $pdoconnection->prepare($sql);
    //Declaramos variable querySuccess la cual guardara valor booleano True/False dependiendo si ejecución de consulta es exitosa o marca error
    $querySuccess = $query->execute(array(
        $data->idOperador,
        $data->idEncargado,
        $data->idGrua,
        $data->idMunicipio,
        $data->inventario,
        $data->marcaVehiculo,
        $data->tipoVehiculo,
        $data->modeloVehiculo,
        $data->placaVehiculo,
        $data->serieVehiculo,
        $data->ubicacion,
        $data->fechaInicio,
        $data->fechaFin,
        $data->costo,
        $data->observaciones,
        $data->colorVehiculo,
        $data->motorVehiculo,
        $data->remolque,
        $data->serieRemolque,
        $data->placaRemolque,
        $data->segundoRemolque,
        $data->serieSegundoRemolque,
        $data->placaSegundoRemolque,
        $data->dolly,
        $data->serieDolly,
        $data->autoridad,
        $data->motivoRetencion,
        $data->disposicion,
        $data->fechaSalida,
        $data->numeroFactura,
        $data->costoFinal,
        $data->iva,
        $data->total,
        $data->observacionesFinales,
        $data->estatus,
        $data->idManiobra
    ));

    //Query exitosa
    if ($querySuccess) {
        //Regresamos respuesta exitosa de query
        // $respuesta->accion = $data->accion;
        $respuesta->error = false;
        $respuesta->showSwalNoti = true;
        $respuesta->mensaje = "Datos del depósito editados correctamente.";
        $respuesta->confirmBtn = true;
    } else {
        echo "Error en ejecución de consulta";
    }
}

//Función que devuelve Imágenes de la Maniobra realizada al vehículo, si es que existen
if ($data->accion === "buscarImgVehiculos") {
    $sql = "
        SELECT 
            grm.rowid as idManiobra,
            grm.nombreImagen as img
        FROM
            gr_maniobra grm
        WHERE
            grm.rowid = $data->idManiobra
        ;";

    // print_r($sql); //    exit;

    $query = $pdoconnection->prepare($sql);
    $query->execute();

    //Encontro coincidencia .. existes imágenes
    if ($query->rowCount() > 0) {
        $datosManiobra = $query->fetchAll();
        $idManiobra = $datosManiobra[0]->idManiobra;
        $imgVehiculo = $datosManiobra[0]->img;
        $arrayImg = explode(",", $imgVehiculo); //Pasamos Cadena de Imágenes a Array

        //Regresamos bloques de Vistas necesarios para Modal Img Vehiculos
        $data->archivo = "../maniobras/vista/modalImgVehiculos/bloqueImgVehiculo";
        $respuesta->bloqueImgVehiculo = getVista($data);
        $data->archivo = "../maniobras/vista/modalImgVehiculos/bloqueSliderImgVehiculo";
        $respuesta->bloqueSliderImgVehiculo = getVista($data);

        //Regresamos respuesta 
        $respuesta->accion = $data->accion;
        $respuesta->error = false;
        $respuesta->showSwalNoti = false;
        $respuesta->idManiobra = $idManiobra;
        $respuesta->imgVehiculos = $arrayImg; //Pasamos array Imagenes a Obj respuesta
    }
    // print_r($respuesta); // exit;
}

//Función Modal Ingreso Deposito
if ($data->accion === "getModalIngresoDeposito") {
    //Regresamos respuesta 
    $respuesta->error = false;
    $respuesta->showSwalNoti = false;
    $respuesta->idManiobra = $data->idManiobra; //Regresamos mismo idManiobra proveniente del data de JS
}

//Función guardar datos para Ingreso al Deposito
if ($data->accion === "guardarIngresoDeposito") {
    $sql = "
       UPDATE 
           gr_maniobra 
       SET 
           inventario = ?,
           marcaVehiculo = ?,
           modeloVehiculo = ?,
           anoVehiculo = ?,
           placaVehiculo = ?,
           serieVehiculo = ?,
           color = ?,
           motor = ?,
           remolque = ?,
           serieRemolque = ?,
           placaRemolque = ?,
           segundoRemolque = ?,
           serieSegundoRemolque = ?,
           placaSegundoRemolque = ?,
           dolly = ?,
           serieDolly = ?,
           autoridad = ?,
           motivoRetencion = ?,
           disposicion = ?,
           estatus = ?
       WHERE 
           rowid = ? 
        AND 
           estatus = 1
    ";
    // print_r($sql);
    //exit;
    $query = $pdoconnection->prepare($sql);
    //Declaramos variable querySuccess la cual guardara valor booleano True/False dependiendo si ejecución de consulta es exitosa o marca error
    $querySuccess = $query->execute(array(
        $data->inventario,
        $data->marcaVehiculo,
        $data->tipoVehiculo,
        $data->modeloVehiculo,
        $data->placaVehiculo,
        $data->serieVehiculo,
        $data->colorVehiculo,
        $data->motorVehiculo,
        $data->remolque,
        $data->serieRemolque,
        $data->placaRemolque,
        $data->segundoRemolque,
        $data->serieSegundoRemolque,
        $data->placaSegundoRemolque,
        $data->dolly,
        $data->serieDolly,
        $data->autoridad,
        $data->motivoRetencion,
        $data->disposicion,
        2,
        $data->idManiobra
    ));

    //Query exitosa
    if ($querySuccess) {
        //Regresamos respuesta exitosa de query
        // $respuesta->accion = $data->accion;
        $respuesta->error = false;
        $respuesta->showSwalNoti = true;
        $respuesta->mensaje = "Datos del depósito guardados correctamente.";
        $respuesta->confirmBtn = true;
    } else {
        echo "Error en ejecución de consulta";
    }
}

//Función Modal Salida Deposito
if ($data->accion === "getModalSalidaDeposito") {
    //Regresamos respuesta 
    $respuesta->error = false;
    $respuesta->showSwalNoti = false;
    $respuesta->idManiobra = $data->idManiobra; //Regresamos mismo idManiobra proveniente del data de JS
}

if ($data->accion === "guardarSalidaDeposito") {
    // print_r($data);
    // exit;

    //ACTUALIZAMOS DATOS DE USUARIO en tbl_usuario
    $sql = "
       UPDATE 
           gr_maniobra 
       SET 
           fechaSalida = ?,
           numFactura = ?,
           costoFinal = ?,
           iva = ?,
           total = ?,
           observacionesFinales = ?,
           estatus = ?
       WHERE 
           rowid = ? 
        AND
           estatus = 2
       ";
    // print_r($sql);
    //exit;
    $query = $pdoconnection->prepare($sql);
    $querySuccess = $query->execute(array(
        $data->fechaSalida,
        $data->numeroFactura,
        $data->costoFinal,
        $data->iva,
        $data->total,
        $data->observacionesFinales,
        3,
        $data->idManiobra
    ));

    //Query exitosa
    if ($querySuccess) {
        //Regresamos respuesta exitosa de query
        // $respuesta->accion = $data->accion;
        $respuesta->error = false;
        $respuesta->showSwalNoti = true;
        $respuesta->mensaje = "Datos del depósito guardados correctamente.";
        $respuesta->confirmBtn = true;
    } else {
        echo "Error en ejecución de consulta";
    }
}

if ($data->accion === "getModalRegistroManiobra") {
    $sql = "
         SELECT
             m.rowid as idManiobra,
             m.fkOperador,
             m.otroOperador,
             m.fkEncargado,
             m.otroEncargado,
             m.fkGrua,
             m.otroGrua,
             m.fkMunicipio,
             m.otroMunicipio,
             m.inventario,
             m.marcaVehiculo,
             m.modeloVehiculo,
             m.anoVehiculo,
             m.placaVehiculo,
             m.serieVehiculo,
             m.ubicacion,
             m.fechaInicio,
             m.fechaFin,
             m.costo,
             m.nombreImagen,
             m.observaciones,
             m.fechaRegistro,
             m.color,
             m.motor,
             m.remolque,
             m.serieRemolque,
             m.placaRemolque,
             m.segundoRemolque,
             m.serieSegundoRemolque,
             m.placaSegundoRemolque,
             m.dolly,
             m.serieDolly,
             m.autoridad,
             m.motivoRetencion,
             m.disposicion,
             m.fechaSalida,
             m.numFactura,
             m.costoFinal,
             m.iva,
             m.total,
             m.observacionesFinales,
             m.estatus,
             o.nombre as nombreOperador,
             e.nombre as nombreEncargado,
             g.economico,
             mu.nombre as nombreMunicipio
         FROM
             gr_maniobra m
             LEFT JOIN gr_operador o ON o.rowid = m.fkOperador
             LEFT JOIN gr_encargado e ON e.rowid = m.fkEncargado
             LEFT JOIN gr_grua g ON g.rowid = m.fkGrua
             LEFT JOIN gr_municipio mu ON mu.rowid = m.fkMunicipio
        WHERE
            m.rowid = $data->idManiobra;
    ";

    // print_r($sql);
    // exit;
    $query = $pdoconnection->prepare($sql);
    $query->execute();
    $datosManiobra = $query->fetchAll(); //Guardamos datos Usuario
    foreach ($datosManiobra as $k => $v) {
        $v->estatusOperador = ($v->estatus == 1) ? "Disponible" : "No disponible";
        $v->nombreOperador = ($v->fkOperador == 1) ? $v->otroOperador : $v->nombreOperador;
        $v->nombreEncargado = ($v->fkOperador == 1) ? $v->otroEncargado : $v->nombreEncargado;
        $v->economico = ($v->fkGrua == 1) ? $v->otroGrua : $v->economico;
        $v->nombreMunicipio = ($v->fkMunicipio == 1) ? $v->otroMunicipio : $v->nombreMunicipio;

        if ($v->estatus == 1) {
            $v->estatus = "EN MANIOBRA";
        }
        if ($v->estatus == 2) {
            $v->estatus = "INGRESO AL CORRALON";
        }
        if ($v->estatus == 3) {
            $v->estatus = "SALIO DEL CORRALON";
        }
    }

    //Regresamos respuesta
    $respuesta->error = false;
    $respuesta->showSwalNoti = false;
    $respuesta->datosManiobra = $datosManiobra; //Pasamos datos de Maniobra
    // print_r($respuesta); exit;
}


// --------------------------- CASOS DE OPERADORES ---------------------------

if ($data->accion === "Operadores") {
    // $sql = "
    //         SELECT
    //             m.rowid as idManiobra,
    //             m.fkOperador,
    //             m.otroOperador,
    //             m.fkEncargado,
    //             m.otroEncargado,
    //             m.fkGrua,
    //             m.otroGrua,
    //             m.fkMunicipio,
    //             m.otroMunicipio,
    //             m.inventario,
    //             m.marcaVehiculo,
    //             m.modeloVehiculo,
    //             m.anoVehiculo,
    //             m.placaVehiculo,
    //             m.serieVehiculo,
    //             m.ubicacion,
    //             m.fechaInicio,
    //             m.fechaFin,
    //             m.costo,
    //             m.nombreImagen,
    //             m.observaciones,
    //             m.fechaRegistro,
    //             m.estatus,
    //             o.nombre as nombreOperador,
    //             e.nombre as nombreEncargado,
    //             g.economico,
    //             mu.nombre as nombreMunicipio
    //         FROM
    //             gr_maniobra m
    //             LEFT JOIN gr_operador o ON o.rowid = m.fkOperador
    //             LEFT JOIN gr_encargado e ON e.rowid = m.fkEncargado
    //             LEFT JOIN gr_grua g ON g.rowid = m.fkGrua
    //             LEFT JOIN gr_municipio mu ON mu.rowid = m.fkMunicipio;
    // ";

    // $query = $pdoconnection->prepare($sql);
    // $query->execute();
    // $datosManiobras = $query->fetchAll(); //Guardamos datos Usuario
    // foreach ($datosManiobras as $k => $v) {
    //     $v->estatusOperador = ($v->estatus == 1) ? "Disponible" : "No disponible";
    //     $v->nombreOperador = ($v->fkOperador == 1) ? $v->otroOperador : $v->nombreOperador;
    //     $v->nombreEncargado = ($v->fkOperador == 1) ? $v->otroEncargado : $v->nombreEncargado;
    //     $v->economico = ($v->fkGrua == 1) ? $v->otroGrua : $v->economico;
    //     $v->nombreMunicipio = ($v->fkMunicipio == 1) ? $v->otroMunicipio : $v->nombreMunicipio;
    // }

    //Regresamos bloques de Vistas necesarios para vista Maniobras 
    $data->archivo = "../operadores/vista/mainOperadores";
    $respuesta->mainOperadores = getVista($data);
    // $data->archivo = "../maniobras/vista/bloqueTblManiobras";
    // $respuesta->bloqueTblManiobras = getVista($data);
    // $data->archivo = "../maniobras/vista/modalManiobra";
    // $respuesta->modalManiobra = getVista($data);

    //Regresamos respuesta con datos de cajas y turnos
    $respuesta->accion = $data->accion;
    $respuesta->error = false;
    $respuesta->showSwalNoti = false;
    // $respuesta->datosOperadores = $datosOperadores;
    //print_r($respuesta); exit;
}


if ($data->accion === "Gruas") {
    print_r("ACCIÓN DE GRUAS ... SI LLEGA A PHP");
}

header('Content-type: application/json');
echo (json_encode($respuesta));
