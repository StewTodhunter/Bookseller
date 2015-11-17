<?php

//header("Access-Control-Allow-Origin: *");
header("Content-type","application/x-www-form-urlencoded");
//header("Content-Type: application/json; charset=UTF-8");

$data=json_decode($_POST["user"], true);
//$length = count($data);

// Create connection
$conn = new mysqli("localhost", "root", "faggotmuncher", "bookseller");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//echo $data;

// prepare and bind
//$stmt = $conn->prepare("INSERT INTO users (userid, useragent, platform, age, email, debrief, referrals, country, profit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
//$stmt->bind_param("sssssiisd", $userid, $useragent, $platform, $age, $email, $debrief, $referrals, $country, $profit);

$userid = $conn->real_escape_string($data['userid']);
$age = $data['age'];
$email = $conn->real_escape_string($data['email']);
$debrief = $data['debrief'];
$referrals = $data['referrals'];
$vendor = $conn->real_escape_string($data['vendor']);
$comment = $conn->real_escape_string($data['comment']);
$profit = $data['profit'];

$sql = "UPDATE users SET age='$age', email='$email', debrief='$debrief', referrals='$referrals', vendor='$vendor', comment='$comment', profit='$profit' WHERE userid='$userid'";
	
if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}
	
$conn->close();

?>