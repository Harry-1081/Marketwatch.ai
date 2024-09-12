import re
import time
from flask import Flask, request, jsonify
from pydantic import BaseModel
from flask_pydantic import validate
from dotenv import load_dotenv
from flask_cors import CORS
import os
from sentence_transformers import SentenceTransformer
from langchain_ibm import WatsonxLLM
from pymilvus import(connections,Collection,utility,FieldSchema,DataType,CollectionSchema)
from langchain.text_splitter import TokenTextSplitter
from langchain.document_loaders import PyPDFLoader
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import warnings

warnings.filterwarnings("ignore", category=RuntimeWarning)

load_dotenv()
api_key = os.getenv("API_KEY", None)
ibm_cloud_url = os.getenv("IBM_CLOUD_URL", None)
project_id = os.getenv("PROJECT_ID", None)

parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 1000,
    "min_new_tokens": 1,
    "repetition_penalty": 1
}

connections.connect(alias='default',
                    host='cloud url',
                    port='port_number',
                    user='user',
                    password='password',
                    server_pem_path='path',
                    server_name='servername',
                    secure=True)


class QueryRequest(BaseModel):
    query: str

app = Flask(__name__)
CORS(app)

model_id = "meta-llama/llama-3-70b-instruct"
from ibm_watson_machine_learning.foundation_models import Model

ok = WatsonxLLM(model_id=model_id, url=ibm_cloud_url, params=parameters, project_id=project_id, apikey=api_key,verbose=True)

def download_and_rename_report(ticker_code):

    options = webdriver.ChromeOptions()
    options.add_argument('--headless') 
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    download_dir = os.path.join(os.getcwd(), 'reports')
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    prefs = {'download.default_directory': download_dir}
    options.add_experimental_option('prefs', prefs)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    url = f'https://ticker.finology.in/company/{ticker_code}'
    driver.get(url)
    
    time.sleep(5)

    download_link = driver.find_element(By.XPATH, '//a[contains(text(), "Annual Report 2023")]')
    download_link.click()

    time.sleep(10)

    downloaded_files = os.listdir(download_dir)
    for file_name in downloaded_files:
        if file_name.endswith(".pdf"):
            old_file_path = os.path.join(download_dir, file_name)
            new_file_name = f"{ticker_code}_data.pdf"
            new_file_path = os.path.join(download_dir, new_file_name)
            os.rename(old_file_path, new_file_path)
            print(f"Downloaded and renamed file to: {new_file_path}")
            break

    driver.quit()

    return new_file_path

def load_pdf_and_split(pdf_path):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    splitter = TokenTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(documents)

    chunk_texts = [chunk.page_content for chunk in chunks]

    return chunk_texts
def milvus_db(chunks,ticker,pdf_path):

    coll_name = f'{ticker}_data'

    connections.connect(alias='default',
                    host='cloud url',
                    port='port_number',
                    user='user',
                    password='password',
                    server_pem_path='path',
                    server_name='servername',
                    secure=True)
    
    collections_list = utility.list_collections()
    print(utility.list_collections())

    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),  # Primary key
        FieldSchema(name="passage", dtype=DataType.VARCHAR, max_length=4096,),
        FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=384),
    ]

    schema = CollectionSchema(fields, "passages collection schema")

    pdf_collection = Collection(coll_name, schema)

    index_params = {
        'metric_type': 'L2',
        'index_type': "IVF_FLAT",
        'params': {"nlist": 2048}
    }

    pdf_collection.create_index(field_name="vector", index_params=index_params)

    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')  # 384 dim

    passage_embeddings = model.encode(chunks)

    basic_collection = Collection(coll_name)
    data = [
        chunks,
        passage_embeddings
    ]

    out = basic_collection.insert(data)
    basic_collection.flush()

    os.remove(f"{pdf_path}")

    print('Data updated..')

def query_milvus(query,ticker):
        
        coll_name = f"{ticker}_data"

        collections_list = utility.list_collections()
        # print(collections_list)

        if coll_name in collections_list:
            collection=Collection(coll_name)
            collection.load()
        else:
            pdf_path = download_and_rename_report(ticker)
            chunks = load_pdf_and_split(pdf_path)
            milvus_db(chunks,ticker,pdf_path)
            collection=Collection(coll_name)
            collection.load()

        top_K = 5
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2') 
        query_embeddings = model.encode([query])

        search_params = {
            "metric_type": "L2", 
            "params": {"nprobe": 10}
        }
        results = collection.search(
            data=query_embeddings, 
            anns_field="vector", 
            param=search_params,
            limit=top_K,
            expr=None, 
            output_fields=['passage'],
        )

        relevant_chunks  = []
        for i in range(top_K):
            relevant_chunks.append(re.sub(r"^.*?\. (.*\.).*$",r"\1",results[0][i].entity.get('passage')))
        return relevant_chunks

def get_answer(context,question):
    prompt = f"""
            Compose a comprehensive reply to the query using the search results given.
            Only include information found in the results and don't add any additional information. 
            Make sure the answer is correct and don't output false content.
            If the text does not relate to the query, simply state 'Found Nothing'. 
            Ignore outlier search results which has nothing to do with the question. Only answer what is asked. 
            The answer should be short and concise

    {context}

    Question: {question}
    Answer:
    """
    response = ok.invoke(input=[prompt])
    return response

def rag_pipeline(query,ticker):
    try:
        result = query_milvus(query,ticker)
        answer = get_answer(result,query)
        return {"answer": answer}
    except Exception as e:
        print(f"Error during RAG pipeline processing: {e}")
        return {"error": str(e)}

@app.route('/ask', methods=['POST'])
@validate()
def ask():
    query = request.json.get('query')
    ticker = request.json.get('ticker')
    if not query:
        return jsonify({"error": "No query provided"}), 400
    if not ticker:
        ticker = 'BHARTIARTL'

    response = rag_pipeline(query,ticker)
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)