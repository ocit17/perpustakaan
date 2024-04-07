new Vue({
    el: '#app',
    data: {
        histories: [],
        hisColumns: [
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
                label: 'Id Buku',
                field: 'id_buku',
                filterable: true
            },
            {
                label: 'Judul Buku',
                field: 'judul',
                filterable: true
            },
            {
                label: 'Tanggal Pinjam',
                field: 'tanggal_peminjaman',
                thClass: 'text-center',
                tdClass: 'text-center',
                filterable: true
            },
            {
                label: 'Tanggal Kembali',
                field: 'tanggal_pengembalian',
                thClass: 'text-center',
                tdClass: 'text-center',
                filterable: true
            },
            {
                label: 'Lama Pinjam',
                field: 'lama_pinjam',
                thClass: 'text-center',
                tdClass: 'text-center',
                filterable: true
            }
        ],
        url : 'http://localhost:3000/history/',
    },
    mounted() {
        fetch(this.url)
                .then(response => response.json())
                .then(data => {
                    this.histories = data;
                })
                .catch(error => console.error('Error fetching history:', error));
    }
});
