new Vue({
    el: '#app',
    data: {
        students: [],
        studentFilter: '',
        studentColumns: [
            {
                label: 'Nama',
                field: 'nama',
                filterable: true
            },
            {
                label: 'NIM',
                field: 'nim',
                filterable: true
            },
            {
                label: 'Jurusan',
                field: 'jurusan',
                filterable: true
            },
            {
                label: 'Tanggal Lahir',
                field: 'tanggal_lahir',
                filterable: true,
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
        url : 'http://localhost:3000/students/',
        modalTitle: '',
        formData: {
            id: null,
            nama: '',
            nim: '',
            jurusan: '',
            tanggal_lahir: ''
        },
        submitButtonText: '',
        yearError: false
    },
    computed: {
        filteredStudents() {
            return this.students.filter(student =>
                student.nama.toLowerCase().includes(this.studentFilter.toLowerCase()) ||
                student.nim.toLowerCase().includes(this.studentFilter.toLowerCase()) ||
                student.jurusan.toLowerCase().includes(this.studentFilter.toLowerCase())
            ).map(student => {
                return { ...student, actions: null }; // Add an empty actions column for each book
            });
        }
    },
    methods: {
        editStudent(student) {
            this.formData = { ...student };
            this.modalTitle = 'Edit Buku';
            this.submitButtonText = 'Update';

            $('#bookModal').modal('show');
        },
        showAddModal() {
            this.resetForm();
            this.submitButtonText = 'Save';
            this.modalTitle = 'Tambah Mahasiswa';

            $('#bookModal').modal('show');
        },
        saveStudent() {
            const dataStudent = Object.fromEntries(
                Object.entries(this.formData).map(([key, value]) => {
                    if (key === 'nama' || key === 'nim' || key === 'jurusan' || key === 'tanggal_lahir') {
                        return [key, value];
                    }
                    return null;
                }).filter(entry => entry !== null) // Filter properti yang bernilai null (properti yang tidak dipilih)
            );

            if (this.formData.id) {
                this.updateStudent(this.formData.id, dataStudent);
            } else {
                this.addNewBook(dataStudent);
            }
            
            $('#bookModal').modal('hide');
        },
        async addNewBook(dataStudent) {
            try {
                const response = await fetch(this.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataStudent)
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
                    this.fetchStudents();
                } else {
                    console.log(res);
                }

            } catch (error) {
                console.error('Error:', error);
            }
        },
        async updateStudent(studentId, dataStudent) {
            try {
                const response = await fetch(this.url + studentId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataStudent)
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
                    this.fetchStudents();
                } else {
                    throw new Error('Gagal memperbarui buku. Status code: ' + res.success);
                }
            } catch (error) {
                this.errorMessage = 'Gagal memperbarui buku. Silakan coba lagi.';
                console.error('Error updating book:', error);
            }
        },
        deleteStudent(studentId) {
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
                    fetch(this.url + studentId, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                            this.fetchStudents();
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
        fetchStudents() {
            fetch(this.url)
                .then(response => response.json())
                .then(data => {
                    this.students = data;
                })
                .catch(error => console.error('Error fetching books:', error));
        },
        resetForm() {
            this.formData = {
                id: null,
                nama: '',
                nim: '',
                jurusan: '',
                tanggal_lahir: ''
            };
        }
    },
    created() {
        this.fetchStudents();
    }
});
