import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faBars } from '@fortawesome/free-solid-svg-icons';
import ShowMetaData from '../Blog/getMeta'
import ImageWithPostID from '../Blog/getImage'

const BlogPost = ({ post, categories, tags }) => {
    return (
        <div key={post.id} className="posts-app__post col-md-12">
            {post.featured_media && post.featured_media ? (<figure><a href={post.guid.rendered}><ImageWithPostID inputdata={post.id} /><figcaption><span><FontAwesomeIcon icon={faFeather} /></span></figcaption></a></figure>) : ''}
            <div className='posts-app__content'>
                {post.title && (<h3><a href={post.guid.rendered} dangerouslySetInnerHTML={{ __html: post.title.rendered }} /></h3>)}
                <ul className="kode-blog-post">
                    {categories && (
                        <li>
                            <FontAwesomeIcon icon={faBars} /> Categories : <ShowMetaData datas={categories} />
                        </li>
                    )}
                    {tags && tags.length > 0 && (
                        <li>
                            <FontAwesomeIcon icon={faBars} /> Tags : <ShowMetaData datas={tags} />
                        </li>
                    )}
                </ul>
                {post.content && (<div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />)}
                <div className="blog-timeinfo">
                    <span><FontAwesomeIcon icon={faFeather} /> 23th May, 2015</span>
                    <a href={post.guid.rendered} className="blogmore-btn thcolor th-bordercolor thbg-colorhover">Read More</a>
                </div>
            </div>
        </div>
    )
}

export default BlogPost;