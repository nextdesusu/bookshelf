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

const createAuthor = (name: string): Author => {
  const id = String(authorId());
  const [firstName, lastName, patronym] = name.split(" ");
  return { id, firstName, lastName, patronym }
}

let randomBookId = 0;
const bookId = () => randomBookId++;

const createBook = (
  author: Author,
  title: string,
  written: string,
  pages: number,
  id: string = String(bookId())
): Book => ({
  id,
  author,
  title,
  written,
  pages
})

const randomBook = (author: Author): Book => {
  const id = bookId();
  return {
    id: `${id}`,
    title: `book ${id}`,
    pages: 100,
    written: "november",
    author,
  }
}

const fakeRequest = (): Promise<string> => {
  const a1 = createAuthor("лев толстой николаевич");
  const b1 = createBook(a1, "анна каренина", "ноябрь", 100);
  const b2 = randomBook(a1);

  const a2 = randomAuthor();
  const b3 = randomBook(a2);

  const a3 = randomAuthor();
  const b4 = randomBook(a3);
  const b5 = randomBook(a3);
  const requestSrc = [
    [
      b1, b2, b3
    ],
    [b4, b5]
  ];
  const request = JSON.stringify(requestSrc);
  return new Promise((res) => {
    setInterval(() => res(request), 100);
  })
}

export default fakeRequest;
