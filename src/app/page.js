'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiClock, FiSun } from 'react-icons/fi';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StructuredData from './components/StructuredData';

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        if (!apiKey) {
          throw new Error('Weather API key is not configured. Please check your .env.local file.');
        }

        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Jakarta&aqi=no`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            throw new Error('Invalid or expired API key. Please check your WeatherAPI.com API key.');
          }
          throw new Error(`Failed to fetch weather data: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        // Transform the data to match our expected format
        const transformedData = {
          main: {
            temp: data.current.temp_c
          },
          weather: [{
            description: data.current.condition.text
          }]
        };
        setWeather(transformedData);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError(error.message);
      }
    };

    fetchWeather();

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className="min-h-screen">
      <StructuredData />
      <Navbar />
      <div id="home">
        <Home currentTime={currentTime} weather={weather} weatherError={weatherError} />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="certificates">
        <Certificates />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
