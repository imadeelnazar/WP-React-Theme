import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Logo from '../../image/logo.png'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

const DynamicMenu = () => {
  const [menu, setMenu] = useState([]);
  const [menuTop, setMenuTop] = useState([]);
  const location = useLocation();

  // This effect only runs once when the component is first loaded.
  useEffect(() => {
    // Use the async/await pattern to handle the promise returned by the fetch call
    const fetchData = async () => {
      try {

        if(wpScienceTheme.main_navi != null){
          const response = await fetch(wpScienceTheme.apiUrl + "/v1/navigation/menu/"+wpScienceTheme.main_navi);

          const data = await response.json();

          setMenu(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
  fetchData()
  }, []);

  // This effect only runs once when the component is first loaded.
  useEffect(() => {
    // Use the async/await pattern to handle the promise returned by the fetch call
    const fetchDataD = async () => {
      try {
        if(wpScienceTheme.top_navi != null){
          const response = await fetch(wpScienceTheme.apiUrl + "/v1/navigation/menu/"+wpScienceTheme.top_navi);
          const data = await response.json();
          // console.log(data)
          setMenuTop(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
  fetchDataD()
  }, []);

const ImageSrcByName = ({fieldname}) => {
  const [fieldValue, setFieldValue] = useState('');


  // useEffect(() => {
  //   if (wp.customize && wp.customize.instance(fieldname)) {
  //     wp.customize(fieldname, (value) => {
  //       setFieldValue(value());
  //       value.bind((newValue) => {
  //         setFieldValue(newValue);
  //       });
  //     });
  //   }
  // }, [fieldname]);

  useEffect(() => {
    async function fetchFieldValue() {
      const response = await fetch(wpScienceTheme.apiUrl + `/ultimate/v1/customizer/${fieldname}`);
      const data = await response.json();
      setFieldValue(data);
    }
    fetchFieldValue();
  }, [fieldname]);

  return fieldValue ? <img src={fieldValue} alt="" /> : '';
}

const Children = ({ menu, id }) => {
  const hasMenu = menu && menu.length > 0;
  const filteredMenu = hasMenu ? menu.filter((nnn) => nnn.menu_item_parent == id) : [];

  return (
    <>
      {hasMenu && filteredMenu.length > 0 && (
        <ul className="sub-menu">
          {filteredMenu.map((nnn) => (
            <li key={nnn.ID}>
              <Link
                to={nnn.url}
                className={location.pathname === nnn.url ? "active" : ""}
              >
                {nnn.title}
              </Link>
              <Children menu={menu} id={nnn.ID} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

// function SiteTitle() {
//    const [title, setTitle] = useState('');

//    useEffect(() => {
//       wp.customize('mytheme_title', (value) => {
//          setTitle(value());
//       });
//    }, []);

//    return (
//       <h1>{title}</h1>
//    );
// }

  return (
  <>
			<div className='header'>
				<div className='wp-science_top_bar'>
					<div className='container'>
						<ul className='wp-science_top_text'>
							{menuTop && menuTop.length !== 0 && menuTop.map(item => (
                <li key={item.ID}>
                  <Link to={item.url} className={location.pathname === item.url ? 'active' : ''}>
                    {item.title}
                  </Link>
                </li>
              ))}
              {menuTop && menuTop.length === 0 && (<h4>Please select Menu From Dashboard > Appearence > Menu</h4>)}
						</ul>
					</div>
				</div>
				<div className='wp-science_navi_wrap'>
					<div className='container'>
						<div className='wp-science_navi_row'>
							<div className='wp-science_logo'>
								<h1><a href={wpScienceTheme.homeURL}><ImageSrcByName fieldname="ultimate_logo" /></a></h1>
							</div>
							<ul className="main-navigation">
                {menu && menu.map(item => (
                  item.menu_item_parent === '0' ? (
                    <li key={item.ID}>
                      <Link to={item.url} className={location.pathname === item.url ? 'active' : ''}>
                        {item.title}
                      </Link>
                      <Children menu={menu} id={item.ID} />
                    </li>
                  ) : null
                ))}
                {menu && menu.length === 0 && (<h4>Please select Menu From Dashboard > Appearence > Menu</h4>)}
								<li><a className='user_icon' href='#'><i className='fa fa-user'></i></a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
</>
    );
}

export default DynamicMenu;