//---Image Input Image Preview-----
ImagePreview_Input();
ImagePreview_Search();

// Call the function to fetch and display images
// fetchAndDisplayImages();






document.getElementById('SearchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const response = await fetch('http://localhost:3000/search-image', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const resultImg = document.getElementById('resultImage')
        resultImg.src = imageUrl;
        resultImg.style.width = "250px";
        resultImg.style.height = "250px";

    } else {
        console.error('Error fetching image');
    }
});



function ImagePreview_Search() {
    document.getElementById('imageSearch').addEventListener('change', function (event) {
        const files = Array.from(event.target.files).slice(0, 1); // Limit to 1 image
        const previewContainer = document.getElementById('imagePreview_search');
        previewContainer.innerHTML = ''; // Clear existing previews

        files.forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.classList.add('h-20', 'w-20', 'object-cover', 'mr-2', 'mb-2'); // Tailwind classes
                previewContainer.appendChild(imgElement);
            };
            reader.readAsDataURL(file);
        });
    });
}

function ImagePreview_Input() {
    document.getElementById('imageInput').addEventListener('change', function (event) {
        const files = Array.from(event.target.files).slice(0, 25); // Limit to 25 images
        const previewContainer = document.getElementById('imagePreview');
        previewContainer.innerHTML = ''; // Clear existing previews

        files.forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.classList.add('h-20', 'w-20', 'object-cover', 'mr-2', 'mb-2'); // Tailwind classes
                previewContainer.appendChild(imgElement);
            };
            reader.readAsDataURL(file);
        });
    });
}

async function fetchAndDisplayImages() {
    try {
        const response = await fetch('http://localhost:3000/images');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const images = await response.json();

        const imagesContainer = document.getElementById('imagesContainer'); // Make sure this exists in your HTML
        imagesContainer.innerHTML = ''; // Clear existing content

        images.forEach(base64Image => {
            const img = new Image();
            img.src = base64Image;
            img.style.width = '100px'; // Set image size as needed
            img.style.height = '100px';
            img.style.margin = '5px';
            imagesContainer.appendChild(img);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}
