<?php
$dns = "mysql:host=localhost;dbname=test";
$user = "root";
$pass = "";
$config = [
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
];
try {
	$pdoconnection = new PDO($dns, $user, $pass, $config);
	$pdoconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	//echo "<script type='text/javascript'>alert('Connection ready (:');</script>";
} catch (PDOException $e) {
	print "¡Error!: " . $e->getMessage() . "</br>";
	die();
}
