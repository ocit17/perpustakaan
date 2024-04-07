new Vue({
    el: '#app',
    data: {
        books: [],
        inventories: [],
        inventoryFilter: '',
        studentColumns: [
            {
                label: 'Nama Rak',
                field: 'nama_rak',
                filterable: true
            },
            {
                label: 'Judul Buku',
                field: 'judul',
                filterable: true
            },
            {
                label: 'Jumlah',
                field: 'jumlah',
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
        url : 'http://localhost:3000/inventory/',
        selectedBookId: null,
        modalTitle: '',
        formData: {
            id: null,
            id_buku: '',
            nama_rak: '',
            jumlah: '',
        },
        submitButtonText: '',
    },
    computed: {
        filteredInventories() {
            return this.inventories.filter(inventory =>
                inventory.nama_rak.toLowerCase().includes(this.inventoryFilter.toLowerCase()) ||
                inventory.judul.toLowerCase().includes(this.inventoryFilter.toLowerCase())
            ).map(inventory => {
                return { ...inventory, actions: null }; // Add an empty actions column for each book
            });
        }
    },
    methods: {
        editInventory(inventory) {
            this.formData = { ...inventory };
            this.modalTitle = 'Edit Buku';
            this.submitButtonText = 'Update';
            this.selectedBookId = inventory.id_buku;

            $('#bookModal').modal('show');
        },
        showAddModal() {
            this.resetForm();
            this.submitButtonText = 'Save';
            this.modalTitle = 'Tambah Rak';

            $('#bookModal').modal('show');
        },
        saveInventory() {
            this.formData.id_buku = this.selectedBookId
            
            const dataInventory = Object.fromEntries(
                Object.entries(this.formData).map(([key, value]) => {
                    if (key === 'id_buku' || key === 'nama_rak' || key === 'jumlah') {
                        return [key, value];
                    }
                    return null;
                }).filter(entry => entry !== null) // Filter properti yang bernilai null (properti yang tidak dipilih)
            );

            if (this.formData.id) {
                this.updateInventory(this.formData.id, dataInventory);
            } else {
                this.addInventory(dataInventory);
            }
            
            $('#bookModal').modal('hide');
        },
        async addInventory(dataInventory) {
            try {
                const response = await fetch(this.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataInventory)
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
                    this.fetchInventories();
                } else {
                    console.log(res);
                }

            } catch (error) {
                console.error('Error:', error);
            }
        },
        async updateInventory(rakId, dataInventory) {
            try {
                const response = await fetch(this.url + rakId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataInventory)
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
                    this.fetchInventories();
                } else {
                    throw new Error('Gagal memperbarui buku. Status code: ' + res.success);
                }
            } catch (error) {
                this.errorMessage = 'Gagal memperbarui buku. Silakan coba lagi.';
                console.error('Error updating book:', error);
            }
        },
        deleteInventory(rakId) {
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
                    fetch(this.url + rakId, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                            this.fetchInventories();
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
        fetchInventories() {
            fetch(this.url)
                .then(response => response.json())
                .then(data => {
                    this.inventories = data;
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
        }
    },
    mounted() {
        $('#bookModal').on('hide.bs.modal', () => {
            this.resetForm();
            this.selectedBookId = null;
        });
    },
    created() {
        this.fetchInventories();

        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(data => {
                this.books = data;
            })
            .catch(error => console.error('Error fetching books:', error));
    }
});
