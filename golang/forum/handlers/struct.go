package handlers

const (
	Insert_User             = 2
	Insert_Post             = 4
	Insert_Comment          = 6
	SelectAllPosts          = 8
	Select_User_Posts       = 10
	Select_Link_Post        = 12
	Select_Link_Comment     = 14
	Select_Post_Join_Start  = 16
	Select_Post_Join_End    = 33
	Select_Post2_Join_Start = 39
	Select_Post2_Join_End   = 56
	Select_LikesStart       = 62
	Select_LikesEnd         = 79
)

var (
	Posts      []Post
	Comments   []Comment
	Categories []Category
)

type Session struct {
	UserID        int
	Username      string
	Authenticated bool
	// ... autres champs si nécessaire ...
}
type UserExistence struct {
	UsernameExists bool
	EmailExists    bool
}
type User struct {
	Id       int
	Password string
	Username string
	Email    string
	Lvl      string
}

type Post struct {
	Id         int
	Link       string
	Title      string
	Date       string
	Text       string
	Likes      []string
	Dislikes   []string
	Categories string
	User_name  string
}
type Comment struct {
	Id       int
	Date     string
	Text     string
	Likes    []string
	Dislikes []string
	User_id  int
	Post_id  int
}
type Data struct {
	Session    Session
	Posts      []Post
	Comments   []Comment
	Categories []Category
}
type Category struct {
	id    int
	Title string
}

// type LikesPost struct {
// 	ID    int
// 	Title string
// 	// autres champs du post
// }
