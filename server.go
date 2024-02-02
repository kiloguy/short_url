package main

import (
	"database/sql"
	"fmt"
	"math/rand"
	"strings"
	"net/http"
	"io"
	"os"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB
var indexHtml []byte
var indexJs []byte
var indexCss []byte

type Mux struct {}

func (m Mux) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		if req.URL.Path == "/" {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Write(indexHtml)
		} else if req.URL.Path == "/index.js" {
			w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
			w.Write(indexJs)
		} else if req.URL.Path == "/index.css" {
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
			w.Write(indexCss)
		} else {
			if len(req.URL.Path) == 7 {
				url, isNotFound := findURL(req.URL.Path[1:])
				fmt.Println(url, isNotFound)

				if isNotFound {
					m.MakeTextResponse(w, 400, "找不到請求的短網址")
				} else if url == "" {
					m.MakeTextResponse(w, 500, "資料庫發生錯誤")
				} else {
					http.Redirect(w, req, url, 301)
				}
			} else {
				m.MakeTextResponse(w, 400, "找不到請求的短網址")
			}
		}
	} else if req.Method == "POST" {
		if req.URL.Path == "/new" {
			urlBytes, err := io.ReadAll(req.Body)

			if err != nil {
				m.MakeTextResponse(w, 500, "伺服器發生錯誤")
				return
			}

			url := testURL(string(urlBytes))

			if url == "" {
				m.MakeTextResponse(w, 400, "無效的網址")
				return
			}

			id, isNotFound := findID(url)

			if isNotFound {
				id := insertURL(url)

				if id == "" {
					m.MakeTextResponse(w, 500, "資料庫發生錯誤")
				} else {
					m.MakeTextResponse(w, 200, id + url)
				}
			} else if url == "" {
				m.MakeTextResponse(w, 500, "資料庫發生錯誤")
			} else {
				m.MakeTextResponse(w, 200, id + url)
			}
		} else {
			m.MakeTextResponse(w, 400, "400 Bad Request")
		}
	} else {
		m.MakeTextResponse(w, 405, "405 Method Not Allowed")
	}
}

func (m Mux) MakeTextResponse(w http.ResponseWriter, code int, body string) {
	w.WriteHeader(code)
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Write([]byte(body))
}

// Return "" if url is invalid.
func testURL(url string) string {
	if strings.HasPrefix(url, "https://") || strings.HasPrefix(url, "http://") {
		return url
	}

	if _, err := http.Head("https://" + url); err == nil {
		return "https://" + url
	}

	if _, err := http.Head("http://" + url); err == nil {
		return "http://" + url
	}

	return ""
}

// Return "" if error occurs.
func insertURL(url string) string {
	chars := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
	id := ""

	for i := 0; i < 6; i++ {
		index := rand.Intn(len(chars))

		id += chars[index:index + 1]
	}

	_, err := db.Exec("INSERT INTO urls(id, url) values(?, ?)", id, url)

	if err != nil {
		return ""
	}

	return id
}

// When targetValue is "", means row not found if isNotFound, otherwise is some error occurs.
func find(source string, target string, sourceValue string) (targetValue string, isNotFound bool) {
	rows, err := db.Query("SELECT " + target + " FROM urls WHERE " + source + " = ?", sourceValue)

	if err != nil {
		return "", false
	}

	defer rows.Close()

	if rows.Next() {
		targetValue := ""

		if err := rows.Scan(&targetValue); err != nil {
			return "", false
		}

		return targetValue, false
	}

	if err := rows.Err(); err != nil {
		return "", false
	}

	return "", true
}

func findURL(id string) (string, bool) {
	return find("id", "url", id)
}

func findID(url string) (string, bool) {
	return find("url", "id", url)
}

func main() {
	indexHtml, _ = os.ReadFile("index.html")
	indexJs, _ = os.ReadFile("index.js")
	indexCss, _ = os.ReadFile("index.css")
	password, _ := os.ReadFile(".password")

	var err error

	db, err = sql.Open("mysql", "kilo:" + strings.TrimSpace(string(password)) + "@/short_url")

	if err != nil {
		panic(err)
	}
	
	http.ListenAndServe("127.0.0.1:8000", Mux{})
}
