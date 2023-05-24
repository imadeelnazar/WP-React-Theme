import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faFeather } from "@fortawesome/free-solid-svg-icons";

import BlogPost from '../components/Blog/blogGrid'
import BlogFull from '../components/Blog/blogFull'

import Pagination from '../components/Sections/pagination';

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

    const [category, setCategory] = useState({});
    const [categoryID, setCategoryID] = useState({});
    const [cateData, setAcfData] = useState({});
    const params = useParams();

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [nrofpages, setNumberofpage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (typeof wpScienceTheme !== 'undefined' && wpScienceTheme.apiUrl) {
                const categories = await fetch(wpScienceTheme.apiUrl + `/wp/v2/tags?slug=${params.slug}`);
                if (categories.ok) {
                    const categoryRes = await categories.json();
                    if (categoryRes) {
                        setCategory(categoryRes);
                        setCategoryID(categoryRes[0].id);
                        //console.log(categoryRes.id)
                    }
                }
            }
        };
        fetchData();
    }, [params.slug]);

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

    // async function PostApi (){
    //     if (category && category.id) {
    //         const response_dev = await fetch(wpScienceTheme.apiUrl + `/wp/v2/categories/${category.id}`);
    //         if (response_dev.ok) {
    //             const dataCategory = await response_dev.json();
    //             if (dataCategory) {
    //                 setAcfData(dataCategory);
    //             }
    //         }
    //     }
    // }

    // useEffect(()=>{
    //     PostApi();
    // },[category])

    // When the page number changes call the api for posts.
    useEffect(() => {
        // console.log(categoryID)
        if (!isNaN(categoryID)) {
            const params = new URLSearchParams(window.location.search);
            const page = params.get('page') || 1; // If there's no page parameter in the URL, it defaults to 1
            Axios.get(
            wpScienceTheme.apiUrl + `/wp/v2/posts?per_page=3&tags=${categoryID}`, {
                params: { page: page }
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
        }
    }, [page, categoryID, setPosts]);

    return (
        <div className='wp-content-category archive-tags'>
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
                    <div className="posts-app__post-list">
                        {posts &&
                        posts.length &&
                        posts.map((post, index) => {
                            const categories = post.categoryDetails || [];
                            const tags = post.tagDetails || [];
                            const author = post.author || '';
                            console.log(categories)
                            return (
                            <BlogFull key={index} post={post} categories={categories} tags={tags} />
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
    )
}

export default About;