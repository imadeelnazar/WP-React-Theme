import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Axios from "axios";

import Pagination from '../components/Sections/pagination';
import BlogPost from '../components/Blog/blogGrid'

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
        }).then((response) => {
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
                }).then((response) => {
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
                }).then((response) => {
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
            }, [page, setPosts]);
        }
    }

    let paramss = new URLSearchParams(window.location.search);
    let pages = paramss.get('page') || 1; // If there's no page parameter in the URL, it defaults to 1

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