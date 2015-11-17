<?php

//header("Access-Control-Allow-Origin: *");
header("Content-type","application/x-www-form-urlencoded");
//header("Content-Type: application/json; charset=UTF-8");

$uuid=$_GET["uuid"];

// Create connection
$conn = new mysqli("localhost", "root", "faggotmuncher", "bookseller");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//mysql_select_db("bookseller") or die(mysql_error());

$sql = "SELECT userid, useragent, platform, age, email, debrief, referrals, country, vendor, profit, comment FROM users WHERE userid='$uuid'";
$result = $conn->query($sql) or die($sql."<br/><br/>".mysql_error());;
//$user = mysql_result($result, 0);
//$row = mysql_fetch_array($result);
$row = mysqli_fetch_array( $result );
//$country = $data["country"];

//$stmt->execute();

//echo $user;

$user = json_encode($row);

//echo "lel";

echo $user;

//echo "{'useragent' : " + $row["useragent"] + "}";

$conn->close();

?>