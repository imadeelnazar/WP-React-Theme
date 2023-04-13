import React,{useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import Axios from "axios";

import Pagination from '../components/Sections/pagination';


const ImageWithPostID = ({ inputdata }) => {
  const [tsrc, setTSrc] = useState(null);

  useEffect(() => {
    fetch(wpScienceTheme.apiUrl + `/v3/fimage/id/${inputdata}`)
        .then((res) => res.json())
        .then((data) => {
            // console.log(data)
            setTSrc(data);
            // console.log(src)
            // console.log(data);
        });
  }, [inputdata]);
  return tsrc ? <img src={tsrc[0]} alt="ddd"/> : 'hello';
}


const PageTemplate =() =>{
    const [acfData, setAcfData] = useState({});
    async function PostApi (){
        if (wpScienceTheme.page_on_front_ID) {
            const response_dev = await fetch(wpScienceTheme.apiUrl + `/wp/v2/pages/${wpScienceTheme.page_on_front_ID}`);
            if (response_dev.ok) {
                const dataAcf = await response_dev.json();

                // if (dataAcf.acf) {
                //     setAcfData(dataAcf.acf);
                // }
                if (dataAcf) {
                    setAcfData(dataAcf);
                }
            }
        }
    }

    useEffect(()=>{
        PostApi();
    },[acfData])

  return (
    <div>
        {acfData && acfData.title && (
        <div className='default-content'>
            <div className='default-sub-header'>
                <div className='container'>
                    {acfData.title && (<h1>{acfData.title.rendered}</h1>)}
                </div>
            </div>
            <div className='container'>
                {acfData.content && (<div dangerouslySetInnerHTML={{ __html: acfData.content.rendered }} />)}
            </div>
        </div>
        )}
    </div>
  )
}


const ImageSrcByName = ({fieldname}) => {
  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    async function fetchFieldValue() {
      const response = await fetch(wpScienceTheme.apiUrl + `/ultimate/v1/customizer/${fieldname}`);
      const data = await response.json();
      setFieldValue(data);
    }
    fetchFieldValue();
  }, []);

  return fieldValue ? <img src={fieldValue} alt="" /> : '';
}

const Home = () => {



    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [dPage, setDPage] = useState(1);
    const [nrofpages, setNumberofpage] = useState(1);

    const params = useParams();

    if(wpScienceTheme.show_on_front == 'posts'){
        // When the page number changes call the api for posts.
        useEffect(() => {
            Axios.get(wpScienceTheme.apiUrl + `/wp/v2/posts`, {params: { page: page }
        }).then(response => {
            // Store the number of posible pages.
            setNumberofpage(response.headers["x-wp-totalpages"]);
            // Store the posts from the response.
            setPosts(response.data);


        });
        }, [page, setPosts]);

    }

    return (
    <div className='wp-content'>

        {wpScienceTheme.show_on_front == 'posts' ? (
        <div className='main-wrapper'>
            <div className="main-banner-wrapper">
                <figure className="banner-bg-img">
                    <ImageSrcByName fieldname="ultimate_subheader_BG" />
                    <div className="banner-content">
                        <h2>WordPress Home</h2>
                    </div>
                </figure>
            </div>

            <div className='container'>
                <div className='posts-app__post-list'>
                    <div className="row">
                        {posts &&
                        posts.length &&
                        posts.map((post, index) => {
                            return (
                            <div key={post.id} className="posts-app__post col-md-12">
                                <a href={post.guid.rendered}><ImageWithPostID inputdata={post.id} /></a>
                                {post.title && (<h2 ><a href={post.guid.rendered} dangerouslySetInnerHTML={{ __html: post.title.rendered }} /></h2>)}
                                {post.content && (<div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />)}
                            </div>
                            );
                        })}
                    </div>
                    {nrofpages === 1 ?
                    (' ')
                    :
                    <Pagination
                        nrOfPages={nrofpages}
                        currentpage={page}
                        onSelectPage={n => {
                        setPage(n);
                        }}
                    />
                    }
                </div>
            </div>
        </div>
        ) : <PageTemplate/>}
    </div>
    )
}

export default Home;