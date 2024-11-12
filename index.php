<?php
use App\Controllers\AuthController;
use Core\Request;
use Core\Router;

require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/core/BaseController.php';
require_once __DIR__ . '/core/Request.php';
require_once __DIR__ . '/app/controllers/AuthController.php';

session_start();

$router = new Router();

new AuthController($router);

$request = new Request();
$router->resolve($request);