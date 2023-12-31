import weaviate, { ObjectsBatcher, toBase64FromBlob } from 'weaviate-ts-client';
import fs from 'fs'; 
import path from "path"

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const schemaConfig = {
    'class': 'Meme',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },
        {
            'name': 'text',
            'dataType': ['string']
        }
    ]
};

const schemaRes = await client.schema.getter().do();

console.log(schemaRes)

if(schemaRes === undefined) {
//Create a schema that contains an image property.
await CreateSchema();
}

// Store an Image
// await StoreImage();

//Query an Image
// await QueryImage();

//Store directory of images
// await StoreImageFiles();


async function StoreImage() {
    const img = fs.readFileSync('./img/meme2.jpeg');
    const b64 = Buffer.from(img).toString('base64');

    await client.data.creator()
        .withClassName('Meme')
        .withProperties({
            image: b64,
            text: 'matrix meme'

        })
        .do();
}

export async function StoreImageFiles(files) {
    //const imgFiles = fs.readdirSync('./img');
    
    let batcher = client.batch.objectsBatcher();
    const batchSize = 20;
    let counter = 0;
  
    for (const file of files) {

        const filePath = file.path; // Assuming 'path' is a property of file
        const fileContent = fs.readFileSync(filePath);
        const b64 = Buffer.from(fileContent).toString('base64');

        const obj = {
            class: 'Meme', 
            properties: {
                image: b64,
                text: file.toString()
            },
        };
  
        batcher = batcher.withObject(obj);
        if (++counter === batchSize) {
            try {
                const res = await batcher.do();
                console.log(res);
            } catch (error) {
                console.error('Batch processing error:', error);
            }
            counter = 0;
            batcher = client.batch.objectsBatcher();
        }
    }
  
    if (counter > 0) {
        try {
            const res = await batcher.do();
            console.log(res);
        } catch (error) {
            console.error('Final batch processing error:', error);
        }
    }

    console.log("All image vectors have been added to the database.");
}

async function CreateSchema() {
    await client.schema
        .classCreator()
        .withClass(schemaConfig)
        .do();
}


// export async function QueryImage() {
//     const test = Buffer.from(fs.readFileSync('./test1.jpeg')).toString('base64');

//     const resImage = await client.graphql.get()
//         .withClassName('Meme')
//         .withFields(['image'])
//         .withNearImage({ image: test })
//         .withLimit(1)
//         .do();

//     // Write result to filesystem
//     const result = resImage.data.Get.Meme[0].image;
//     fs.writeFileSync('./result.jpg', result, 'base64');
// }

export async function QueryImage(file) {
    // Assuming 'file' contains the path to the uploaded image
    const imagePath = file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    const resImage = await client.graphql.get()
        .withClassName('Meme')
        .withFields(['image'])
        .withNearImage({ image: imageBase64 })
        .withLimit(1)
        .do();

    // Write result to filesystem
    // Check if there's a result before trying to access it
    if (resImage.data.Get.Meme.length > 0) {
        const result = resImage.data.Get.Meme[0].image;
        fs.writeFileSync('./result.jpg', result, 'base64');
        return './result.jpg'; // Return the path of the result image
    } else {
        throw new Error('No matching images found');
    }
}


  
