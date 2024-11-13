# Для проверки онлайн
[andrepetr3.temp.swtest.ru](andrepetr3.temp.swtest.ru)

# Инструкция по разворачиванию проекта на локальной машине

1. Клонировать репозиторий на локальный компьютер.
2. Создать базу данных и две таблицы users и tasks. Для этого можно использовать следующий sql-запрос:
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
3. В файле app/inc/db.php указать данные для подключения к базе данных.
4. В файле php.ini раскомментировать следующие расширение:
    ```
        extension=pdo_mysql
    ```
5. Запустить сервер с помощью команды php -S localhost:<ваш-порт>.