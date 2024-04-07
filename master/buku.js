new Vue({
    el: '#app',
    data: {
        books: [],
        bookFilter: '',
        bookColumns: [
            {
                label: 'Judul',
                field: 'judul',
                filterable: true
            },
            {
                label: 'Penulis',
                field: 'penulis',
                filterable: true
            },
            {
                label: 'Penerbit',
                field: 'penerbit',
                filterable: true
            },
            {
                label: 'Tahun Terbit',
                field: 'tahun_terbit',
                filterable: true
            },
            {
                label: 'Actions',
                field: 'actions',
                filterable: false,
                width: '180px',
                sortable: false,
            }
        ],
        modalTitle: '', // Judul modal
        formData: {    // Data form
            id: null,
            judul: '',
            penulis: '',
            penerbit: '',
            tahun_terbit: ''
        },
        submitButtonText: '', // Tambahkan properti submitButtonText
        yearError: false
    },
    computed: {
        filteredBooks() {
            return this.books.filter(book =>
                book.judul.toLowerCase().includes(this.bookFilter.toLowerCase()) ||
                book.penulis.toLowerCase().includes(this.bookFilter.toLowerCase()) ||
                book.penerbit.toLowerCase().includes(this.bookFilter.toLowerCase())
            ).map(book => {
                return { ...book, actions: null }; // Add an empty actions column for each book
            });
        }
    },
    methods: {
        editBook(book) {
            this.formData = { ...book };
            this.modalTitle = 'Edit Buku';
            this.submitButtonText = 'Update';

            $('#bookModal').modal('show');
        },
        showAddModal() {
            this.resetForm();
            this.submitButtonText = 'Save';
            this.modalTitle = 'Tambah Buku';

            $('#bookModal').modal('show');
        },
        saveBook() {
            const dataBook = Object.fromEntries(
                Object.entries(this.formData).map(([key, value]) => {
                    if (key === 'judul' || key === 'penulis' || key === 'penerbit' || key === 'tahun_terbit') {
                        return [key, value];
                    }
                    return null;
                }).filter(entry => entry !== null) // Filter properti yang bernilai null (properti yang tidak dipilih)
            );

            if (this.formData.id) {
                this.updateBook(this.formData.id, dataBook);
            } else {
                this.addNewBook(dataBook);
            }
            
            $('#bookModal').modal('hide');
        },
        async addNewBook(dataBook) {
            try {
                const response = await fetch('http://localhost:3000/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataBook)
                });

                const res = await response.json();

                if (res.success) {
                    Swal.fire({
                        timer: 1500,
                        title: res.msg,
                        icon: "success",
                        position: "top-end",
                        showConfirmButton: false,
                    });
                    this.fetchBooks();
                    this.resetForm();
                } else {
                    console.log(res);
                }

            } catch (error) {
                console.error('Error:', error);
            }
        },
        async updateBook(bookId, dataBook) {
            try {
                const response = await fetch(`http://localhost:3000/books/${bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataBook)
                });

                const res = await response.json();

                // Periksa apakah permintaan berhasil (status kode 200-299)
                if (res.success) {
                    Swal.fire({
                        timer: 1500,
                        icon: "success",
                        title: res.msg,
                        position: "top-end",
                        showConfirmButton: false,
                    });
                    this.fetchBooks();
                    this.resetForm();
                } else {
                    throw new Error('Gagal memperbarui buku. Status code: ' + res.success);
                }
            } catch (error) {
                this.errorMessage = 'Gagal memperbarui buku. Silakan coba lagi.';
                console.error('Error updating book:', error);
            }
        },
        deleteBook(bookId) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://localhost:3000/books/${bookId}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                            this.fetchBooks();
                        } else {
                            Swal.fire(
                                'Error!',
                                'Failed to delete the file.',
                                'error'
                            );
                        }
                    })
                    .catch(error => {
                        Swal.fire(
                            'Error!',
                            'Failed to delete the file.',
                            'error'
                        );
                        console.error('Error deleting book:', error);
                    });
                }
            });
        },
        fetchBooks() {
            fetch('http://localhost:3000/books')
                .then(response => response.json())
                .then(data => {
                    this.books = data;
                })
                .catch(error => console.error('Error fetching books:', error));
        },
        validateYear() {
            const year = parseInt(this.formData.tahun_terbit);
            const currentYear = new Date().getFullYear();
            this.yearError = isNaN(year) || year >= currentYear;

            // const yr = this.formData.tahun_terbit;
            // const isValidYear = /^\d{1,4}$/.test(yr); // Cek apakah tahun terdiri dari angka dan maksimal 4 digit
            // if (!isValidYear) {
            //     this.yearError = true;
            // } else {
            //     this.yearError = false;
            // }
        },
        getMinYear() {
            return new Date().getFullYear() - 1; // Contoh: Batas minimum tahun adalah tahun sebelumnya
        },
        resetForm() {
            this.formData = {
                id: null,
                judul: '',
                penulis: '',
                penerbit: '',
                tahun_terbit: ''
            };
        }
    },
    created() {
        this.fetchBooks();
    }
});
