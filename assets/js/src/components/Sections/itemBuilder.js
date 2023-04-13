import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import Footer from '../Footer';
import Contact from '../../pages/Contact';

import CommentList from '../comments';
import CommentForm from '../commentForm';

const ImageWithPromise = ({ data }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    fetch(wpScienceTheme.apiUrl + `/wp/v2/media/${data}`)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data.source_url);
            setSrc(data.source_url);
            // console.log(src)
        });
  }, [data]);

  return src ? <img src={src} alt="ddd"/> : null;
}

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




const TestimonialPostData = ({ id }) => {
  const [testimonialData, setTestimonialData] = useState(null);

  useEffect(() => {
    fetch(wpScienceTheme.apiUrl + `/v1/tesimonials/id/${id}`)
        .then((res) => res.json())
        .then((data) => {
            // console.log(data.source_url);
            setTestimonialData(data);
            // console.log(data)
        });
  }, [id]);

  return testimonialData ?
  (
    <div className='wp-science_customer_row'>
        {testimonialData && testimonialData.map((item,key) => (
            <div className="wp-science_customer_column" key={key}>
                {item && item.post_content && (
                    <div dangerouslySetInnerHTML={{ __html: item.post_content }} />
                )}

                {item && item.post_title && (
                    <h6>{item.post_title}</h6>
                )}
                <figure>
                    <ImageWithPostID inputdata={item.ID} />
                </figure>
            </div>
        ))}
    </div>
  ) : 'not found';
}

const ElementDeveloper = ({acfData}) => {
    const [content, setContent] = useState({});

    const params = useParams();

    async function fetchContent(){
        if (typeof wpScienceTheme !== 'undefined' && wpScienceTheme.apiUrl) {
            const pages = await fetch(wpScienceTheme.apiUrl + `/wp/v2/pages`);
            const posts = await fetch(wpScienceTheme.apiUrl + `/wp/v2/posts`);

            if (pages.ok) {
                const pageRes = await pages.json();
                const page = pageRes.find((page) => page.slug === params.slug);
                if (page) {
                    setContent(page);
                    return;
                }
            }

            if(posts.ok){
                const postRes = await posts.json();
                const post = postRes.find((post) => post.slug === params.slug);
                if (post) {
                    setContent(post);
                    return;
                }
            }
        }
    }

    useEffect(()=>{
        fetchContent();
    },[params.slug])

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
                    {console.log(content.id)}
                    <div className='comment-wrap'>
                        <CommentList postId={content.id}/>
                        <CommentForm postId={content.id}/>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ElementDeveloper