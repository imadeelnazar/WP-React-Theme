import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Axios from "axios";

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


const ArchiveDate = () => {

    const [posts, setPosts] = useState([]);
    const [categoryBtn, setCategoryBtn] = useState([]);

    const [page, setPage] = useState(1);

    const [nrofpages, setNumberofpage] = useState(1);
    const params = useParams();
    const { year, month, day } = useParams();

    let dateString, dateStringBefore;

    if (day) {
        dateString = `${year}-${month}-${day}`;
        dateStringBefore = dateString;
    } else {
        dateString = `${year}-${month}-01`;
        let nextMonth = parseInt(month, 10) + 1;
        let nextYear = year;
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear = parseInt(year, 10) + 1;
        }
        dateStringBefore = `${nextYear}-0${nextMonth}-01`;
    }
    // When the page number changes call the api for posts.
    if (isNaN(month)) {
        const [content, setContent] = useState({});
        async function fetchContent(slug){
            if (typeof wpScienceTheme !== 'undefined' && wpScienceTheme.apiUrl) {
                const pages = await fetch(wpScienceTheme.apiUrl + `/wp/v2/pages/?per_page=50`);
                const posts = await fetch(wpScienceTheme.apiUrl + `/wp/v2/posts/?per_page=50`);
                const categories = await fetch(wpScienceTheme.apiUrl + `/wp/v2/categories?slug=${slug}`);

                if(slug != undefined){
                    if (pages.ok) {
                        const pageRes = await pages.json();
                        const page = pageRes.find((page) => page.slug === slug);
                        if (page) {
                            setContent(page);
                            return;
                        }
                    }
                }

                if(slug != undefined){
                    const postRes = await posts.json();
                    const post = postRes.find((post) => (post.slug === slug));
                    // console.log(post,'post',params.year,params.month)
                    if (post) {
                        setContent(post);
                        return;
                    }
                }

                if(slug != undefined){
                    const categ = await categories.json();
                    const category = categ.find((cate) => (cate.slug === slug));

                    // console.log(post,'post',params.year,params.month)
                    if (category) {

                        setCategoryBtn(category);
                        // setCategoryBtn('category');
                        return;
                    }
                }

            }
        }

        async function fetchCategory(slug){
            if (!isNaN(slug)) {
                Axios.get(
                wpScienceTheme.apiUrl + `/wp/v2/categories?slug=${slug}`, {
                    params: { page: page }
                }).then(response => {
                    // Store the number of posible pages.
                    setNumberofpage(response.headers["x-wp-totalpages"]);
                    // Store the posts from the response.
                    setPosts(response.data);
                });
            }
        }

        if(params.day != undefined){
            useEffect(()=>{
                fetchContent(params.day);
                if(categoryBtn == 'category'){
                    fetchCategory(params.day)
                }
            },[params.day])
        }else{
            useEffect(()=>{
                fetchContent(params.month);
            },[params.month])
        }

        return (
        <div className='wp-main-react-wrapper'>
                {content && content.title && (
                    <div className='default-content'>
                        <div className='default-sub-header'>
                            <div className='container'>
                                <h1>{content.title.rendered}</h1>
                            </div>
                        </div>
                        <div className='container'>
                            <div dangerouslySetInnerHTML={{ __html: content.content.rendered }} />
                        </div>
                    </div>
                )}
                {posts &&
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
        );
    }else{
        useEffect(() => {
            Axios.get(
            wpScienceTheme.apiUrl + `/wp/v2/posts/?after=${dateString}T00:00:00&before=${dateStringBefore}T23:59:59`, {
                params: { page: page }
            }).then(response => {
                // Store the number of posible pages.
                setNumberofpage(response.headers["x-wp-totalpages"]);
                // Store the posts from the response.
                setPosts(response.data);
            });
        }, [page, posts, setPosts]);

        return (
            <div className='wp-content-category'>
                <div className='default-sub-header'>
                    <div className='container'>

                    </div>
                </div>
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
}

export default ArchiveDate;