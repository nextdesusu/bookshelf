import { Author, Book, BookSerialized, request } from "./types";

let randomAuthorId = 0;
let randomBookId = 0;

const createAuthor = (name: string): Author => {
  const id = String(randomAuthorId++);
  const [firstName, lastName, patronym] = name.split(" ");
  return { id, firstName, lastName, patronym }
}

const createBook = (
  authorId: string,
  title: string,
  written: string,
  pages: number,
  id: string = String(randomBookId++)
): BookSerialized => ({
  authorId,
  title,
  written,
  pages,
  id
})

const fakeRequest = (): Promise<string> => {
  const a1 = createAuthor("лев толстой николаевич");
  const b1 = createBook(a1.id, "анна каренина", "1878", 864);

  const a2 = createAuthor("антон чехов павлович");
  const b2 = createBook(a2.id, "дама с собачкой", "1898", 415);
  const b3 = createBook(a2.id, "палата №6", "1892", 236);

  const a3 = createAuthor("николай гоголь васильевич");
  const b4 = createBook(a3.id, "вечера на хуторе близ диканьки", "1829-1832", 136);
  const requestSrc: request = {
    authors: [a1, a2, a3],
    shelfs: [
      [
        b1, b2,
      ],
      [
        b3, b4
      ]
    ]
  };
  const request = JSON.stringify(requestSrc);
  return new Promise((res) => {
    setInterval(() => res(request), 100);
  })
}

export default fakeRequest;
