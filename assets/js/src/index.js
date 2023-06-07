import React, { useState, useEffect, lazy, Suspense, Component } from 'react';
import Slider from "react-slick";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import PageLoader from './pageLoader';
import '../../css/header.css'
import '../../css/typography.css'

import Navigation from './navigation';
import Footer from './components/Footer';
import NotFound from '../src/pages/NotFound';


import Home from '../src/pages/Home';
import Posts from '../src/pages/Posts';
import Pages from '../src/pages/Pages';
import Search from '../src/pages/Search';
import ArchiveTag from '../src/pages/ArchiveTag';
import Author from '../src/pages/Author';
import ArchiveDate from '../src/pages/ArchiveDate';
import Archive from '../src/pages/Archive';
import Testimonial from '../src/pages/Testimonial';
import SubPages from '../src/pages/SubPages';

const url = wpScienceTheme.homeURL;
const domainURL = url.replace(/^.*\/\/[^\/]+/, '');

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );
}

function Main() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(()=>{
      setIsLoaded(true);
    },2000)
  }, []);

  return (
    <div>

      {isLoaded ? (
        <>
        <Navigation />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route exact path={domainURL} element={<Home />} />
            <Route path={domainURL+':slug/*'} element={<Pages />} />
            <Route exact path={domainURL+'blog/:slug'} element={<Posts />} />
            <Route exact path={domainURL+'testimonials/:slug'} element={<Testimonial />} />
            <Route exact path={domainURL+'category/:slug'} element={<Archive />} />
            <Route exact path={domainURL+'tag/:slug'} element={<ArchiveTag />} />
            <Route path={domainURL+'search/:slug'} element={<Search />} />
            <Route path={domainURL+'search'} element={<Search />} />
            <Route path={domainURL+':year/:month/:day/'} element={<ArchiveDate />} />
            <Route path={domainURL+'author/:slug'} element={<Author />} />
            <Route path={domainURL+':year/:month/'} element={<ArchiveDate />} />
            <Route exact path={domainURL+'(.*)[?&]s=:searchTerm'} element={<Search />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Main />
  </Router>
);