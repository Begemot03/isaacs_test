<?php
namespace App\Models;
require_once __DIR__ . '/app/models/Database.php';

class UserModel extends Database 
{
    public function getUser($username)
    {
        return $this->select('select * from users where username=:username;', ['username' => $username]);
    }

    public function isUserExist($username) : bool
    {
        return count($this->getUser($username)) == 0;
    }

    public function createNewUser($limit)
    {
        return $this->select('select * from users where id=:id;', ['id' => $limit]);
    }
}