<?php
require_once "./app/models/Database.php";

class UserModel extends Database 
{
    public function getUsers($limit)
    {
        return $this->select("SELECT * FROM users order by id asc limit ?", ["i", $limit]);
    }
}