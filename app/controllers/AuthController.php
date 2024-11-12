<?php

namespace App\Controllers;

use Core\BaseController;
use Core\Request;

class AuthController extends BaseController
{
    protected function defineEndpoints(): void
    {
        $this->registerEndpoint('POST', '/auth/login', 'login');
        $this->registerEndpoint('POST', '/auth/registration', 'registration');
    }

    public function login(Request $request)
    {

        echo $request->body['username'] . ' ' . $request->body['password'];
    }

    public function registration(Request $request)
    {
        echo 'registration';
    }
}
