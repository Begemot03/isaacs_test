<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch($uri) {
    case '/':
        require 'public/index.php';
        break;
    default:
        require str_replace("api", "app", $uri);
        break;
}