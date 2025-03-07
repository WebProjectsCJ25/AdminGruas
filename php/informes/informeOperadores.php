<?php

include_once('../../php/connection.php');
include_once("../../php/SimpleXLSXGen.php");
//query
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
$datosOperadores = $query->fetchAll(); //Guardamos datos operadores
foreach ($datosOperadores as $k => $v) {
    $v->estatusOperador = ($v->estatus == 1) ? "Disponible" : "No disponible"; //Agregamos estatus operador
}

//Llamamos class de SimpleXLSXGen
$SimpleXLSXGen = new SimpleXLSXGen();

$informeArray = [ // Los datos deben organizarse en el mismo orden
    ['Id', 'Nombre', 'Estatus', 'Estatus Operador'], // headers del excel
];
// Construimos los datos
foreach ($datosOperadores as $kOp => $vOp) {
    // Array nuevo para cada iteracion
    $arrayProv = [
        $vOp->idOperador,
        $vOp->nombre,
        $vOp->estatus,
        $vOp->estatusOperador
    ];
    // Agregamos este al principal
    array_push($informeArray, $arrayProv);
}
$fechaActual = date('Y-m-d');
$xlsx = $SimpleXLSXGen->fromArray($informeArray);
$xlsx->downloadAs("operadores-$fechaActual.xlsx"); // generamos el xls
