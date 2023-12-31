# Full Stack Image Search Engine

This repository contains a Full Stack Image Search Engine utilizing Weaviate Vector Database with a front-end built in HTML, CSS, and JavaScript, and a back-end server using Node.js. The engine leverages Weaviate's `img2vec` neural network module for image vectorization.

## Setup

Follow these steps to set up the Image Search Engine:

1. Initialize the project:
**npm init -y**

2. Install Weaviate TypeScript client:
**npm install weaviate-ts-client**

3. Modify `package.json` to support ES6 import statements:
**Add "type": "module" in package.json**


4. Download the Docker Compose configuration:
**curl -o docker-compose.yml "<docker-compose-url>"**
curl command - “curl -o docker-compose.yml "https://configuration.weaviate.io/v2/docker-compose/docker-compose.yml?generative_aws=false&generative_cohere=false&generative_openai=false&generative_palm=false&image_neural_model=pytorch-resnet50&media_type=image&modules=modules&ref2vec_centroid=false&reranker_cohere=false&reranker_transformers=false&runtime=docker-compose&weaviate_version=v1.23.0&weaviate_volume=no-volume”

Replace `<docker-compose-url>` with the provided URL.
5. Start Weaviate using Docker Compose:
**docker compose up -d**


## Usage

After setting up, you can start the Node.js server and access the front-end to use the Image Search Engine.

## Contributing

Contributions to this project are welcome. Please ensure to follow the project's guidelines and code of conduct.

## License

This project is licensed under the [MIT License](LICENSE).


