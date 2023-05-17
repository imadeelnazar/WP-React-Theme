import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
const Posts = ({ match }) => {
  const [Post, setPost] = useState({});
  const [Page, setPage] = useState({});
  const [acfData, setAcfData] = useState({});
  const params = useParams();


  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(wpScienceTheme.apiUrl + `/wp/v2/testimonials?slug=${params.slug}`);
        // console.log(response)
        const data = await response.json();
        setPost(data[0]);
    };
    fetchData();
  }, []);

  async function PostApi (){
    const {id} = Page

    const response_dev = await fetch(wpScienceTheme.apiUrl + `/wp/v2/testimonials/${id}`);
    const dataAcf = await response_dev.json();

    if(response_dev.status == '200'){
      setAcfData(dataAcf.acf);
    }
  }



  useEffect(()=>{
    PostApi();
  },[Page])

if(Post){
  return (
  <div className='testimonials'>
    <div className='default-sub-header'>
      <div className='container'>
        {Post.title && (<h1 dangerouslySetInnerHTML={{ __html: Post.title.rendered }} />)}
      </div>
    </div>
    <div className='container'>
      {Post.content && (<div dangerouslySetInnerHTML={{ __html: Post.content.rendered }} />)}
    </div>
  </div>
  );
}
};

export default Posts