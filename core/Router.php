<?php

namespace Core;

class Router
{
    private array $routes = [];

    public function register(string $method, string $path, string $controller, string $action): void
    {
        $this->routes[strtoupper($method)][$path] = [
            'controller' => $controller,
            'action' => $action
        ];
    }

    public function resolve(Request $request)
    {
        $method = $request->method;
        $path = $request->path;

        if (isset($this->routes[$method][$path])) {
            $route = $this->routes[$method][$path];
            $controllerName = $route['controller'];
            $action = $route['action'];
            
            if (class_exists($controllerName)) {
                $controllerInstance = new $controllerName($this);
                
                if (method_exists($controllerInstance, $action)) {
                    return call_user_func([$controllerInstance, $action], $request);
                }
            }

            http_response_code(404);
            echo json_encode(["error" => "Action not found"]);
            return;
        }

        http_response_code(404);
        echo json_encode(["error" => "Not Found"]);
    }
}
