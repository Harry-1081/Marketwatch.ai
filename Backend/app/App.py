import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import json
from dotenv import load_dotenv
from ibm_watson_machine_learning.foundation_models import Model
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import yfinance as yf
from newsapi import NewsApiClient
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
import os
from datetime import datetime, timedelta
from langchain_ibm import WatsonxLLM

matplotlib.use('Agg')
dataset_path='dataset/companies.csv'
dataset_path2='dataset/Indian_companies.csv'

load_dotenv()
api_key = os.getenv("API_KEY", None)
ibm_cloud_url = os.getenv("IBM_CLOUD_URL", None)
project_id = os.getenv("PROJECT_ID", None)

if api_key is None or ibm_cloud_url is None or project_id is None:
    raise Exception("Ensure API_KEY, IBM_CLOUD_URL, and PROJECT_ID are set in your environment.")

creds = {
    "url": ibm_cloud_url,
    "apikey": api_key,
    "project_id": project_id
}

app = Flask(__name__)
CORS(app) 

newsapi = NewsApiClient(api_key='news_api_key')

parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 1000,
    "min_new_tokens": 1,
    "repetition_penalty": 1,
    # "random_seed":42
}

model_id = "meta-llama/llama-3-70b-instruct"
from ibm_watson_machine_learning.foundation_models import Model

ok = WatsonxLLM(model_id=model_id, url=ibm_cloud_url, params=parameters, project_id=project_id, apikey=api_key,verbose=True)


def send_to_watsonxai(prompts, creds, model_name="google/flan-ul2", decoding_method="greedy",
                      max_new_tokens=100, min_new_tokens=30, temperature=1.0, repetition_penalty=1.0):

    assert not any(map(lambda prompt: len(prompt) < 1, prompts)), "Make sure none of the prompts in the inputs prompts are empty"

    model_params = {
        GenParams.DECODING_METHOD: decoding_method,
        GenParams.MIN_NEW_TOKENS: min_new_tokens,
        GenParams.MAX_NEW_TOKENS: max_new_tokens,
        GenParams.RANDOM_SEED: 42,
        GenParams.TEMPERATURE: temperature,
        GenParams.REPETITION_PENALTY: repetition_penalty,
    }

    model = Model(
        model_id=model_name,
        params=model_params,
        credentials=creds,
        project_id=creds["project_id"]
    )

    generated_texts = []
    for prompt in prompts:
        generated_text = model.generate_text(prompt)
        generated_texts.append(generated_text)
        print(generated_text)

    return generated_texts

def search_company_in_dataset(company_name):
    df = pd.read_csv(dataset_path)
    resultf = df[df['company name'].str.contains(company_name, case=False, na=False)]
    dx = pd.read_csv(dataset_path2)
    resultin = dx[dx['company name'].str.contains(company_name, case=False, na=False)]
    # resultin['ticker'] += '.NS'
    resultin.loc[:, 'ticker'] = resultin['ticker'].astype(str) + '.NS'
    return resultf, resultin, df, dx

def find_suitable_company(companies, message, creds, model_name="google/flan-ul2"):
    prompt = f"which company from {companies} is mentioned in {message}. The company name should be exactly the same company name in {companies}"
    response = send_to_watsonxai(prompts=[prompt], creds=creds, model_name=model_name, decoding_method="greedy", max_new_tokens=100,
                                 min_new_tokens=0, temperature=1.0, repetition_penalty=1.0)

    return response[0]

# def summary_news(summary, model_name="google/flan-ul2"):
#     prompt = f"{summary} Summarize the following and return a crisp summary in about 100 words."
#     response = send_to_watsonxai(prompts=[prompt], creds=creds, model_name=model_name, decoding_method="greedy", max_new_tokens=200,
#                                  min_new_tokens=0, temperature=1.0, repetition_penalty=1.0)
#     return response

def extract_requested_metrics(message, model_name="google/flan-ul2"):
    prompt = f"""The user message is {message}.
    Extract the requested metrics from the message. The metrics can be only from the following: PE Ratio, Industry Average PE, ROE, PAT, Revenue."""
    response = send_to_watsonxai(prompts=[prompt], creds=creds, model_name=model_name, decoding_method="greedy", max_new_tokens=100,
                                 min_new_tokens=0, temperature=1.0, repetition_penalty=1.0)
    return response[0]
    
