import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentList from '../components/comments';
import CommentForm from '../components/commentForm';
const Posts = ({ match }) => {
  const [Post, setPost] = useState({});
  const [Page, setPage] = useState({});
  const [acfData, setAcfData] = useState({});
  const params = useParams();


  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(wpScienceTheme.apiUrl + `/wp/v2/posts?slug=${params.slug}`);
        const data = await response.json();

        setPost(data[0]);


        // if(data != []){
        //   const pages = await fetch(wpScienceTheme.apiUrl + `/wp/v2/pages?slug=${params.slug}`);
        //   const pagesResponce = await pages.json();
        //   setPage(pagesResponce[0]);
        //   setState({
        //     ...state,
        //     pages:pagesResponce
        //   })
        // }
    };
    fetchData();
  }, [Post]);

  // async function PostApi (){
  //   const {id} = Page

  //   const response_dev = await fetch(wpScienceTheme.apiUrl + `/wp/v2/pages/${id}`);
  //   const dataAcf = await response_dev.json();

  //   if(response_dev.status == '200'){
  //     setAcfData(dataAcf.acf);
  //   }
  // }

  // useEffect(()=>{
  //   PostApi();
  // },[Page])



  if(Post){

    return (
      <div className='post-wrapper'>
      <div className='posts'>
        <div className='default-sub-header'>
            <div className='container'>
                {Post.title && (<h1>{Post.title.rendered}</h1>)}
            </div>
        </div>
          {Post.content && (<div dangerouslySetInnerHTML={{ __html: Post.content.rendered }} />)}
      </div>
      <div className='comment-wrap'>
        <CommentList postId={Post.id}/>
        <CommentForm postId={Post.id}/>
      </div>
    </div>
    );
  }
  // else if(Page){

  //   return (
  //     <div className='pages'>
  //       <div className='default-sub-header'>
  //           <div className='container'>
  //               {Page.title && (<h1>{Page.title.rendered}</h1>)}
  //           </div>
  //       </div>
  //         {acfData.main_banner && (<h3>{acfData.main_banner.title}</h3>)}
  //         {Page.title && (<h1>{Page.title.rendered}</h1>)}
  //         {Page.content && (<div dangerouslySetInnerHTML={{ __html: Page.content.rendered }} />)}
  //     </div>
  //   );
  // }
};

export default Posts