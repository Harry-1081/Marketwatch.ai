import React from "react";
import "../styles/About.css";
const About = () => {
  return (
    <div className="about">
      <div className="aboutBottom">
        <h1>ABOUT US</h1>
        <h2>Our Vision</h2>
        <p>
          Welcome to MarketWatch.ai, where cutting-edge AI technology meets the financial market to provide you with accurate and insightful stock sentiment analysis and recommendations. Our mission is to simplify the process of making informed investment decisions through advanced AI-powered tools.
        </p>
        <h2>What We Do</h2>
        <p>
          At MarketWatch.ai, we leverage the power of artificial intelligence, specifically RAG (Retrieval-Augmented Generation), to deliver precise stock sentiment analysis and recommendations. Whether you're an investor seeking insights on market trends or exploring new investment opportunities, MarketWatch.ai is here to assist you.
        </p>
        <h2>Why Choose MarketWatch.ai?</h2>
        <p>
          We are committed to transparency, integrity, and innovation in everything we do. Your trust and satisfaction are at the core of our mission. Our advanced dashboarding and QA system ensure you receive real-time, actionable insights to make confident investment decisions.
        </p>
        <h2>Contact Us</h2>
        <p>
          Have questions or feedback? Reach out to our team at <a href="mailto:contact@MarketWatch.ai.com">contact@MarketWatch.ai.com</a>. Join us on our journey to unlock the potential of AI-driven stock analysis and recommendations with MarketWatch.ai.
        </p>
      </div>
    </div>
  );
};
export default About;