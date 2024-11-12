<?php
use App\Controllers\AuthController;
use App\Controllers\TaskController;
use Core\Request;
use Core\Router;

require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/core/BaseController.php';
require_once __DIR__ . '/core/Request.php';
require_once __DIR__ . '/app/models/Database.php';
require_once __DIR__ . '/app/models/UserModel.php';
require_once __DIR__ . '/app/models/TaskModel.php';
require_once __DIR__ . '/app/controllers/AuthController.php';
require_once __DIR__ . '/app/controllers/TaskController.php';

session_start();


$router = new Router();

new AuthController($router);
new TaskController($router);

$request = new Request();

$router->resolve($request);