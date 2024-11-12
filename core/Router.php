<?php

namespace Core;

use Exception;

class Router
{
    private array $routes = [];

    public function register(string $method, string $path, string $controller, string $action): void
    {
        // Подготовка шаблона для динамических параметров, таких как /task/{id}
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<\1>[^/]+)', $path);
        $this->routes[strtoupper($method)][$pattern] = [
            'controller' => $controller,
            'action' => $action
        ];
    }

    public function resolve(Request $request)
    {
        $method = $request->method;
        $path = $request->path;

        if (isset($this->routes[$method])) {
            foreach ($this->routes[$method] as $pattern => $route) {
                if (preg_match("#^$pattern$#", $path, $matches)) {
                    $controllerName = $route['controller'];
                    $action = $route['action'];
                    
                    if (class_exists($controllerName)) {
                        $controllerInstance = new $controllerName($this);

                        if (method_exists($controllerInstance, $action)) {
                            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                            
                            return call_user_func([$controllerInstance, $action], $request, ...$params);
                        }
                    }

                    http_response_code(404);
                    echo json_encode(["error" => "Action not found"]);
                    return;
                }
            }
        }
        
        http_response_code(404);
        echo json_encode(["error" => "Not Found"]);
    }
}
