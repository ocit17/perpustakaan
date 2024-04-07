new Vue({
    el: '#app',
    data: {
        books: [],
        transactions: [],
        transactionFilter: '',
        bookColumns: [
            {
                label: 'Judul Buku',
                field: 'judul'
            }
        ],
        studentColumns: [
            {
                label: 'ID Transaksi',
                field: 'id',
                filterable: true
            },
            {
                label: 'Nim Mahasiwa',
                field: 'nim',
                filterable: true
            },
            {
                label: 'Nama Mahasiwa',
                field: 'nama',
                filterable: true
            },
            {
                label: 'Tanggal Pinjam',
                field: 'tanggal_peminjaman',
                filterable: true
            },
            {
                label: 'Status Pengembalian',
                field: 'status_pengembalian',
                thClass: 'text-center',
                tdClass: 'text-center',
                filterable: true
            },
            {
                label: 'Jumlah',
                field: 'jumlah',
                thClass: 'text-center',
                tdClass: 'text-center',
                filterable: true
            },
            {
                label: 'Actions',
                field: 'actions',
                filterable: false,
                width: '180px',
                thClass: 'text-center',
                tdClass: 'text-center',
                sortable: false,
            }
        ],
        url : 'http://localhost:3000/transactions/',
        selectedBookId: null,
        modalTitle: '',
        formData: {
            id: null,
            id_buku: '',
            nama_rak: '',
            jumlah: '',
        },
        submitButtonText: '',
        selectedMahasiswa: '',
        mahasiswas: [ /* Data mahasiswa */],
        selectedBooks: [],
        Books: [ /* Data buku */],
        tanggalPengembalian: '',
        mahasiswaError: '',
        bukuError: '',
        tanggalError: '',
    },
    computed: {
        filteredTransactions() {
            return this.transactions.filter(inventory =>
                inventory.nim.toLowerCase().includes(this.transactionFilter.toLowerCase()) ||
                inventory.nama.toLowerCase().includes(this.transactionFilter.toLowerCase())
            ).map(inventory => {
                return { ...inventory, actions: null }; // Add an empty actions column for each book
            });
        }
    },
    methods: {
        editTransactions(inventory) {
            this.formData = { ...inventory };
            this.modalTitle = 'Edit Buku';
            this.submitButtonText = 'Update';
            this.selectedBookId = inventory.id_buku;

            $('#bookModal').modal('show');
        },
        showAddModal() {
            this.resetForm();
            this.submitButtonText = 'Save';
            this.modalTitle = 'Form Peminjaman Buku';

            $('#bookModal').modal('show');
        },
        async updateStatus(transId) {
            try {
                const response = await fetch(`http://localhost:3000/transactions/${transId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({status_pengembalian : 1})
                });

                const res = await response.json();

                if (res.success) {
                    Swal.fire({
                        timer: 1500,
                        icon: "success",
                        title: res.msg,
                        position: "top-end",
                        showConfirmButton: false,
                    });
                    
                    this.resetForm();
                    this.fetchTransactions();
                } else {
                    throw new Error('Gagal memperbarui buku. Status code: ' + res.success);
                }
            } catch (error) {
                this.errorMessage = 'Gagal memperbarui buku. Silakan coba lagi.';
                console.error('Error updating book:', error);
            }
        },
        transBack(transId) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, process it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    return this.updateStatus(transId);
                }
            });
        },
        fetchTransactions() {
            fetch(this.url)
                .then(response => response.json())
                .then(data => {
                    this.transactions = data;
                })
                .catch(error => console.error('Error fetching books:', error));
        },
        resetForm() {
            this.formData = {
                id: null,
                id_buku: '',
                nama_rak: '',
                jumlah: '',
            };
        },
        validateMahasiswa() {
            if (!this.selectedMahasiswa) {
                this.mahasiswaError = 'Mohon pilih mahasiswa.';
            } else {
                this.mahasiswaError = '';
            }
        },
        validateTanggal() {
            const today = new Date();
            const selectedDate = new Date(this.tanggalPengembalian);
            const differenceInTime = selectedDate.getTime() - today.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            if (differenceInDays > 5) {
                this.tanggalError = 'Tanggal pengembalian tidak boleh lebih dari 5 hari dari hari ini.';
            } else {
                this.tanggalError = '';
            }
        },
        clearBukuError() {
            this.bukuError = ''; // Menghapus pesan kesalahan buku
        },
        onRowClick(params) {
            this.clearBukuError();
        },
        async submitForm() {
            const goodTable = this.$refs.goodTable;
            const selectedRows = goodTable.selectedRows;

            if (selectedRows && selectedRows.length > 0) {
                this.selectedBooks = selectedRows
            } else {
                this.bukuError = 'Mohon pilih setidaknya satu buku.';
            }
            
            if (!this.selectedMahasiswa) {
                this.mahasiswaError = 'Mohon pilih mahasiswa.';
            }
            if (!this.tanggalPengembalian) {
                this.tanggalError = 'Mohon pilih tanggal pengembalian.';
            }
            if (this.selectedBooks.length === 0) {
                this.bukuError = 'Mohon pilih setidaknya satu buku.';
            }

            if (!this.selectedMahasiswa || !this.tanggalPengembalian || this.selectedBooks.length === 0) {
                return;
            }
            
            const today = new Date().toISOString().slice(0, 10);

            const dataHist = Object.entries(this.selectedBooks).map(([key, value]) => ({ 
                ['id_buku']: value.id, 
                ['jumlah']: 1, 
                ['tanggal_peminjaman']: today, 
                ['tanggal_pengembalian']: this.tanggalPengembalian, 
            }));

            console.log('data history detail:', dataHist);

            const dataTrans = {
                'id_mahasiswa' : this.selectedMahasiswa,
                'tanggal_peminjaman' : today,
                'tanggal_pengembalian' : this.tanggalPengembalian
            };

            const postData = {header : dataTrans, detail : dataHist}
            
            try {
                const response = await fetch('http://localhost:3000/transactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
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
                    
                    this.resetForm();
                    this.fetchTransactions();
                } else {
                    console.log(res);
                }
                $('#bookModal').modal('hide');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    },
    mounted() {
        $('#bookModal').on('hide.bs.modal', () => {
            const clearLink = document.querySelector('.vgt-selection-info-row a');

            this.resetForm();
            this.clearBukuError();
            this.selectedBooks = [];
            this.tanggalError = '';
            this.mahasiswaError = '';
            this.selectedBookId = null;
            this.selectedMahasiswa = '';
            this.tanggalPengembalian = '';

            if (clearLink) {
                clearLink.click();
            }
        });

        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(data => {
                this.Books = data;
            })
            .catch(error => console.error('Error fetching history:', error));

        fetch('http://localhost:3000/students')
            .then(response => response.json())
            .then(data => {
                this.mahasiswas = data;
            })
            .catch(error => console.error('Error fetching history:', error));
    },
    created() {
        this.fetchTransactions();
    }
});
