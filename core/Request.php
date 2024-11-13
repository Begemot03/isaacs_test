<?php
namespace Core;


/**
 * Отвечает за информацию о запросе
 * Хранит в себе информацию о методе, пути и тело запроса
 */
class Request
{
    public string $method;
    public string $path;
    public array $body;

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD']);
        $this->path = strtok($_SERVER['REQUEST_URI'] ?? '/', '?');
        $this->body = json_decode(file_get_contents('php://input'), true) ?? [];
    }
}