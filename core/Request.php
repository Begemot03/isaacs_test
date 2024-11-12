<?php
namespace Core;

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