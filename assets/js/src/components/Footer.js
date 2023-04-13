import React,{useEffect, useState} from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import Logo from '../../../image/logo.png'
import starUrl, { ReactComponent as Facebook } from '../../../image/svgs/1.svg'
import starUrlone, { ReactComponent as Youtube } from '../../../image/svgs/2.svg'
import starUrltwo, { ReactComponent as Twitter } from '../../../image/svgs/3.svg'
import starUrlthree, { ReactComponent as Starsss } from '../../../image/svgs/4.svg'
import starUrlfour, { ReactComponent as Instagram } from '../../../image/svgs/5.svg'

const Footer = () => {

    const [footermenu, setFooterMenu] = useState([]);
    const [widgets, setWidgets] = useState([]);
    const location = useLocation();

  // This effect only runs once when the component is first loaded.
  useEffect(() => {
    // Use the async/await pattern to handle the promise returned by the fetch call
    const fetchData = async () => {
      try {
        const response = await fetch(wpScienceTheme.apiUrl + "/v1/navigation/menu/2");

        const data = await response.json();
        setFooterMenu(data);

        const sidebar = await fetch(wpScienceTheme.apiUrl + `/v3/sidebar/Footer`);
        const sidebars = await sidebar.json();
        setWidgets(sidebars);

      } catch (error) {
        console.error(error);
      }
    };
  fetchData()
  }, []);


  return (
    <footer className="section widget">
        <div className="container">
            <div className="widget_row">
                <div className="widget_logo">
                    <a href="#"><img src={Logo} alt='' /></a>
                    <p>Professional WordPress plugins</p>
                    <ul className="widget_social_share">
                        <li><a href="#"><Facebook /></a></li>
                        <li><a href="#"><Youtube /></a></li>
                        <li><a href="#"><Twitter /></a></li>
                        <li><a href="#"><Starsss /></a></li>
                        <li><a href="#"><Instagram /></a></li>
                    </ul>
                </div>
                 {widgets && (<div className='widget-n'><div className='row' dangerouslySetInnerHTML={{ __html: widgets }} /></div>)}
            </div>
            <div className="copyright_text">
                <p>© All Right Reserved 2022-2023. <a href="/sitemap">Sitemap</a></p>
            </div>
        </div>
    </footer>

  )
};

export default Footer