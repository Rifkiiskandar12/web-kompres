document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityLabel = document.getElementById('qualityLabel');
    const resultSection = document.getElementById('resultSection');
    const previewImg = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Variabel untuk menyimpan gambar yang sedang aktif
    let activeImage = null;
    let originalFileName = "";

    // EVENT 1: Saat Slider Digeser
    qualitySlider.addEventListener('input', (e) => {
        const quality = e.target.value;
        qualityLabel.textContent = `${quality}%`;
        
        // Jika sudah ada gambar yang diupload, langsung kompres ulang
        if (activeImage) {
            compressAndDisplay(activeImage, quality / 100);
        }
    });

    // EVENT 2: Saat File Dipilih
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        originalFileName = file.name;
        document.getElementById('oldSize').textContent = formatBytes(file.size);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                activeImage = img; // Simpan ke variabel global/scope atas
                compressAndDisplay(img, qualitySlider.value / 100);
                resultSection.classList.remove('hidden');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Fungsi Utama Kompresi
    function compressAndDisplay(img, quality) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set dimensi canvas sama dengan gambar asli
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Kompresi (Konversi Canvas ke DataURL)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Update UI
        previewImg.src = dataUrl;
        downloadBtn.href = dataUrl;
        downloadBtn.download = `compressed_${originalFileName}`;

        // Hitung ukuran file baru secara real-time
        const stringLength = dataUrl.split(',')[1].length;
        const sizeInBytes = Math.ceil(stringLength * 0.75);
        document.getElementById('newSize').textContent = formatBytes(sizeInBytes);
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});