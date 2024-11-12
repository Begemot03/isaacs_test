<?php
namespace App\Controllers;

use Core\BaseController;

class TaskController extends BaseController
{
    protected function defineEndpoints(): void
    {
        $this->registerEndpoint('GET', '/task', 'getAllTasks');
        $this->registerEndpoint('POST', '/task', 'createTask');
        $this->registerEndpoint('PUT', '/task', 'updateTask');
        $this->registerEndpoint('DELETE', '/task', 'deleteTask');
        $this->registerEndpoint('GET', '/task/1', 'getTask');
    }

    public function getAllTasks()
    {

    }

    public function createTask()
    {

    }

    public function deleteTask()
    {

    }

    public function updateTask()
    {

    }

    public function getTask()
    {

    }

    private function defineUser()
    {
        
    }
}