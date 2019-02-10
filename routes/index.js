/*
    TODO:
        + страничка книги
        + редактирование книги
        + стортировка
        + удаление книг
        + добавление читателя
        + удаление читателя
 */

var express = require('express');
var router = express.Router();
const books = require("../books");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", {books: books});
  next();
});

router.get("/book/:id([0-9]{1,})", function (req, res, next) {
    const id = req.params.id;
    let cur_book;
    let find = false;
    for (var book of books) {
        if (book.id == id) {
            cur_book = book;
            find = true;
            break;
        }
    }
    if (find) {
        res.status(200).render("book", {book: cur_book});
        next();
    }
    else {
        res.status(404);
        res.render("error").end();
    }
});

router.get("*", (req, res)=>{
    res.status(404); // Ошибка – нет такой страницы
    res.end("Page not found");
});

router.post('/', function (req, res, next) {
    console.log("entered post-method: new book");
    let body = req.body;
    if (body.type == "add_book") {
        if (!body.name || !body.year.toString().match(/^[0-9]{1,}$/g) || !body.author) {
            res.status(400);
            //post_debug("Bad Request");
            res.json({message: "Bad Request"});
        }
        else {
            let newId = Number(books[books.length-1].id) + 1;
            books.push({
                id: newId.toString(),
                name: body.name,
                author: body.author,
                year: body.year,
                free: "true",
                reader: "",
                limit: ""
            });
        }
    }
    else if (body.type == "delete_book") {
        let index;
        for (let i = 0; i < books.length; ++i ) {
            if (books[i].id == body.id) {
                index = i;
                break;
            }
        }
        books.splice(index, 1);
    }
    const file = require("fs");
    file.writeFile('books.json', JSON.stringify(books), (err) => {
        if (err) throw err;
        //  post_debug('The file has been saved!');
    });
    res.status(200).render('index', {books: books});

});


router.post('/book/:id([0-9]{1,})', function (req, res, next) {
    let body = req.body;
    let to_do = body.type;
    let cur_book;
        for (book of books) {
            if (book.id == body.id) {
                if (to_do == "delete_reader") {
                    book.free = "true";
                    book.readerName = "";
                    book.limit = "";
                    console.log("removed reader");
                    cur_book = book;
                }
                else if (to_do == "add_reader") {
                    if (!body.readerName || !body.limit) {
                        res.status(400);
                        res.json({message: "Bad Request"});
                    }
                    else {
                        book.free = "false";
                        book.readerName = body.readerName;
                        book.limit = body.limit;
                        console.log("added reader");
                        cur_book = book;
                    }
                }
                else if (to_do == "set_book_name") {
                    if (!body.book_name) {
                        res.status(400);
                        res.json({message: "Bad Request"});
                    }
                    else {
                        book.name = body.book_name;
                        cur_book = book;
                    }
                }
                else if (to_do == "set_author") {
                    if (!body.author) {
                        res.status(400);
                        res.json({message: "Bad Request"});
                    }
                    else {
                        book.author = body.author;
                        cur_book = book;
                    }
                }
                else if (to_do == "set_year") {
                    if (!body.year || !body.year.toString().match(/^[0-9]{1,}$/g)) {
                        res.status(400);
                        res.json({message: "Bad Request"});
                    }
                    else {
                        book.year = body.year;
                        cur_book = book;
                    }
                }
                break;
            }
        }

        const file = require("fs");
        file.writeFile('books.json', JSON.stringify(books), (err) => {
            if (err) throw err;
        });

        res.status(200).render("book", {book: cur_book});

        //console.log(req.body);

});

router.put('/book/:id([0-9]{1,})', function (req, res, next) {
    console.log("entered put method");
    let body = req.body;
    let id = body.id;
    let cur_book;
    console.log(id);

    for (book of books) {
        if (book.id == id) {
            if (body.type == "delete_reader") {
                book.free = "true";
                book.readerName = "";
                book.limit = "";
                console.log("removed reader");
            }
            else if (body.type == "add_reader") {
                book.free = "false";
                book.readerName = body.readerName;
                book.limit = body.limit;
                console.log("added reader");
            }
            cur_book = book;
            break;
        }
    }
    const file = require("fs");
    file.writeFile('books.json', JSON.stringify(books), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });

    res.status(200).render('book', {book: cur_book});
    //console.log(req.body);

});

router.put("/sort_by_date", (req, res, next) => {
   let tmp = [];
   for (book of books) {
       if (book.free == "false") {
           tmp.push(book);
       }
   }

   console.log(tmp);

   tmp.sort((left, right) => {
       return left.limit > right.limit;
   });

   res.render("booklist", {books: tmp});

});

router.put("/sort_is_free", (req, res, next) => {
    let tmp = [];

    for (book of books) {
        if (book.free=="true") {
            tmp.push(book);
        }
    }
   // console.log(tmp);
    res.render("booklist", {books: tmp});
});

router.put("/reset_list", (req, res, next) => {
   res.render("booklist", {books: books});
});
module.exports = router;
