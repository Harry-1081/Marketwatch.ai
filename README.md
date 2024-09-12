# Marketwatch.ai

MarketWatch.AI is an advanced platform designed to facilitate the development, evaluation, and deployment of AI-driven financial analysis models. This project consists of both backend and frontend components, built using Flask and React respectively.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [Contributors](#contributors)

## Introduction

### MarketWatch.AI: Transforming Investment Decisions with Advanced AI

MarketWatch.AI simplifies investment decisions by leveraging advanced AI for precise stock sentiment analysis and recommendations. It empowers investors with reliable insights, helping them navigate the complexities of market trends. Additionally, MarketWatch.AI supports Retrieval-Augmented Generation (RAG) for financial report analysis, enabling users to effortlessly obtain inferences and data from company reports.

## Features

- **Precise sentiment analysis**: Delivers accurate stock sentiment insights using advanced AI algorithms.
- **Financial report analysis**: Utilizes RAG to extract valuable inferences and data from financial reports.
- **User-Friendly Interface**: Intuitive frontend interface for interacting with and evaluating RAG models.
- **Modular Architecture**: Separate backend and frontend components for flexible development and deployment.

## Installation

Follow the steps below to set up the backend and frontend components of Marketwatch.ai.

### Frontend Setup

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install the required Node packages:
    ```bash
    npm install
    ```

3. Start the frontend React application:
    ```bash
    npm start
    ```

### Backend Setup

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Install the required Python packages:
    ```bash
    pip install -r setup/requirements.txt
    ```

3. Install Virtual environmet:
    ```bash
    python3 -m venv venv
    ```

4. Update your dotenv:
    Update your API_KEY, IBM_CLOUD_URL and PROJECT_ID in Backend/app/.env

5. Run the Flask application:
    ```bash
    python app/app.py
    ```

## Usage

Once both the backend and frontend are set up, the application can be accessed through any web browsers. 
1. Before using, Kindly verify if the backend Flask server is running.
2. Open your web browser and navigate to `http://localhost:3000` to interact with the application.

## Contributing

Any contributions to Marketwatch.ai are welcomes! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. 

To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Acknowledgements

We would like to thank all the contributors and open-source projects that have made this project possible. Special thanks to the developers of Flask, React, Huggingface, Yahoo Finance and Kaggle for their invaluable tools,datasets and libraries.

## Contributors

- [Prasanna Venkatesan](https://github.ibm.com/Prasanna-Venkatesan2)
- [Parul Sharma](https://github.ibm.com/Parul-Sharma2)