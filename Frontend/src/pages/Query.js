import React, { useState,useEffect } from "react";
import '../styles/Query.css'
import Loader from "../components/Loader";
import stockPricesImage from '../assets/stock_prices.png';
import logo from '../assets/IBM_bee_icon.png'
import Papa from 'papaparse'
import rankData from '../assets/ranking.csv'
import Swal from 'sweetalert2';


const QueryComponent = () => {
  const [question, setQuestion] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [cname, setCname] = useState("");
  const [news,setNews] = useState([])
  const [metrics,setMetrics] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); 

  const[data,setData]=useState([])
    useEffect(() => {
        const fetchParseData = async () => {
            Papa.parse(rankData,{
                download:true,
                delimiter:",",
                header:true,
                complete:((result) => {
                    setData(result.data)
                    console.log(result.data)
                })
            })
        }
        fetchParseData()
    }, [])

  const sendMessage = async () => {
      if (userInput.trim() === '') return;

      const userMessage = { sender: 'user-cb', text: userInput };
      setMessages([...messages, userMessage]);
      setUserInput('');

      try {
          const response = await fetch('http://localhost:8000/ask', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: userInput, ticker:'BHARTIARTL' }),
          });

          const data = await response.json();
          const botMessage = { sender: 'bot-cb', text: data.answer };
          setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
          console.error('Error fetching bot response:', error);
      }
  };

  const handleQuery = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5100/get_stock_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }), 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data)
      setSentiment(data.sentiment);
      setNews(data.news_titles);
      console.log(data.news_titles.answer)
      setCname(data.company_name);
      setMetrics(data.metrics);

    } catch (error) {
      console.error("Error querying server:", error);
      setSentiment("Error: Failed to query server.");
    } finally {
      setIsLoading(false);
    }

  };

  const handleExplanation = (exp1, exp2, exp3, exp4, exp5, exp6) => {
    const explanationText = `
      1. ${exp1 || 'N/A'}

      2. ${exp2 || 'N/A'}

      3. ${exp3 || 'N/A'}

      4. ${exp4 || 'N/A'}

      5. ${exp5 || 'N/A'}

      6. ${exp6 || 'N/A'}
    `;
  
    Swal.fire({
      title: 'Explanation',
      text: explanationText.trim(),
      icon: 'info',
      confirmButtonText: 'OK',
      width: '600px',
      padding: '20px',
      html: explanationText.replace(/\n/g, '<br/>') 
    });
  };
  

  return (
    <div className="query-rag-main">
      {isLoading ? (
        <Loader/>
      ) : (
        <>
          <h2>Marketwatch.ai</h2>
          <div className="query-form">
            <div className="search-bar">
              <input
                className="input"
                type="text"
                id="questionInput"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your Query"
              />
              <button onClick={handleQuery}>Check Sentiment</button>
            </div>
            <div className="father-div">
            {sentiment && (
              <div className="response-container">
                  <p className="response"><b>{sentiment}</b></p>
              </div>
            )}
            {metrics.length>0 && (
              <div className="response-container0">
                  <p className="response"><b>Requested Metrics Data</b></p>
                  {metrics.map((item, index) => (
                    <p key={index} className="metrics-item">
                      {index + 1} - {item}
                    </p>
                  ))}
              </div>
            )}
            </div>
            <div className="father-div">
              {sentiment && (
                <div className="response-container1">
                    <p className="response"><b>Stock Trend over the past year : </b></p>
                    <img className="imgplot" src={stockPricesImage}></img>
                </div>
              )}
              {sentiment && news.length > 0 && (
                <div className="response-container2">
                  <p><b>News Headlines</b></p>
                  {news.map((item, index) => (
                    <p key={index} className="news-item">{index+1} - {item}</p>
                  ))}
                </div>
              )}
              {sentiment && news.length == 0 && (
                <div className="response-container2">
                  <p><b>No News Headlines Found</b></p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div className="chat-container-cb">
          <button className="toggle-btn-cb" onClick={() => setIsOpen(!isOpen)}>
              {
              isOpen ? ' X ' 
              : 
              <img src={logo} className="toggle-img" alt="I Bee M"></img>
              // <SiIbmcloud/>
              }
          </button>
          {isOpen && (
              <div className="chatbox-cb">
                  <div className="messages-cb">
                      {messages.map((msg, index) => (
                          <div key={index} className={`message-cb ${msg.sender}`}>
                              {msg.text}
                          </div>
                      ))}
                  </div>
                  <div className="user-input-container-cb">
                      <input
                          type="text"
                          className="user-input-cb"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="Type a message..."
                      />
                      <button className="send-btn-cb" onClick={sendMessage}>Send</button>
                  </div>
              </div>
          )}
      </div>

      {cname==='multiple' && 
      <div className="ranking-table">

        <table>
            <thead>
                <tr className="multi-level-table">
                    <th rowSpan="2">Ticker Code</th>
                    <th colSpan="5">Quantitative Scores</th>
                    <th colSpan="3">Qualitative Scores</th>
                    <th rowSpan="2">Overall Score</th>
                    <th rowSpan="2"></th>
                </tr>
                <tr>
                    <th>PE Ratio score</th>
                    <th>Industry PE score</th>
                    <th>ROE score</th>
                    <th>PAT score</th>
                    <th>Revenue score</th>
                    <th>News Sentiment score</th>
                    <th>MD & A score</th>
                    <th>Strategic score</th>
                </tr>
            </thead>
            <tbody>
                {data.slice(0, -1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{row['Ticker']}</td>
                        <td>{row['PE Score']}</td>
                        <td>{row['Industry PE Score']}</td>
                        <td>{row['ROE Score']}</td>
                        <td>{row['PAT Score']}</td>
                        <td>{row['Revenue Score']}</td>
                        <td>{row['News Sentiment Score']}</td>
                        <td>{row['MD & A Score']}</td>
                        <td>{row['Strategic score']}</td>
                        <td>{row['Overall Score']}</td>
                        <td><button onClick={() => handleExplanation(row['Exp1'],row['Exp2'],row['Exp3'],row['Exp4'],row['Exp5'],row['Exp6'])}>View Explanation</button></td>
                    </tr>
                ))}
            </tbody>
        </table>

        </div>}

    </div>
    
  );
};

export default QueryComponent;
