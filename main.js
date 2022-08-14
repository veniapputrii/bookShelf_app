const books = [];
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const RENDER_EVENT = 'render-book';


    const search = document.getElementById('searchBook');
    search.addEventListener('submit', function(event){
        const searchBuku = document.getElementById('searchBookTitle').value.toLowerCase();
        const judul = document.querySelectorAll('inner');
        
        for (card of judul){
            const title = card.firstElementChild.innerText.toLowerCase();
            console.log(card.firstElementChild.innerText.toLowerCase());

            if(title.includes(searchBuku)){
                card.parentElement.style.display="block";
            }else{
                card.parentElement.style.display="none";
            }
        }
        event.preventDefault();
    });


function isStorageExist(){
    if (typeof (Storage) === undefined){
        alert('Browser kamu ternyata ga dukung local Storage');

        return false;

    }
    return true;
}
function loadData(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const book of data){
            books.push(book);
        } 
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
    });

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBuku');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        tambahkanData();
    });
    if (isStorageExist()){
        loadData();
    }
});


function tambahkanData(){
    const textJudul = document.getElementById('inputJudulBuku').value; 
    const textPenulis = document.getElementById('inputNamaPenulis').value;
    const timestamp = document.getElementById('inputTahun').value;
    

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, textJudul, textPenulis, timestamp, false);
    books.push(bookObject);
    
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, timestamp, isCompleted){
    return{
        id,
        title,
        author,
        timestamp,
        isCompleted
    }
}

function makebooks(bookObject){
    const textJudul = document.createElement('h4');
    textJudul.innerText =bookObject.title;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = bookObject.author;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = bookObject.timestamp;

    const textCard = document.createElement('inner');
   
    textCard.append(textJudul, textPenulis, textTimestamp);

    const card = document.createElement('div');
    card.classList.add('card');
    card.append(textCard);
    card.setAttribute('id', 'todo-${bookObject.id}');

    if (bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('button2');
        undoButton.innerHTML = "Belum Selesai Dibaca";

        undoButton.addEventListener('click', function(){
            undoTask(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('button4');
        trashButton.innerHTML = "Hapus Buku";

        trashButton.addEventListener('click', function(){
            removeBook(bookObject.id);
        });

        card.append(undoButton, trashButton);
    }
    else{ 
        const completedButton = document.createElement('button');
        completedButton.classList.add('button3');
        completedButton.innerHTML = "Buku Selesai Dibaca";

        completedButton.addEventListener('click', function(){
            taskSelesai(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('button4');
        trashButton.innerHTML = "Hapus Buku";

        trashButton.addEventListener('click', function(){
            removeBook(bookObject.id);
        });

        card.append(completedButton, trashButton);
        
    }
    return card;
}

function taskSelesai(bookId){
    const target = findBook(bookId);
    if (target == null) return;

    target.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for (const bookItem of books) {
        if(bookItem.id === bookId){
            return bookItem;
        }

    }
    return null;
}
function undoTask(bookId){
    const target = findBook(bookId);

    if(target == null) return;

    target.isCompleted = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId){
    const target = findBookIndex(bookId);

    if(target === -1 ) return;

    books.splice(target, 1);

    const text = "Yakin Mau Dihapus?";

    if(confirm(text) === true){
        removeBook();
    }else{
        loadData();
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for (const index in books){
    if (books[index].id === bookId){

        return index;
        }
    }
    return -1;
}

function saveData(){
    if (isStorageExist){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

document.addEventListener(RENDER_EVENT, function (){
   
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('readed');
    completedBOOKList.innerHTML = '';

    for (const bookItem of  books){
        const bookElement = makebooks(bookItem);
        if (!bookItem.isCompleted){
        uncompletedBOOKList.append(bookElement);
       }else{
       completedBOOKList.append(bookElement);
       }
    }

});