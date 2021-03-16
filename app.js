class App {
    constructor () {
        this.notes = [];
        this.title = '';
        this.text = '';
        this.id = '';

        // grab HTML elts to use 
        this.$placeholder = document.querySelector('#placeholder')
        this.$form = document.querySelector('#form');
        this.$notes = document.querySelector('#notes')
        this.$noteTitle = document.querySelector('#note-title')
        this.$noteText = document.querySelector('#note-text')
        this.$formButtons = document.querySelector('#form-buttons')
        this.$closeButton = document.querySelector('#form-close-button')
        this.$modal = document.querySelector('.modal')
        this.$modalTitle = document.querySelector('.modal-title')
        this.$modalText = document.querySelector('.modal-text')
        this.$modalCloseButton = document.querySelector('.modal-close-button')
        this.$colorTooltip = document.querySelector('#color-tooltip')

        this.addEventListeners();
    }

    // Include addEventListener methods for handling different events in our app
    addEventListeners() {
        // event for click event on the body
        document.body.addEventListener('click', e => {
            this.handleFormClick(e);
            this.selectNote(e);
            this.openModal(e);
            this.deleteNote(e);
        });

        document.body.addEventListener('mouseover', evt => {
            this.openTooltip(evt);
        });

        document.body.addEventListener('mouseout', evt => {
            this.closeTooltip(evt);
        });

        // add eventlisteners on the colors so they can be moused over
        this.$colorTooltip.addEventListener('mouseover', function() {
            this.style.display = 'flex';
        });

        this.$colorTooltip.addEventListener('mouseout', function() {
            this.style.display = 'none';
        })

        this.$colorTooltip.addEventListener('click', evt => {
            const color = evt.target.dataset.color;
            if (color) {
                this.editNoteColor(color);
            }
        })

        // listen for submit event on the form
        this.$form.addEventListener('submit', e => {
            e.preventDefault()
            // grab the values of the note title and/or text and check if it's not null
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text
            if (hasNote) {
                this.addNote({ title, text })
            }
        })

        // listen for click event on the close button
        this.$closeButton.addEventListener('click', e => {
            e.stopPropagation();
            this.closeForm();
        });

        this.$modalCloseButton.addEventListener('click', e => {
            this.closeModal(e);
        })
    }

    // functions to handle diff events
    handleFormClick(e) {
        const isFormClicked = this.$form.contains(e.target);

        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text

        isFormClicked ? this.openForm() : hasNote ? this.addNote({ title, text }) : this.closeForm();
    }

    openForm() {
        this.$form.classList.add('form-open');
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm() {
        this.$form.classList.remove('form-open')
        this.$noteTitle.style.display = 'none'
        this.$formButtons.style.display = 'none'
        this.$noteTitle.value=''
        this.$noteText.value=''
    }

    openModal(e) {
        if (e.target.matches('.toolbar-delete')) return;

        if (e.target.closest('.note')) {
            this.$modal.classList.toggle('open-modal');
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal(e) {
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    openTooltip(evt) {
        if (!evt.target.matches('.toolbar-color')) return;
        this.id = evt.target.dataset.id;
        const noteCoords = evt.target.getBoundingClientRect();
        const horizontal = noteCoords.left;
        const vertical = window.scrollY - 20;
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.$colorTooltip.style.display = 'flex';
    }

    closeTooltip(evt) {
        if (!evt.target.matches('.toolbar-color')) return;  // umm, redundant..?
        this.$colorTooltip.style.display = 'none';
    }

    addNote({ title, text }) {
        const newNote = {
            title,
            text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        };
        this.notes = [...this.notes, newNote]
        this.displayNotes();
        this.closeForm();
    }

    editNote() {
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note => 
            note.id === Number(this.id) ? { ...note, title, text } : note
        );
        this.displayNotes();
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note => 
            note.id === Number(this.id) ? { ...note, color } : note
        );
        this.displayNotes();
    }

    selectNote(e) {
        const $selectedNote = e.target.closest('.note');
        if (!$selectedNote) return;
        const [$noteTitle, $noteText] = $selectedNote.children;
        this.title = $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.id;
    }

    deleteNote(evt) {
        evt.stopPropagation();
        if (!evt.target.matches('.toolbar-delete')) return;
        const id = evt.target.dataset.id;
        this.notes = this.notes.filter(note => note.id !== Number(id));
        this.displayNotes();
    }

    displayNotes() {
        const hasNotes = this.notes.length > 0
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex'
        // hasNotes ? this.$placeholder.style.display = 'none' : this.$placeholder.style.display = 'flex'

        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color}" class="note" data-id="${note.id}">
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <img class="toolbar-color" data-id=${note.id} src="palette.svg">
                    <img class="toolbar-delete" data-id=${note.id} src="trash.svg">
                </div>
            </div>
        `).join("");
    }
}

new App()