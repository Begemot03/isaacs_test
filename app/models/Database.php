<?php

class Database 
{
    protected $connection = null;

    public function __construct()
    {
        try {
            $this->connection = new mysqli("localhost", "root", "Begemot03", "isaacs_test", 50923);

            if(mysqli_connect_errno()) {
                throw new Exception("Could not connect to database");
            }
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function select($query = "", $params = [])
    {
        try {
            $stmt = $this->execute_statement($query, $params);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            return $result;
        } catch(Exception $e) {
            throw New Exception($e->getMessage());
        }

        return false;
    }

    private function execute_statement($query = "", $params = "") 
    {
        try {
            $stmt = $this->connection->prepare($query);

            if($stmt == false) {
                throw New Exception("Unable to prepare statement" . $query);
            }

            if($params) {
                $stmt->bind_param($params[0], $params[1]);
            }

            $stmt->execute();

            return $stmt;
        } catch(Exception $e) {
            throw New Exception($e->getMessage());
        }
    }
}