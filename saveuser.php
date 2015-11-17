<?php

//header("Access-Control-Allow-Origin: *");
header("Content-type","application/x-www-form-urlencoded");
//header("Content-Type: application/json; charset=UTF-8");

$data=json_decode($_POST["user"], true);
$length = count($data);

// Create connection
$conn = new mysqli("localhost", "root", "faggotmuncher", "bookseller");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// prepare and bind
$stmt = $conn->prepare("INSERT INTO users (userid, useragent, platform, age, email, debrief, referrals, country, profit, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssisiisds", $userid, $useragent, $platform, $age, $email, $debrief, $referrals, $country, $profit, $comment);
	
$userid = $conn->real_escape_string($data["userid"]);
$useragent = $conn->real_escape_string($data["useragent"]);
$platform = $conn->real_escape_string($data["platform"]);
$age = "";
$email = "";
$debrief = 0;
$referrals = 0;
$country = $conn->real_escape_string($data["country"]);
$profit = $data["profit"];
$comment = "";

$stmt->execute();

echo "New records created successfully";

$stmt->close();
$conn->close();

?>