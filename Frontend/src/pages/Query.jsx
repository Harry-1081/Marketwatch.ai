import React, { useState,useEffect } from "react";
import '../styles/Query.css'
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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
    <>

    <Navbar/>

    <div className="w-full h-full my-[100px] mt-[50px] p-8 text-black flex flex-col justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="text-4xl">Marketwatch.ai</h2>
          <div className="w-11/12 flex flex-col justify-center items-center gap-10">
            <div className="flex gap-10">
              <input
                className="rounded-lg outline outline-4 outline-blue-700 border-0 bg-gray-300 focus:bg-white outline-offset-3 p-3 w-[600px] transition duration-300"
                type="text"
                id="questionInput"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your Query"
              />
              <button className="text-lg p-3 bg-black text-white rounded-lg font-bold transition duration-500 outline-4 outline-blue-700 hover:bg-gray-300 hover:text-black outline-offset-3" onClick={handleQuery}>
                Check Sentiment
              </button>
              </div>

              <div className="flex justify-around w-full gap-2">
                {sentiment && (
                  <div className="w-1/2 text-lg p-4 bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col text-center justify-center overflow-y-auto">
                    <p className="font-bold">{sentiment}</p>
                  </div>
                )}

                {metrics.length > 0 && (
                  <div className="w-1/3 text-lg p-4 bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[30vh] flex flex-col overflow-y-scroll scrollbar-hide">
                    <p className="font-bold">Requested Metrics Data</p>
                    {metrics.map((item, index) => (
                      <p key={index} className="my-2">
                        {index + 1} - {item}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Trend and News Section */}
              <div className="flex flex-wrap justify-around w-full gap-2">
                {news.length>0 && (
                  <div className="w-1/2 text-lg p-[40px] bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col overflow-y-auto scrollbar-hide">
                    <p className="font-bold">Stock Trend over the past year:</p>
                    <img className="w-full mt-2" src={stockPricesImage} alt="Stock Prices" />
                  </div>
                )}

                {!sentiment && news.length > 0 && (
                  <div className="w-1/3 text-lg p-4 bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col overflow-y-auto scrollbar-hide">
                    <p className="font-bold">News Headlines</p>
                    {news.map((item, index) => (
                      <p key={index} className="my-2">
                        {index + 1} - {item}
                      </p>
                    ))}
                  </div>
                )}

                {sentiment && news.length === 0 && (
                  <div className="w-1/3 text-lg p-4 bg-gray-300 rounded-lg outline outline-4 outline-blue-700">
                    <p className="font-bold">No News Headlines Found</p>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex justify-center">
              {sentiment && (
                <div className="w-3/5 text-lg p-3 bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col text-center justify-center overflow-y-auto">
                  <p className="font-bold">{sentiment}</p>
                </div>
              )}

              {metrics.length > 0 && (
                <div className="w-3/5 text-lg p-3 bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[30vh] flex flex-col overflow-y-auto">
                  <p className="font-bold">Requested Metrics Data</p>
                  {metrics.map((item, index) => (
                    <p key={index} className="my-2">{index + 1} - {item}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {sentiment && (
                <div className="w-1/2 text-lg p-3 bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col overflow-y-auto">
                  <p className="font-bold">Stock Trend over the past year:</p>
                  <img className="w-full" src={stockPricesImage} alt="Stock Prices" />
                </div>
              )}

              {sentiment && news.length > 0 && (
                <div className="w-1/3 text-lg p-3 bg-gray-300 rounded-lg outline outline-4 outline-blue-700 max-h-[50vh] flex flex-col overflow-y-auto">
                  <p className="font-bold">News Headlines</p>
                  {news.map((item, index) => (
                    <p key={index} className="my-2">{index + 1} - {item}</p>
                  ))}
                </div>
              )}

              {sentiment && news.length === 0 && (
                <div className="w-1/3 text-lg p-3 bg-gray-300 rounded-lg outline outline-4 outline-blue-700">
                  <p className="font-bold">No News Headlines Found</p>
                </div>
              )}
            </div>
          </div> */}
        </>
      )}

      <div className="fixed bottom-12 right-8 z-50">
        <button className="bg-gray-100 text-black p-2 w-14 rounded cursor-pointer mb-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? ' X ' : <img src={logo} className="w-9" alt="I Bee M" />}
        </button>

        {isOpen && (
          <div className="bg-white rounded-lg shadow-lg w-72 h-[400px] overflow-y-auto p-5 flex flex-col">
            <div className="flex-grow flex flex-col overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'user-cb' ? 'self-end bg-teal-100' : 'self-start bg-gray-200'} p-2 rounded-lg max-w-[70%]`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex mt-3">
              <input
                type="text"
                className="flex-grow p-2 bg-gray-200 rounded-tl-lg rounded-bl-lg"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="p-2 bg-blue-500 text-white rounded-tr-lg rounded-br-lg" onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>

      {cname === 'multiple' && (
        <div className="my-8 w-4/5">
         <table className="w-full border border-gray-600 rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th rowSpan="2" className="px-[20px] py-[15px] border border-gray-500 text-center">Ticker Code</th>
                <th colSpan="5" className="px-[20px] py-[15px] border border-gray-500 text-center">Quantitative Scores</th>
                <th colSpan="3" className="px-[20px] py-[15px] border border-gray-500 text-center">Qualitative Scores</th>
                <th rowSpan="2" className="px-[20px] py-[15px] border border-gray-500 text-center">Overall Score</th>
                <th rowSpan="2" className="px-[20px] py-[15px] border border-gray-500"></th>
              </tr>
              <tr>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">PE Ratio</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">Industry PE</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">ROE</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">PAT</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">Revenue</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">News Sentiment</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">MD&A Section</th>
                <th className="px-[20px] py-[15px] border border-gray-500 text-center">Business Strategy</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, -1).map((row, rowIndex) => (
                <tr key={rowIndex} className={`bg-white ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-[20px] py-[15px] border border-gray-500">{row['Ticker']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['PE Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['Industry PE Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['ROE Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['PAT Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['Revenue Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['News Sentiment Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['MD & A Score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">{row['Strategic score']}</td>
                  <td className="px-[20px] py-[15px] border border-gray-500 text-center">
                    {parseFloat(row['PE Score'] || 0) + 
                    parseFloat(row['Industry PE Score'] || 0) + 
                    parseFloat(row['ROE Score'] || 0) + 
                    parseFloat(row['PAT Score'] || 0) + 
                    parseFloat(row['Revenue Score'] || 0) + 
                    parseFloat(row['News Sentiment Score'] || 0) + 
                    parseFloat(row['MD & A Score'] || 0) + 
                    parseFloat(row['Strategic score'] || 0)}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      onClick={() => handleExplanation(row['Exp1'], row['Exp2'], row['Exp3'], row['Exp4'], row['Exp5'], row['Exp6'])}
                    >
                      View Explanation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>

    <Footer/>

    </>
  );
};

export default QueryComponent;
