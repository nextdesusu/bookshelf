import { Author, BookSerialized, request } from "./types";

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

const randomNumber = (min: number, max: number) =>
  Math.round(min - 0.5 + Math.random() * (max - min + 1));
const randomCharCode = (s: string) =>
  s.charCodeAt(randomNumber(0, s.length));
const randomComparer = (a: BookSerialized, b: BookSerialized) =>
  randomCharCode(a.title) - randomCharCode(b.title);

export const fakeRequest = (): Promise<string> => {
  const a1 = createAuthor("лев толстой николаевич");
  const b1 = createBook(a1.id, "анна каренина", "1878", 864);
  const b2 = createBook(a1.id, "война и мир", "1863—1869", 1300)
  const b3 = createBook(a1.id, "исповедь", "1879—1882", 288);

  const a2 = createAuthor("антон чехов павлович");
  const b4 = createBook(a2.id, "дама с собачкой", "1898", 415);
  const b5 = createBook(a2.id, "палата №6", "1892", 236);

  const a3 = createAuthor("николай гоголь васильевич");
  const b6 = createBook(a3.id, "вечера на хуторе близ диканьки", "1829-1832", 136);

  const a4 = createAuthor("василий жуковский андреевич");
  const b7 = createBook(a4.id, "лесной царь", "1818", 192);
  const b8 = createBook(a4.id, "спящая царевна", "1821", 32);

  const a5 = createAuthor("михаил булгаков афанасьевич");
  const b9 = createBook(a5.id, "мастер и маргарита", "1928—1940", 504);
  const b10 = createBook(a5.id, "собачье сердце", "1925", 320);
  const b11 = createBook(a5.id, "белая гвардия", "1923", 352);

  const a6 = createAuthor("владимир набоков владимирович");
  const b12 = createBook(a5.id, "лолита", "1953", 335);
  const b13 = createBook(a5.id, "бледный огонь", "1962", 315);
  const b14 = createBook(a5.id, "ада", "1959-1969", 704);

  const booksArray = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14];
  booksArray.sort(randomComparer);

  const requestSrc: request = {
    authors: [a1, a2, a3, a4, a5, a6],
    books: booksArray
  };
  const request = JSON.stringify(requestSrc);
  return new Promise((res) => {
    setInterval(() => res(request), 100);
  })
}

export const getFullName = (author: Author): string => {
  const { lastName, firstName, patronym } = author;
  const patronymOrEmpty = `${patronym ? patronym : ""}`;
  return `${lastName} ${firstName} ${patronymOrEmpty}`;
}
