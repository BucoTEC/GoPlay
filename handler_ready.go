package main

import (
	"net/http"
)

func handlerReady(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, struct{ msg string }{msg: "hello from go chi"})
}
