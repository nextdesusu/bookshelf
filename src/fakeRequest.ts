import { Author, Book } from "./types";

let randomAuthorId = 0;
const authorId = () => randomAuthorId++;

const randomAuthor = (): Author => {
  const id = authorId();
  return {
    id: `${id}`,
    firstName: `author ${id}`,
    lastName: "test",
    patronym: id % 2 === 0 ? `patronym ${id}` : undefined
  };
}

let randomBookId = 0;
const bookId = () => randomBookId++;

const randomBook = (author: Author): Book => {
  const id = bookId();
  return {
    id: `${id}`,
    title: `book ${id}`,
    author,
  }
}

const fakeRequest = () => {
  const a1 = randomAuthor();
  const b1 = randomBook(a1);
  const b2 = randomBook(a1);

  const a2 = randomAuthor();
  const b3 = randomBook(a2);
  const requestSrc = [
    [
      b1, b2, b3
    ],
  ];
  const request = JSON.stringify(requestSrc);
  return new Promise((res) => {
    setInterval(() => res(request), 100);
  })
}

export default fakeRequest;
