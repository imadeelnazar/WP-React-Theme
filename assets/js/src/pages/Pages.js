import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WPContent from '../components/Sections/itemBuilder'
import PageLoader from '../pageLoader';
import CommentList from '../components/comments';
import CommentForm from '../components/commentForm';

const Pages = () => {

  const [Page, setPage] = useState({});
  const [acfData, setAcfData] = useState({});
  const params = useParams();
  const { slug, subSlug } = useParams();
  const [content, setContent] = useState({});

        const subPageSlugs = params['*'].split('/'); // split by '/'

        const lastSubPageSlug = subPageSlugs[subPageSlugs.length - 2]; // get last element
console.log(lastSubPageSlug)


    async function fetchContent(slug){
        if (typeof wpScienceTheme !== 'undefined' && wpScienceTheme.apiUrl) {
            const pages = await fetch(wpScienceTheme.apiUrl + `/wp/v2/pages/?per_page=50`);
            const posts = await fetch(wpScienceTheme.apiUrl + `/wp/v2/posts/?per_page=50`);



            if (pages.ok) {
                const pageRes = await pages.json();
                const page = pageRes.find((page) => page.slug === slug);
                if (page) {
                    setContent(page);
                    return;
                }
            }

            if(posts.ok){
                const postRes = await posts.json();
                const post = postRes.find((post) => (post.slug === slug));
                if (post) {
                    setContent(post);
                    return;
                }
            }
        }
    }
    if(lastSubPageSlug && isNaN(lastSubPageSlug)){
        useEffect(()=>{
            fetchContent(lastSubPageSlug);
        },[lastSubPageSlug])
    }else{
        useEffect(()=>{
            fetchContent(params.slug);
        },[params.slug])
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
                    <div className='container-fluid'>
                        <div className="row" dangerouslySetInnerHTML={{ __html: content.content.rendered }} />
                    </div>
                    <div className='comment-wrap'>
                        <CommentList postId={content.id}/>
                        <CommentForm postId={content.id}/>
                    </div>
                </div>
            )}
        </div>
  );
};

export default Pages