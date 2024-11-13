# Для проверки онлайн
[andrepetr3.temp.swtest.ru](andrepetr3.temp.swtest.ru)

# Разворачивание на локальной машине

1. Клонируете репозиторий
2. Создаете бд и 2 таблицы users и tasks
    ```
        CREATE TABLE users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE tasks (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(100) NOT NULL,
            status VARCHAR(10) NOT NULL,
            creationTS TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            userId INT,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    ```
3. В файле app/inc/db.php, записываете данные для подключения к бд
4. В php.ini нужно раскомментировать следующие расширения
    ```
        extension=pdo_mysql
    ```
5. Запускаете сервер командой php -S localhost:<ваш-порт>