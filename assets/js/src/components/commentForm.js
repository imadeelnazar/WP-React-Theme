import React,{useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const CommentForm = ({ postId }) => {
  const { register, handleSubmit, reset } = useForm();


  const onSubmit = async (formData) => {
    const response = await fetch(wpScienceTheme.apiUrl + '/wp/v2/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': wpScienceTheme.nonce
      },
      body: JSON.stringify({
        post: postId,
        author_name: formData.name,
        author_email: formData.email,
        content: formData.comment,
      }),
    });

    if (response.ok) {
      reset();
      alert('Comment submitted successfully!');
    } else {
      alert('Comment submission failed.');
    }
  };





  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" {...register("name", { required: true })} />
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" {...register("email", { required: true })} />
      <label htmlFor="comment">Comment</label>
      <textarea id="comment" name="comment" {...register("comment", { required: true })} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;