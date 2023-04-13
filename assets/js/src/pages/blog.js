import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Axios from "axios";

import Pagination from '../components/Sections/pagination';

import WPContent from '../components/Sections/itemBuilder'

const ImageWithPromise = ({ data }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    fetch(wpScienceTheme.apiUrl + `/wp/v2/media/${data}`)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data.source_url);
            setSrc(data.source_url);

        });
  }, [data]);

  return src ? <figure><img src={src} alt={data.alt_text} /></figure> : null;
}


const About = () => {
    const [Post, setPost] = useState({});
    const [category, setCategory] = useState({});
    const [cateData, setAcfData] = useState({});
    const [cateDataPost, setDataPost] = useState({});


    const [acfServImg, setAcfServImg] = useState({});
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (typeof wpScienceTheme !== 'undefined' && wpScienceTheme.apiUrl) {
                const categories = await fetch(wpScienceTheme.apiUrl + `/wp/v2/categories`);
                if (categories.ok) {
                    const categoryRes = await categories.json();
                    const homecategory = categoryRes.find((homeCategory) => homeCategory.slug === params.slug);
                    if (homecategory) {
                        setCategory(homecategory);
                    }
                }
            }
        };
        fetchData();
    }, [params.slug]);

    async function PostApi (){
        if (category && category.id) {
            const response_dev = await fetch(wpScienceTheme.apiUrl + `/wp/v2/categories/${category.id}`);
            if (response_dev.ok) {
                const dataCategory = await response_dev.json();
                if (dataCategory) {
                    setAcfData(dataCategory);
                }
            }

            try {
                const response_catPost = await fetch(wpScienceTheme.apiUrl + `/wp/v2/posts?categories=${category.id}`);
                if (response_catPost.ok) {
                    const dataCategoryPost = await response_catPost.json();
                    if (dataCategoryPost && Array.isArray(dataCategoryPost) && dataCategoryPost.length > 0) {
                        setDataPost(dataCategoryPost);
                    } else {
                        console.log("Data is empty or not an array");
                    }
                } else {
                    throw new Error(`Error ${response_catPost.status}: ${response_catPost.statusText}`);
                }
            } catch (error) {
                console.error(error);
                // Handle error accordingly
            }
        }
    }

    useEffect(()=>{
        PostApi();
    },[category])


    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [nrofpages, setNumberofpage] = useState(1);

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

    return (
        <div className='wp-content-category'>
            {cateData && (
            <div className='default-sub-header'>
                <div className='container'>
                    {cateData.name && (<h1>{cateData.name}</h1>)}
                    {cateData.description && (<div dangerouslySetInnerHTML={{ __html: cateData.description }} />)}
                </div>
            </div>
            )}
            <div className='container'>
                <div className='row'>
                    {cateDataPost && Array.isArray(cateDataPost) && cateDataPost.length > 0 && cateDataPost.map((value, key) => (
                        <div className="col-md-4 archive-post-item" key={key}>
                            <ImageWithPromise data={value.featured_media} />
                            {value.title && (<h2 dangerouslySetInnerHTML={{ __html: value.title.rendered }} />)}
                            {value.excerpt && (<div dangerouslySetInnerHTML={{ __html: value.excerpt.rendered }} />)}
                        </div>
                    ))}
                    <div className="posts-app__post-list">
                        {posts &&
                        posts.length &&
                        posts.map((post, index) => {
                            return (
                            <div key={post.id} className="posts-app__post">
                                <h2>{post.title.rendered}</h2>
                                <div
                                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                />
                            </div>
                            );
                        })}
                    </div>
                    <Pagination
                        nrOfPages={nrofpages}
                        currentpage={page}
                        onSelectPage={n => {
                        setPage(n);
                        }}
                    />
                </div>
            </div>

        </div>
    )
}

export default About;