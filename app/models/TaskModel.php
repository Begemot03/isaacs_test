<?php
namespace App\Models;

class TaskModel extends Database 
{
    public function getTask($taskId, $userId): array
    {
        $task = $this->select('select id, title, status, creationTS from tasks where userId=:userId and id=:taskId;', ['userId' => $userId, 'taskId' => $taskId]);
        return ($task[0] ?? []);
    }

    public function createNewTask(array $task, int $userId): array
    {
        $this->select('insert into tasks (title, status, userId) values (:title, :status, :userId);', [
            'title' => $task['title'],
            'status' => $task['status'],
            'userId' => $userId,
        ]);

        return $this->select('select id, title, status, creationTS from tasks where id=LAST_INSERT_ID();');
    }

    public function updateTask(array $task, int $userId): void
    {
        $this->select('update tasks set title=:title, status=:status where id=:taskId and userId=:userId;', [
            'title' => $task['title'],
            'status' => $task['status'],
            'taskId' => $task['id'],
            'userId' => $userId
        ]);
    }

    public function getTasks($userId): array
    {
        $tasks = $this->select('select id, title, status, creationTS from tasks where userId=:userId;', ['userId' => $userId]);
        return ($tasks ?? []);
    }

    public function deleteTask($taskId, $userId): void
    {
        $this->select('delete from tasks where id=:taskId and userId=:userId;', ['taskId' => $taskId, 'userId' => $userId]);
    }
}