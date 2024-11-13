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

function main()
{
    // Если запрос на корневую страницу
    if ($_SERVER['REQUEST_URI'] == '/') {
        require __DIR__ . '/public/index.html'; 
        return;
    }

    // Проверяем, что запрос к api
    if (strpos($_SERVER['REQUEST_URI'], '/api') === 0) {
        // Проверка что запросы идут с клиента
        if (!isset($_SERVER['HTTP_ORIGIN']) && !isset($_SERVER['HTTP_REFERER'])) {
            header('Location: /');
            return;
        }
    } else {
        header('Location: /');
        return;
    }

    $router = new Router();

    new AuthController($router);
    new TaskController($router);

    $request = new Request();

    $router->resolve($request);
}

main();
