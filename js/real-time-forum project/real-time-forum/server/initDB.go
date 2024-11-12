package server

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

const dataSourceName = "./db/rtf.db"

func InitDB() (*sql.DB, error) {

	args := os.Args[1:]
	for _, arg := range args {
		if arg == "clearDB" {
			if _, err := os.Stat(dataSourceName); err == nil {
				e := os.Remove(dataSourceName)
				if e != nil {
					log.Fatal(e)
				}
			}
		}
	}

	db, err := sql.Open("sqlite3", dataSourceName)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	createUsersTableSQL := `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        gender TEXT NOT NULL,
        custom_gender TEXT,
        mail TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
	_, err = db.Exec(createUsersTableSQL)
	if err != nil {
		return nil, err
	}

	createPostForumTableSQL := `CREATE TABLE IF NOT EXISTS post_forum (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        categories TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        slug TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (categories) REFERENCES forum_categorie (id)
    );`
	_, err = db.Exec(createPostForumTableSQL)
	if err != nil {
		return nil, err
	}

	createChatMessageTableSQL := `CREATE TABLE IF NOT EXISTS chat_message (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_user_id INTEGER NOT NULL,
		receiver_user_id INTEGER NOT NULL,
		message TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_user_id) REFERENCES users (id),
        FOREIGN KEY (receiver_user_id) REFERENCES users (id)
    );`
	_, err = db.Exec(createChatMessageTableSQL)
	if err != nil {
		return nil, err
	}

	createForumCategorieTableSQL := `CREATE TABLE IF NOT EXISTS forum_categorie (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categories_name TEXT NOT NULL
    );`
	_, err = db.Exec(createForumCategorieTableSQL)
	if err != nil {
		return nil, err
	}

	createForumCommentTableSQL := `CREATE TABLE IF NOT EXISTS forum_comment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (post_id) REFERENCES post_forum (id)
    );`
	_, err = db.Exec(createForumCommentTableSQL)
	if err != nil {
		return nil, err
	}

	addDefaultCategory := `INSERT INTO forum_categorie (categories_name) VALUES ("Sport")`
	_, err = db.Exec(addDefaultCategory)
	if err != nil {
		return nil, err
	}
	//Modifier si vous voulez flemme de trouver une vrai categorie
	addDefaultCategory = `INSERT INTO forum_categorie (categories_name) VALUES ("Astuces")`
	_, err = db.Exec(addDefaultCategory)
	if err != nil {
		return nil, err
	}
	addDefaultCategory = `INSERT INTO forum_categorie (categories_name) VALUES ("Jeu vidéo")`
	_, err = db.Exec(addDefaultCategory)
	if err != nil {
		return nil, err
	}
	//Modifier si vous voulez flemme de trouver une vrai categorie
	addDefaultCategory = `INSERT INTO forum_categorie (categories_name) VALUES ("Cuisine")`
	_, err = db.Exec(addDefaultCategory)
	if err != nil {
		return nil, err
	}
	addDefaultCategory = `INSERT INTO forum_categorie (categories_name) VALUES ("Dev")`
	_, err = db.Exec(addDefaultCategory)
	if err != nil {
		return nil, err
	}
	return db, nil
}
