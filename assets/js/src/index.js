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

const Home = lazy(() => {
  return Promise.all([
    import("../src/pages/Home"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});
const Posts = lazy(() => {
  return Promise.all([
    import("../src/pages/Posts"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});
const Pages = lazy(() => {
  return Promise.all([
    import("../src/pages/Pages"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});
const SubPages = lazy(() => {
  return Promise.all([
    import("./pages/SubPages"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});

const Testimonial = lazy(() => {
  return Promise.all([
    import("../src/pages/Testimonial"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});
const Archive = lazy(() => {
  return Promise.all([
    import("../src/pages/Archive"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});
const ArchiveDate = lazy(() => {
  return Promise.all([
    import("../src/pages/ArchiveDate"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});
const Author = lazy(() => {
  return Promise.all([
    import("../src/pages/Author"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});


const ArchiveTag = lazy(() => {
  return Promise.all([
    import("../src/pages/ArchiveTag"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});
const Search = lazy(() => {
  return Promise.all([
    import("../src/pages/Search"),
    new Promise(resolve => setTimeout(resolve, 500))
  ])
  .then(([moduleExports]) => moduleExports);
});

// const Home = lazy(() => import('../src/pages/home'));
// const Archive = lazy(() => import('../src/pages/Archive'));
// const Posts = lazy(() => import('../src/pages/Posts'));
// const Pages = lazy(() => import('../src/pages/Pages'));
// const Testimonial = lazy(() => import('../src/pages/Testimonial'));


const url = wpScienceTheme.homeURL;
const domainURL = url.replace(/^.*\/\/[^\/]+/, '');


function Main() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // Set a timeout to simulate a loading delay

    return () => {
      clearTimeout(timeout);
    }
  }, []);

  return (
    <div>
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
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Main />
  </Router>
);