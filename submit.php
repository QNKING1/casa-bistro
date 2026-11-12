<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$date = trim($_POST['date'] ?? '');
$time = trim($_POST['time'] ?? '');
$guests = trim($_POST['guests'] ?? '');
$seating = trim($_POST['seating'] ?? '');
$note = trim($_POST['note'] ?? '');

if ($name === '' || $phone === '' || $date === '' || $time === '' || $guests === '' || $seating === '') {
    http_response_code(400);
    exit('Please complete all required fields.');
}

$message = "Reservation request:\nName: {$name}\nPhone: {$phone}\nDate: {$date}\nTime: {$time}\nGuests: {$guests}\nSeating: {$seating}\nNote: {$note}";

mail('hello@casabistro.example', 'New reservation request', $message, "From: no-reply@casabistro.example\r\nReply-To: {$phone}\r\n");

header('Location: index.html');
