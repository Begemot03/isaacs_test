<?php
namespace App\Models;

require_once __DIR__ . '/app/inc/db.php';

use Exception;
use PDO;
use PDOStatement;

class Database 
{
    protected $connection = null;

    public function __construct()
    {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_DATABASE_NAME . ';charset=utf8mb4';
            $opt = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];

            $this->connection = new PDO($dsn, DB_USERNAME, DB_PASSWORD, $opt);
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function select($query = '', $params = []) : array
    {
        try {
            $stmt = $this->execute_statement($query, $params);

            return $stmt->fetchAll();
        } catch(Exception $e) {
            throw New Exception($e->getMessage());
        }
    }

    private function execute_statement($query = '', $params = []) : PDOStatement
    {
        try {
            $stmt = $this->connection->prepare($query);

            if (!empty($params)) {
                foreach ($params as $key => $value) {
                    $stmt->bindValue(':' . $key, $value);
                }
            }

            $stmt->execute();

            return $stmt;
        } catch(Exception $e) {
            throw New Exception($e->getMessage());
        }
    }
}