import { Server, ic } from 'azle';
import cors from "cors";
import express, { Request, Response, NextFunction} from 'express';

function validation(req: Request, res: Response, next: NextFunction) {
    if (ic.caller().isAnonymous()) {
        res.status(401);
        res.send();
    }
    else {
        next();
    }
}

type Book = {
    id: number,
    title: string,
    author: string,
    year: string
}

let books: Book[] = [{
    id: 1,
    title: "Breve historia del tiempo",
    author: "Stephen Hawking",
    year: "1988"
}];

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/get", (req, res) => {
        res.status(200).json({msg:"Ok", data:books});
    });

    app.post("/create", (req, res) => {
        const book = books.find((book)=>book.id === parseInt(req.body.id));
        if(book){
            res.status(400).json({msg:"Id ya existe.", data:book});
            return;
        }
        req.body.id = books[books.length - 1].id + 1;
        books.push(req.body);
        res.status(200).json({msg:"Libro añadido correctamente"});
    });

    app.put("/update/:id", (req, res) => {
        const book = books.find((book)=>book.id === parseInt(req.params.id));

        if(!book){
            res.status(404).json({msg:"El libro no existe."});
            return;
        }

        const UBook = {...book, ...req.body};

        books = books.map((e) => e.id === UBook.id ? UBook: e);

        res.status(200).json({msg:"Libro actualizado exitosamente"});
    });

    app.delete('/delete/:id',(req, res)=>{
        books = books.filter((e) => e.id !== parseInt(req.params.id));
        res.status(200).json({msg:"Libro eliminado exitosamente", data:books});
    });


    app.post('/test', (req, res) => {
        res.json(req.body);
    });

    app.get('/whoami', (req, res) => {
        res.statusCode = 200;
        res.send(ic.caller());
    });

    app.get('/health', (req, res) => {
        res.send().statusCode = 204;
    });

    return app.listen();
});