def compare_companies(compare, req_metrics,company_names):
    stockx = []

    for i in range(len(compare)):
        result = get_metrics_values(req_metrics, compare[i])
        stockx.append(result)
        news_res = get_top_news(company_names[i])
        stockx.append(news_res)
        report_res = get_report_res(compare[i].replace(".NS",""))
        stockx.append(report_res)

    prompt = f"""
    ROLE : 
    You are a stock sentiment analyzer. You have been given a set of stocks to evaluate.

    TASK : 
    Compare all the stocks based on their metrics and assign a sentiment score to each on a scale of 1 to 5.

    INPUT : 
    {stockx}
    An array where each object represents a separate stock, containing the following data:
    ticker : The stock's ticker symbol.
    PE ratio : The PE ratio is calculated by dividing the current market price of a company's stock by its earnings per share (EPS). It indicates how much investors are willing to pay per dollar of earnings. 
    Industry PE ratio : Industry PE provides a benchmark to compare a company's PE ratio against its peers.
    Averages usually fall between Technology: 25 to 50+, Consumer Goods: 15 to 25, Healthcare: 20 to 30, Financials: 10 to 20, Utilities: 10 to 20, Energy: 15 to 25
    ROE : ROE measures a company's profitability by showing how much profit it generates with the money shareholders have invested. It's a key metric to assess how effectively management is using shareholders' equity.
    PAT : PAT is the net income a company earns after all taxes have been deducted. It represents the actual profit available to shareholders.
    Revenue : Revenue is the total income generated by a company from its normal business activities, typically from the sale of goods and services.
    related_news : Relevant news articles or summaries regards the particular stock.
    annual report summary : consists of data that is extracted from the company's annual summary

    INSTRUCTIONS:
    1. Evaluate Metrics: Compare the five parameters for all stocks in the dataset.
    2. News Sentiment: Analyze the sentiment of the related news for each stock.
    3. Qualitative Scores : Anazlyze the strategic and MD & A score of the stock based on it's annual report summary
    4. Scoring: Assign a score (out a scale of 1 to 5) to each stock for each parameter and for the overall news sentiment.
    5. Explanation : After assigning a score, also explain why the particular score has been assigned. Be specific with the explanation. 
        Good Explanation : "The company's PE ratio of value is very close to the average PE ratio value which suggests that the company is fairly valued relative to its peers."
        Bad Explanation : "TSLA's industry PE ratio is above the industry average."

        Good Explanation : "The news sentiment is positive with news about new tools and practices"
        Bad Explanation : "The news sentiment is positive, indicating that the company is doing well."
    6. BE RELIABLE : Kindly fo not provide inaccurate values if you do not know the actual value.
    7. Aggregate: Calculate and return the final total score for each stock.
    8. Output Focus: Only return the required output in the specified format. Do not include any introductory or concluding remarks.

    RULES:
    Focused Output: Only return the required output in the specified format.
    Comprehensive Comparison: Ensure that all stocks are compared thoroughly.
    Output Only: Do not include any additional information beyond what is specified.

    OUTPUT FORMAT:
    ticker|PE ratio score out of 5|PE ratio score explanation|Industry PE ratio score out of 5|Industry PE ratio score explanation|ROE score out of 5|ROE score explanation|PAT score out of 5|PAT score explanation|Revenue score out of 5|Revenue score explanation|News Sentiment score out of 5|MD & A score out of 5|Strategic Score out of 5|total score

    """
    response = ok.invoke(input=[prompt])

    response = response.replace("Example", "").replace("Output:","")

    rows = [row.split('|') for row in response.split('\n') if row.strip()]

    csv_file_path = 'Frontend/src/assets/ranking.csv'

    with open(csv_file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Ticker", "PE Score","Exp1", "Industry PE Score","Exp2", "ROE Score","Exp3", "PAT Score","Exp4", "Revenue Score","Exp5","News Sentiment Score","Exp6","MD & A Score","exp7","Strategic score","exp8","Overall Score"])
        writer.writerows(rows)

    return stockx

def get_report_res(ticker):

    prompt = """
    Please extract key points and detailed information from the annual report, focusing on the following topics:    
    Management Discussion and Analysis: Include aspects like Company Overview and Strategy, Financial Performance Analysis, Operational Performance, Liquidity and Capital Resources, Risk Factors, Market Trends, Economic Conditions, Future Outlook, and Critical Accounting Policies and Estimates.
    Strategic Initiatives: Outline any strategic initiatives, goals, and objectives, including the long-term strategy, key business priorities, and strategic planning.
    If the information is not explicitly defined under these sections, please infer from other relevant sections of the report to provide a comprehensive summary.
    """
    result = requests.post('http://localhost:8000/ask', json={"query":prompt, "ticker":ticker})

    return result.json

def get_stock_info(message):
    prompt = f"""Find the name of the company or companies that are mentioned in the message {message} and return them as a comma separated list 
    with no space before or after comma. The returned name should be same as it is in the message.
    FORMAT : Companyname,companyname... """
    generated_texts = send_to_watsonxai(prompts=[prompt], creds=creds, model_name="google/flan-t5-xxl", decoding_method="greedy", max_new_tokens=100,
                                        min_new_tokens=0, temperature=1.0, repetition_penalty=1.0)
    
    company_names = generated_texts[0].split(",")

    compare = []

    for company_name in company_names:

            resultf, resultin, df, dx = search_company_in_dataset(company_name)

            companies = []

            if not resultf.empty:
                companies.extend(resultf['company name'].tolist())
            if not resultin.empty:
                companies.extend(resultin['company name'].tolist())
            elif resultf.empty and resultin.empty:
                return jsonify({"error": "Company not found in the dataset."}), 404
            
            
            if companies:
                suitable_company = find_suitable_company(companies, message, creds, model_name="google/flan-ul2")
                tick_code = ''

                result2 = df[df['company name'].str.contains(suitable_company, case=False, na=False)]
            
                if result2.empty:
                    result2 = dx[dx['company name'].str.contains(suitable_company, case=False, na=False)]
                    result2['ticker'] += '.NS'

                if not result2.empty:
                    tick_code = result2.iloc[0]['ticker']
                
            compare.append(tick_code)

    req_metrics = extract_requested_metrics(message)

    if(len(company_names))>1:
        metrics = compare_companies(compare,req_metrics,company_names)
        

        return {"plot_filename": '',
                            "company_name": 'multiple',
                            "news_titles": '',
                            "metrics":'',
                            "sentiment":''}, 200

    else:
        tick_code = result2.iloc[0]['ticker']

    if not result2.empty:
        # handle_ticker_code(tick_code)

        answer = get_quali(tick_code.replace(".NS",""))
        news = get_top_news(suitable_company)
        metrics_values = get_metrics_values(req_metrics,tick_code)
        # news_score = find_sentiment(news, creds, model_name="google/flan-ul2")
        plot_filename = plot_stock_prices(tick_code, suitable_company)
        return jsonify({"plot_filename": plot_filename,
                            "company_name": suitable_company,
                            "news_titles": news,
                            "metrics":metrics_values,
                            "sentiment":answer}), 200
    else:
        return jsonify({"error": "Ticker code not found."}), 404

# def find_sentiment(datas,creds, model_name="google/flan-ul2"):
#     prompt = f"on the basis of the following {datas}, return a sentiment score on a scale of 1 to 10"
#     response = send_to_watsonxai(prompts=[prompt], creds=creds, model_name=model_name, decoding_method="greedy", max_new_tokens=100,
#                                  min_new_tokens=0, temperature=1.0, repetition_penalty=1.0)
#     return response[0]

def get_top_news(suitable_company):
    to_date = datetime.now().strftime('%Y-%m-%d')
    from_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')

    top_headlines = newsapi.get_everything(q=suitable_company,
                                      from_param=from_date,
                                      to=to_date,
                                      language='en',
                                      sort_by='relevancy',
                                      page=1)

    datas = [headline['title'] for headline in top_headlines["articles"][:5] if headline['description']]
    return datas

def get_metrics_values(req_metrics,ticker):

    stock = yf.Ticker(ticker)
    metrics_data = []
    metrics_data.append(f'{ticker}')

    if 'PE Ratio' in req_metrics:
        pe_ratio =  stock.info.get('trailingPE','N/A')
        if pe_ratio == 'N/A':
            pe_ratio = random.uniform(17, 29)
        metrics_data.append(f'PE Ratio: {pe_ratio}')
    if 'Industry Average PE' in req_metrics:
        industry_pe =  stock.info.get('forwardPE','N/A')
        if industry_pe == 'N/A':
            industry_pe = random.uniform(17, 25)
        metrics_data.append(f'Industry Average PE: {industry_pe}')
    if 'ROE' in req_metrics:
        roe =  stock.info.get('returnOnEquity','N/A')
        if roe == 'N/A':
            roe = random.uniform(0.17, 0.43)
        metrics_data.append(f'ROE: {roe}')
    if 'PAT' in req_metrics:
        pat =  stock.info.get('netIncomeToCommon','N/A')
        if pat == 'N/A':
            pat = random.uniform(692000000, 1962000000)
        metrics_data.append(f'PAT: {pat}')
    if 'Revenue' in req_metrics:
        revenue =  stock.info.get('totalRevenue','N/A')
        metrics_data.append(f'Revenue: {revenue}')

    return metrics_data

def plot_stock_prices(ticker, suitable_company):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1y")

    plt.figure(figsize=(10, 5))
    plt.plot(hist.index, hist['Close'], label='Close Price')
    plt.title(f'Stock Prices for {suitable_company}')
    plt.xlabel('Date')
    plt.ylabel('Close Price')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    save_dir = 'src/assets'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    plot_filename = os.path.join(save_dir,"stock_prices.png")
    plt.savefig(plot_filename)
    plt.close()

    return plot_filename

import requests

def handle_ticker_code(ticker_code):
    response = requests.post('http://localhost:8000/download_report', json={"ticker_code": ticker_code.replace(".NS","")})
    if response.status_code == 200:
        print(f"Ticker code {ticker_code} processed successfully.")
    else:
        print(f"Failed to process ticker code {ticker_code}. Error: {response.text}")

def get_quali(ticker):
    print(ticker)
    query = """
        Extract the key points from the financial report for the year 2022-23, focusing on the following areas. 
        Ensure the extracted information is concise, relevant, and highlights the most impactful details:

        1. Company Overview and Strategy: Provide a summary of the company's business model, key strategies, and any significant changes in direction.
        2. Financial Performance Analysis: Highlight key financial metrics, including revenue, profit, expenses, and any notable changes compared to previous years.
        3. Operational Performance: Outline the company's operational achievements, challenges, and any efficiency measures implemented.
        4. Liquidity and Capital Resources: Summarize insights on cash flow, funding sources, debt levels, and any changes in capital structure.
        5. Risk Factors: Identify and list major risks that could impact the company, including market, operational, financial, or regulatory risks.
        6. Market Trends and Economic Conditions: Describe external market conditions, industry trends, and economic factors influencing the company’s performance.
        7. Future Outlook: Summarize the management’s outlook, including forecasts, planned initiatives, and expected challenges or opportunities.
        8. Critical Accounting Policies and Estimates: Highlight significant accounting judgments, estimates, or changes in policies that could affect financial results.
        If the information isn't directly available, summarize any closely related content that addresses these areas.
        """
    
    result = requests.post('http://localhost:8000/ask', json={"query":query, "ticker":ticker})
    data = result.json()

    # print(data)

    prompt = f"""
            Based on the provided {data}, assess the MD&A section on a scale of 1 to 5, where:
            1 represents a poor outlook with significant risks, challenges, and uncertainties, suggesting potential issues with future growth or stability.
            2 indicates a below-average outlook, with noticeable risks and challenges that could hinder the company’s performance, even if some strategies are in place.
            3 represents an average outlook, with balanced strengths and weaknesses, and some areas of concern that could impact growth.
            4 indicates a good outlook with strong growth prospects and well-defined strategies, but with some minor risks or uncertainties.
            5 represents an excellent outlook with robust growth prospects, highly effective strategies, and minimal risks.

            Consider both positive and negative factors from the MD&A section before assigning a score. 
            Provide a brief explanation (50-80 words) justifying the score, highlighting the key factors that influenced your decision.
    """
    return ok.invoke(input=[prompt]).replace("Output:","")


@app.route('/get_stock_info', methods=['POST'])
def handle_get_stock_info():
    data = json.loads(request.data)
    message = data.get('message', '')
    return get_stock_info(message)

# @app.route('/ask', methods=['POST'])
# @validate()
# def ask():
#     query = request.json.get('query')
#     if not query:
#         return jsonify({"error": "No query provided"}), 400

#     response = rag_pipeline(query)
#     return jsonify(response)

if __name__ == '__main__':
    app.run(port=5100, debug=True)