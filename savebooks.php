<?php

//header("Access-Control-Allow-Origin: *");
header("Content-type","application/x-www-form-urlencoded");
//header("Content-Type: application/json; charset=UTF-8");

$data=json_decode($_POST["stats"], true);
$length = count($data);

// Create connection
$conn = new mysqli("localhost", "root", "faggotmuncher", "bookseller");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// prepare and bind
$stmt = $conn->prepare("INSERT INTO sales (userid, bookid, sellprice, readtime, externaltouchtime, externaltouches, internaltouchtime, internaltouches, sound) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sidiiiiii", $userid, $bookid, $sellprice, $readtime, $externaltouchtime, $externaltouches, $internaltouchtime, $internaltouches, $sound);

						/*
						"c_colour" : 0,
						"c_border" : "",
						"c_titlebox" : "",
						"c_blurb" : "",
						"c_circle" : ""
						*/

for ($x = 0; $x < $length; $x++) {
    //echo "The number is: $x <br>";
	
	/*echo $x;
	
	echo $data[$x]["bookid"];
	echo "\n";
	echo $data[$x]["sellprice"];	
	echo "\n";
	echo $data[$x]["readtime"];	
	echo "\n";
	echo $data[$x]["externaltouchtime"];	
	echo "\n";
	echo $data[$x]["externaltouches"];	
	echo "\n";
	echo $data[$x]["internaltouchtime"];	
	echo "\n";
	echo $data[$x]["internaltouches"];
	echo "\n";
	
	echo "-----------------\n";*/
	
	$userid = $conn->real_escape_string($data[$x]["userid"]);
	$bookid = $data[$x]["bookid"];
	$sellprice = $data[$x]["sellprice"];
	$readtime = $data[$x]["readtime"];
	$externaltouchtime = $data[$x]["externaltouchtime"];
	$externaltouches = $data[$x]["externaltouches"];
	$internaltouchtime = $data[$x]["internaltouchtime"];
	$internaltouches = $data[$x]["internaltouches"];
	$sound = $data[$x]["sound"];

	$stmt->execute();
} 

echo "New records created successfully";

//echo $_SERVER['REMOTE_ADDR'];

$stmt->close();
$conn->close();
?>