"use client";
import { use, useEffect, useState } from 'react';

import axios from 'axios';

type Tbooks = {
    id?: number,
    title: string,
    author: string,
    year: string
    data?: any
}

type TBook = {
    msg: string;
    data?: any
}

const headers = {
    headers: {
        "Content-Type": "application/json",
    }
}

export default function BooksPage() {
    useEffect(() => {
        getBooks();
    }, []);

    const [books, setBooks] = useState<Tbooks[]>([]);
    const [book, setBook] = useState<Tbooks>({
        id: 0,
        title: "",
        author: "",
        year: ""
    });

    const [isEditable, setIsEditable] = useState(false);


    const onChange = (e:any)=>{
        const data: any = book;
        data[e.target.name] = e.target.value;
        setBook(data);
    }

    const getBooks = async () => {
        try {
            const response = await axios.get<TBook>(`${process.env.NEXT_PUBLIC_API_REST_URL}/get`);

            if(response.data.data){
                setBooks(response.data.data);
            }
        } catch (error) {
            console.log({ error });
        }
    }

    const createBooks = async () => {
        try {
            await axios.post<TBook>(`${process.env.NEXT_PUBLIC_API_REST_URL}/create`,book, headers);
            getBooks();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const updateBooks = async (id: number) => {
        try {
            await axios.put<TBook>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/update/${id}`,
                book,
                headers
            );
            getBooks();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const deleteBooks = async (id: number) => {
        try {
            await axios.delete<TBook>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/delete/${id}`,
            );
            getBooks();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const preUpdate = (e: Tbooks) => {
        setBook(e);
        setIsEditable(true);
    }

    return (
        <div>
            <h1>Postear libros</h1>
            <div>
                <label htmlFor="title">Ingresa el titulo del libro:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='title'
                    placeholder='Titulo'
                /><br />
                <label htmlFor="author">Ingresa el autor del libro:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='author'
                    placeholder='Autor'
                /><br />
            </div>
            <label htmlFor="year">Ingresa el año del libro:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='year'
                    placeholder='Año'
                /><br />
            <button onClick={createBooks}>Agregar libro</button>
            <table>
                <tr>
                    <th>Titulo</th>
                    <th>Autor</th>
                    <th>Año</th>
                </tr>
                {books.map((book, index) => (
                    <tr key={index}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.year}</td>
                        <td>
                            <button onClick={() => deleteBooks(book.id ?? 0)}>Delete</button>
                        </td>
                        <td>
                            <button onClick={() => preUpdate(book)}>Update</button>
                        </td>
                    </tr>
                ))}
            </table>

            {
                isEditable && (
                    <div>
                        <h2>Actualizar libros</h2>
                        <div>
                            <label htmlFor="title">Ingresa el titulo del libro:</label><br />
                            <input
                                type="text"
                                onChange={(e) => onChange(e)}
                                name='title'
                                defaultValue={book.title}
                            /><br />
                            <label htmlFor="author">Ingresa el autor del libro:</label><br />
                            <input
                                type="text"
                                onChange={(e) => onChange(e)}
                                name='author'
                                defaultValue={book.author}
                            /><br />
                            <label htmlFor="category">Ingresa el año del libro:</label><br />
                            <input
                                type="text"
                                onChange={(e) => onChange(e)}
                                name='year'
                                defaultValue={book.year}
                            /><br />
                        </div>
                        <button onClick={() => updateBooks(book.id ?? 0)}>Guardar</button>
                    </div>
                )
            }
        </div>
    );
}