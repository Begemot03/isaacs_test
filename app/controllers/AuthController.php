<?php
namespace App\Controllers;


use App\Models\UserModel;
use Core\BaseController;
use Core\Request;

class AuthController extends BaseController
{
    protected function defineEndpoints(): void
    {
        $this->registerEndpoint('POST', '/auth/login', 'login');
        $this->registerEndpoint('POST', '/auth/registration', 'registration');
    }

    public function login(Request $request): void
    {
        $userModel = new UserModel();
        $username = $request->body['username'];
        $password = $request->body['password'];

        if(!$this->isBodyValide()) {
            $this->error('Invalid password or username', 401);
            return;
        }

        if(!$userModel->isUserExist($username)) {
            $this->error('Invalid password or username', 401);
            return;
        }

        $user = $userModel->getUser($username);

        if(!password_verify($password, $user['password'])) {
            $this->error('Invalid password or username', 401);
            return;
        }
        
        $this->addUserToSession($user);
        $this->json($user);
    }

    public function registration(Request $request): void
    {
        $userModel = new UserModel();
        $username = $request->body['username'];
        $password = $request->body['password'];

        if(!$this->isBodyValide()) {
            $this->error('Invalid password or username', 401);
            return;
        }

        if($userModel->isUserExist($username)) {
            $this->error('user already exist', 409);
            return;
        }

        $hashPassword = password_hash($password, null);

        $userModel->createNewUser($username, $hashPassword);

        $user = $userModel->getUser($username);

        $this->addUserToSession($user);
        $this->json($user);
    }

    private function isBodyValide(): bool 
    {
        return !isset($password) || !isset($username); 
    }

    private function addUserToSession(array $user): void 
    {
        $_SESSION['username'] = $user['username'];
        $_SESSION['id'] = $user['id'];
    }
}
