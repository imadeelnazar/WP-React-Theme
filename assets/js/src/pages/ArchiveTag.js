import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faFeather } from "@fortawesome/free-solid-svg-icons";

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
            Axios.get(
            wpScienceTheme.apiUrl + `/wp/v2/posts?per_page=3&tags=${categoryID}`, {
                params: { page: page }
            }).then(response => {
                // Store the number of posible pages.
                setNumberofpage(response.headers["x-wp-totalpages"]);
                // Store the posts from the response.
                setPosts(response.data);
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
                            return (
                            <div key={post.id} className="posts-app__post col-md-12">
                                {post.featured_media && post.featured_media ? <figure><a href={post.guid.rendered}><ImageWithPromise data={post.id} /><figcaption><span><FontAwesomeIcon icon={faFeather} /></span></figcaption></a></figure> : ''}
                                <div className='posts-app__content'>
                                    {post.title && (<h3 ><a href={post.guid.rendered} dangerouslySetInnerHTML={{ __html: post.title.rendered }} /></h3>)}
                                    {post.content && (<div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />)}
                                    <div className="blog-timeinfo">
                                        <span><FontAwesomeIcon icon={faFeather} /> 23th May, 2015</span>
                                        <a href={post.guid.rendered} className="blogmore-btn thcolor th-bordercolor thbg-colorhover">Read More</a>
                                    </div>
                                </div>
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
    )
}

export default About;