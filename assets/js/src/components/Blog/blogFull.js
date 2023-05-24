import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faBars } from '@fortawesome/free-solid-svg-icons';
import ShowMetaData from '../Blog/getMeta'
import ImageWithPostID from '../Blog/getImage'

const BlogFull = ({ post, categories, tags }) => {
    const dateObject = new Date(post.date);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;  // JavaScript months start at 0
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[month];
    const year = dateObject.getFullYear();

    return (
        <div key={post.id} className="posts-app__post col-md-12 kode-blog-list kode-large-blog">
            {post.featured_media && post.featured_media ? (<figure><a href={post.guid.rendered}><ImageWithPostID inputdata={post.id} /></a></figure>) : ''}
            <div className='post-app__postfull'>
                <strong className='post-app__strong'>{day} <span>{monthName}</span></strong>
                <div className='kode-blog-info'>
                    {post.title && (<h2><a href={post.guid.rendered} dangerouslySetInnerHTML={{ __html: post.title.rendered }} /></h2>)}
                    <ul className="kode-postoption">
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
                    <a href={post.guid.rendered} className="blog-more thbg-colorhover">Read More</a>
                </div>
            </div>
        </div>
    )
}

export default BlogFull;