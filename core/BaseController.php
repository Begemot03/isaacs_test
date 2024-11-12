<?php

namespace Core;

abstract class BaseController
{
    protected Router $router;

    public function __construct(Router $router)
    {
        $this->router = $router;
        $this->defineEndpoints();
    }

    // Метод для определения эндпоинтов
    abstract protected function defineEndpoints(): void;

    // Метод для регистрации маршрута в Router
    protected function registerEndpoint(string $method, string $path, string $action): void
    {
        $this->router->register($method, $path, static::class, $action);
    }

    public function json($data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    public function error($msg, int $statusCode = 503): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode(['error' => $msg]);
    }
}
