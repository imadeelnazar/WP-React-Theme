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
                const categories = await fetch(wpScienceTheme.apiUrl + `/wp/v2/tags`);
                if (categories.ok) {
                    const categoryRes = await categories.json();
                    const homecategory = categoryRes.find((homeCategory) => homeCategory.slug === params.slug);
                    if (homecategory) {

                        setCategory(homecategory);
                        setCategoryID(homecategory.id);
                    }
                }
            }
        };
        fetchData();
    }, [params.slug]);

    async function PostApi (){
        if (category && category.id) {
            const response_dev = await fetch(wpScienceTheme.apiUrl + `/wp/v2/tags/${category.id}`);
            if (response_dev.ok) {
                const dataCategory = await response_dev.json();
                if (dataCategory) {
                    setAcfData(dataCategory);
                }
            }
        }
    }

    useEffect(()=>{
        PostApi();
    },[category])

    // When the page number changes call the api for posts.
    useEffect(() => {
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
                    <div className="posts-app__post-list">

                        {posts &&
                        posts.length &&
                        posts.map((post, index) => {
                            return (
                            <div key={post.id} className="posts-app__post">
                                <h2><a href={post.guid.rendered}>{post.title.rendered}</a></h2>
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