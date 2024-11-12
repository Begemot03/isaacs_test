<?php
namespace App\Controllers;

use App\Models\TaskModel;
use Core\BaseController;
use Core\Request;

enum TaskStatus: string 
{
    case COMPLETE = 'complete';
    case PENDING = 'pending';
}

class TaskController extends BaseController
{
    
    protected function defineEndpoints(): void
    {
        $this->registerEndpoint('GET', '/task', 'getAllTasks');
        $this->registerEndpoint('POST', '/task', 'createTask');
        $this->registerEndpoint('PUT', '/task/{id}', 'updateTask');
        $this->registerEndpoint('DELETE', '/task/{id}', 'deleteTask');
        $this->registerEndpoint('GET', '/task/{id}', 'getTask');
    }

    public function getAllTasks()
    {
        $taskModel = new TaskModel();
        $userId = $this->getUserId();

        if($userId == -1) {
            $this->error('Missing authentication', 403);
            return;
        }

        $this->json($taskModel->getTasks($userId));
    }

    public function createTask(Request $request)
    {
        $taskModel = new TaskModel();
        $userId = $this->getUserId();

        if($userId == -1) {
            $this->error('Missing authentication', 403);
            return;
        }

        if($this->noTitle($request->body['title'])) {
            $this->error('Missing post body values', 422);
            return;
        }

        $task['title'] = $request->body['title'];
        $task['status'] = TaskStatus::tryFrom($request->body['status'])->value ?? TaskStatus::PENDING->value;

        $newTask = $taskModel->createNewTask($task, $userId);

        $this->json($newTask, 201);
    }

    public function deleteTask(Request $request, $id)
    {
        $taskModel = new TaskModel();
        $userId = $this->getUserId();

        if($userId == -1) {
            $this->error('Missing authentication', 403);
        }

        $taskModel->deleteTask($id, $userId);

        $this->ok(true, 204);
    }

    public function updateTask(Request $request, $id)
    {
        $taskModel = new TaskModel();
        $userId = $this->getUserId();

        if($userId == -1) {
            $this->error('Missing authentication', 403);
        }

        $prevTaskState = $taskModel->getTask($id, $userId);
        $task['title'] = $request->body['title'] ?? $prevTaskState['title'];
        $task['status'] = TaskStatus::tryFrom($request->body['status'])->value ?? $prevTaskState['status'];
        $task['id'] = $id;

        $taskModel->updateTask($task, $userId);

        $this->ok(true, 200);
    }

    public function getTask(Request $request, $id)
    {
        $taskModel = new TaskModel();
        $userId = $this->getUserId();

        if($userId == -1) {
            $this->error('Missing authentication', 403);
        }

        $task = $taskModel->getTask($id, $userId);

        if(!$task) {
            return $this->error('Not found', 404);
        }

        $this->json($task);
    }

    private function noTitle($title): bool
    {
        return empty(trim($title ?? ''));
    }

    private function getUserId(): int
    {
        if(!isset($_SESSION['id']) || !$_SESSION['username']) return -1;

        return $_SESSION['id'];
    }
}