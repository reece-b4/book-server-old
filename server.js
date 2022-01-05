const http = require("http");
const fs = require("fs");

const server = http.createServer((request, response) => {
  console.log("request made");
  const { method, url } = request;
  if (method === "GET" && url === "/api") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    response.write(JSON.stringify({ message: "Hello!" }));
    response.end();
  } else if (method === "GET" && url === "/api/books") {
    fs.readFile("./data/books.json", "utf8", (err, books) => {
      if (err) {
        console.log(err);
      } else {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 200;
        response.write(JSON.stringify({ books }));
        response.end();
      }
    });
  } else if (method === "GET" && url === "/api/authors") {
    fs.readFile("./data/authors.json", "utf8", (err, authors) => {
      if (err) {
        console.log(err);
      } else {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 200;
        response.write(JSON.stringify({ authors }));
        response.end();
      }
    });
  } else if (method === "GET" && /\/api\/books\/\d+/.test(url)) {
    fs.readFile("./data/books.json", "utf8", (err, books) => {
      if (err) {
        console.log(err);
      } else {
        const bookId = url.match(/\d+/)[0];
        books = JSON.parse(books);
        let newBook;
        for (let i = 0; i < books.length; i++) {
          if (books[i].bookId === +bookId) {
            newBook = books[i];
          }
        }
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 200;
        response.write(JSON.stringify({ book: newBook }));
        response.end();
      }
    });
  } else if (method === "POST" && url === "/api/books") {
    let body = "";
    request.on("data", (packet) => {
      body += packet.toString();
    });
    request.on("end", () => {
      console.log(body);
      fs.readFile("./data/books.json", "utf8", (err, books) => {
        if (err) {
          console.log(err);
        } else {
          const parseBooks = JSON.parse(books);
          parseBooks.push(JSON.parse(body));
          console.log(parseBooks);

          fs.writeFile(
            "./data/books.json",
            JSON.stringify(parseBooks),
            (err) => {
              if (err) {
                console.log(err);
              } else {
                response.write(JSON.stringify(body));
                response.end();
              }
            }
          );
        }
      });
    });
  }
});

server.listen(9090, (err) => {
  if (err) console.log(err);
  else console.log("listening on port 9090");
});

//How could you ensure that the bookId that is created is unique?
//What status code should the server respond with?
