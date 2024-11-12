-- database: ../db/db.sqlite

INSERT INTO Users (user_name, Password, e_mail, lvl) VALUES (?, ?, ?, ?);

INSERT INTO Posts (title, link, date, text, likes, dislikes, user_id) VALUES (?, ?, ?, ?, ?, ?, ?);

INSERT INTO Comments (date, corp, likes, dislikes, user_id , post_id) VALUES (?, ?, ?, ?, ?, ?);

SELECT * FROM Posts ORDER BY "date" DESC;

SELECT * FROM Posts WHERE user_id = ?;

SELECT * FROM Posts WHERE link = ?;

SELECT * FROM Comments WHERE post_id = ?;

SELECT
    Posts.id AS post_id,
    Posts.title AS post_title,
    Posts.link AS post_link,
    Posts.date AS post_date,
    Posts.text AS post_text,
    Posts.likes AS post_likes,
    Posts.dislikes AS post_dislikes,
    GROUP_CONCAT(Category.title) AS categories,
    Users.user_name AS user_name
FROM
    Posts
LEFT JOIN Users ON Posts.user_id = Users.id
LEFT JOIN Category_Post ON Posts.id = Category_Post.post_id
LEFT JOIN Category ON Category_Post.category_id = Category.id
GROUP BY Posts.id 
ORDER BY "date" DESC;


SELECT * FROM Category;

SELECT id FROM Posts WHERE link = ?;

SELECT
    Posts.id AS post_id,
    Posts.title AS post_title,
    Posts.link AS post_link,
    Posts.date AS post_date,
    Posts.text AS post_text,
    Posts.likes AS post_likes,
    Posts.dislikes AS post_dislikes,
    GROUP_CONCAT(Category.title) AS categories,
    Users.user_name AS user_name
FROM
    Posts
LEFT JOIN Users ON Posts.user_id = Users.id
LEFT JOIN Category_Post ON Posts.id = Category_Post.post_id
LEFT JOIN Category ON Category_Post.category_id = Category.id
WHERE post_link = ?;


SELECT likes FROM Posts WHERE id = ?;

SELECT dislikes FROM Posts WHERE id = ?;


SELECT
    Posts.id AS post_id,
    Posts.title AS post_title,
    Posts.link AS post_link,
    Posts.date AS post_date,
    Posts.text AS post_text,
    Posts.likes AS post_likes,
    Posts.dislikes AS post_dislikes,
    GROUP_CONCAT(DISTINCT Category.title) AS categories,
    Users.user_name AS user_name
FROM
    Posts
LEFT JOIN Users ON Posts.user_id = Users.id
LEFT JOIN Category_Post ON Posts.id = Category_Post.post_id
LEFT JOIN Category ON Category_Post.category_id = Category.id
WHERE ',' || Posts.likes || ',' LIKE '%,1,%'
GROUP BY Posts.id;

