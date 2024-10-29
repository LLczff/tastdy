# Tastdy

A vibrant recipe-sharing platform designed for food lovers and home chefs. Whether you’re looking to try something new or showcase your culinary creations, **Tastdy** provides an inspiring and interactive space to explore flavors and connect with a community of passionate cooks.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contact](#contact)
- [License](#license)

## Features

- **Explore Recipes**: Browse a variety of recipes shared by other users.
- **Like Recipes**: Show appreciation for your favorite recipes.
- **Create My Own Recipe**: Add and share your personal recipes with the community.
- **Responsive**: Responsive design for seamless use on all devices.

## Tech Stack

- **Next.js 14**: A React-based frontend framework for building server-side rendered applications.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **GIN**: A lightweight Go framework for building the backend API.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/username/myproject.git

cd myproject
```

### 2. Create environmental file

This application require certain environment variables to be set. Create a `.env` file in the root of your project and add the following:

```bash
# MongoDB
MONGO_INITDB_HOST="<your_mongo_host>"
MONGO_INITDB_DATABASE="<your_database_name>"
MONGO_INITDB_USERNAME="<your_database_user>"
MONGO_INITDB_PASSWORD="<your_database_password>"

# JWT
JWT_SECRET="<your_jwt_secret>"

# API path
BASE_API_URL="http://<backend_container_name>:<backend_container_port>"
```

### 3. Build and Run

Make sure you have Docker running, then execute the following command to build and start the application:

```bash
docker compose up -d
```

### 4. Access the application

Once the application is running, open your web browser and navigate to: http://localhost:3000

## Contact

- **Linkedin**: [Linkedin Profile](https://linkedin.com/in/thee-chaomai)
- **Website**: [LLczff](https://llczff.github.io)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
