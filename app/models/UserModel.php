<?php
namespace App\Models;
require_once __DIR__ . '/Database.php';

class UserModel extends Database 
{
    public function getUser($username): array
    {
        $user = $this->select('select * from users where username=:username;', ['username' => $username]);
        return ($user[0] ?? []);
    }

    public function isUserExist($username) : bool
    {
        return count($this->getUser($username)) > 0;
    }

    public function createNewUser($username, $password)
    {
        return $this->select('insert into users(username, password) values(:username, :password)', ['username' => $username, 'password' => $password]);
    }

    public function getUsers() 
    {
        return $this->select('select * from users');
    }
}