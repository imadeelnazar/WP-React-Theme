import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Axios from "axios";

import Pagination from '../components/Sections/pagination';

const ImageWithPostID = ({ inputdata }) => {
  const [tsrc, setTSrc] = useState(null);

  useEffect(() => {
    fetch(wpScienceTheme.apiUrl + `/v3/fimage/id/${inputdata}`)
        .then((res) => res.json())
        .then((data) => {
            setTSrc(data);
            // console.log(src)
            // console.log(data);
        });
  }, [inputdata]);

  return tsrc ? <img src={tsrc[0]} alt="ddd"/> : '';
}


const Search = () => {

    const [category, setCategory] = useState({});
    const params = useParams();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [nrofpages, setNumberofpage] = useState(1);



    if (params.slug && typeof params.slug === 'string') {

        // When the page number changes call the api for posts.
        useEffect(() => {
            Axios.get(wpScienceTheme.apiUrl + `/wp/v2/search/?search=${params.slug}`, {params: { page: page }
        }).then(response => {
            // Store the number of posible pages.
            setNumberofpage(response.headers["x-wp-totalpages"]);
            // Store the posts from the response.
            setPosts(response.data);
        });
        }, [page, setPosts]);
    }else{

        const queryParams = new URLSearchParams(window.location.search);
        const slug = queryParams.get('search');

        if(slug == null){
            // When the page number changes call the api for posts.
            useEffect(() => {
                // Axios.get(wpScienceTheme.apiUrl + `/wp/v2/search`, {params: { page: page }
                Axios.get(wpScienceTheme.apiUrl + `/wp/v2/search/`, {params: {
                    search: slug,
                    page: page,
                    _embed: true
                }
                }).then(response => {
                    // Store the number of posible pages.
                    setNumberofpage(response.headers["x-wp-totalpages"]);
                    // Store the posts from the response.
                    setPosts(response.data);
                });
            }, [page, setPosts]);

        }else{

            // When the page number changes call the api for posts.
            useEffect(() => {
                // Axios.get(wpScienceTheme.apiUrl + `/wp/v2/search`, {params: { page: page }
                Axios.get(wpScienceTheme.apiUrl + `/wp/v2/search/?search=${slug}`, {params: {
                    search: slug,
                    page: page,
                    _embed: true
                }
                }).then(response => {
                    // Store the number of posible pages.
                    setNumberofpage(response.headers["x-wp-totalpages"]);
                    // Store the posts from the response.
                    setPosts(response.data);


                });
            }, [page, setPosts]);
        }
    }


    return (
        <div className='wp-content-category'>
            <div className='default-sub-header'>
                <div className='container'>
                    <h1>Search Result</h1>
                </div>
            </div>
            <div className='container'>
                <div className='posts-app__post-list'>
                    <div className="row">
                        {posts && posts.length ? (
                            posts.map((post, index) => {
                                return (
                                <div key={post.id} className="posts-app__post col-md-4">
                                    <ImageWithPostID inputdata={post.id} />
                                    <h2><a href={post.url}>{post.title}</a></h2>
                                </div>
                                );
                            })
                        ) : null}
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
    )
}

export default Search;