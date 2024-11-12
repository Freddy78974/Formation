-- DROP TABLE IF EXISTS Users;
PRAGMA foreign_key = ON;
	CREATE TABLE IF NOT EXISTS Users (
		id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, 
		password VARCHAR(150), 
		user_name VARCHAR(150) UNIQUE NOT NULL, 
		e_mail VARCHAR(150) NOT NULL, 
		lvl VARCHAR(150)
	);
	-- DROP TABLE IF EXISTS Posts;
	CREATE TABLE IF NOT EXISTS Posts (
		id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, 
		title VARCHAR(150) NOT NULL, 
		slug VARCHAR(150) NOT NULL, 
		date DATETIME,
		text TEXT NOT NULL, 
		likes text, 
		dislikes text, 
		user_id INTEGER NOT NULL, 
		FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
	);
	-- DROP TABLE IF EXISTS Comments;
	CREATE TABLE IF NOT EXISTS Comments (
		id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, 
		date DATETIME, 
		text TEXT NOT NULL, 
		likes text, 
		dislikes text, 
		user_id INTEGER NOT NULL, 
		post_id INTEGER NOT NULL, 
		FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, 
		FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE
	);
	-- DROP TABLE IF EXISTS Category;
    CREATE TABLE IF NOT EXISTS Category (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT, 
        title VARCHAR(150) NOT NULL
    );
	-- DROP TABLE IF EXISTS Category_Post;
    CREATE TABLE IF NOT EXISTS Category_Post (
        category_id INTEGER NOT NULL, 
        post_id INTEGER NOT NULL, 
        FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE, 
        FOREIGN KEY (post_id) REFERENCES Posts(id) on DELETE CASCADE, 
        PRIMARY KEY (category_id, post_id), 
        UNIQUE (category_id, post_id) 
    );