import React,{useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faFeather } from "@fortawesome/free-solid-svg-icons";

import Pagination from '../components/Sections/pagination';
import BlogPost from '../components/Blog/blogGrid'
import BlogFull from '../components/Blog/blogFull';

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

    async function fetchCategoryDetails(categoryId) {
        try {
            const response = await fetch(wpScienceTheme.apiUrl + `/wp/v2/categories/${categoryId}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(error);
            // Handle error accordingly
        }
    }

    async function fetchTagDetails(tagId) {
        try {
            const response = await fetch(wpScienceTheme.apiUrl + `/wp/v2/tags/${tagId}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(error);
            // Handle error accordingly
        }
    }



    if(wpScienceTheme.show_on_front == 'posts'){
       // When the page number changes, call the API for posts.
        useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || 1; // If there's no page parameter in the URL, it defaults to 1
        Axios.get(wpScienceTheme.apiUrl + `/wp/v2/posts`, { params: { page: page } })
            .then((response) => {
            // Store the number of possible pages.
            setNumberofpage(response.headers["x-wp-totalpages"]);
            // Store the posts from the response.
            const fetchedPosts = response.data;

            // Fetch category names and IDs for each post
            const categoryPromises = fetchedPosts.map((post) => {
                const categoryIds = post.categories || [];
                return Promise.all([
                    Promise.all(categoryIds.map((categoryId) => fetchCategoryDetails(categoryId))),
                    Promise.all((post.tags || []).map((tagId) => fetchTagDetails(tagId))),
                ]);
            });

            Promise.all(categoryPromises)
                .then((categoryData) => {
                // Append category and tag details to the posts
                const updatedPosts = fetchedPosts.map((post, index) => {
                    const [categories, tags] = categoryData[index];
                    const categoryDetails = Array.isArray(categories)
                    ? categories.map((category) => ({
                            name: category.name,
                            id: category.id,
                            link: category.link
                        }))
                    : [];

                    const tagDetails = Array.isArray(tags)
                    ? tags.map((tag) => ({
                            name: tag.name,
                            id: tag.id,
                            link: tag.link
                        }))
                    : [];

                    return {
                        ...post,
                        categoryDetails,
                        tagDetails,
                    };
                });
                    setPosts(updatedPosts);
                })
                .catch((error) => {
                    console.error(error);
                });
            })
            .catch((error) => {
                console.error(error);
            });
        }, [page]);
    }

    let paramss = new URLSearchParams(window.location.search);
    let pages = paramss.get('page') || 1; // If there's no page parameter in the URL, it defaults to 1

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
                <div className='posts-app__post-list kode-blog-list kode-large-blog'>
                    <div className="row">
                        {posts &&
                        posts.length &&
                        posts.map((post, index) => {
                            const categories = post.categoryDetails || [];
                            const tags = post.tagDetails || [];
                            const author = post.author || '';
                            return (
                            <BlogFull key={index} post={post} categories={categories} tags={tags} />
                            );
                        })}
                    </div>
                    {
                    nrofpages === 1 ?
                    (' ')
                    :
                    <Pagination
                        nrOfPages={nrofpages}
                        currentpage={pages}
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