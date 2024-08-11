package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/thedevsaddam/renderer"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var db *mgo.Database
var rnd *renderer.Render

const (
	hostName       string = "localhost:27017"
	dbName         string = "go-todo"
	collectionName string = "todo"
	port           string = "8000"
)

type (
	todoModel struct {
		Id        bson.ObjectId `bson:"_id,omitempty"`
		Title     string        `bson:"title"`
		Completed bool          `bson:"completed"`
		CreateAt  time.Time     `bson:"createdAt"`
	}

	todo struct {
		Id        string    `json:"id"`
		Title     string    `json:"title"`
		Completed bool      `json:"completed"`
		CreateAt  time.Time `json:"created_at"`
	}
)

func init() {
	rnd = renderer.New()
	sess, err := mgo.Dial(hostName)

	checkErr(err)

	sess.SetMode(mgo.Monotonic, true)
	db = sess.DB(dbName)
}

func main() {
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Get("/", homeHandler)
	router.Mount("/todo", todoHandlers())

	srv := &http.Server{
		Handler: router,
		Addr:    port,
	}

	fmt.Printf("Server started on port: %v", port)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func todoHandlers() http.Handler {
	rg := chi.NewRouter()
	rg.Group(func(r chi.Router) {
		r.Get("/", fetchTodos)
		r.Post("/", createTodo)
		r.Put("/{id}", updateTodo)
		r.Delete("/{id}", deleteTodo)
	})

	return rg
}


// handlers

func homeHandler(w http.ResponseWriter, r *http.Request){

}

func fetchTodos(w http.ResponseWriter, r *http.Request){

}

func createTodo(w http.ResponseWriter, r *http.Request){

}

func updateTodo(w http.ResponseWriter, r *http.Request){

}

func deleteTodo(w http.ResponseWriter, r *http.Request){

}


func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
