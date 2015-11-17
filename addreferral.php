<?php

//header("Access-Control-Allow-Origin: *");
header("Content-type","application/x-www-form-urlencoded");
//header("Content-Type: application/json; charset=UTF-8");

$uuid=$_POST["uuid"];
//$length = count($data);

// Create connection
$conn = new mysqli("localhost", "root", "faggotmuncher", "bookseller");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//echo $data;

// prepare and bind
//$stmt = $conn->prepare("INSERT INTO users (userid, useragent, platform, age, email, debrief, raffle, country, profit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
//$stmt->bind_param("sssssiisd", $userid, $useragent, $platform, $age, $email, $debrief, $raffle, $country, $profit);

/*$userid = $data['userid'];
$age = $data['age'];
$email = $data['email'];
$debrief = $data['debrief'];
$referals = $data['referrals'];
$vendor = $data['vendor'];*/

$sql = "UPDATE users SET referrals = referrals + 1 WHERE userid='$uuid'";
	
if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}
	
$conn->close();

?>