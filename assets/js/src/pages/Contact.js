import React,{useEffect} from 'react';
import { useForm } from "react-hook-form";
import emailjs from '@emailjs/browser';

const Contact = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState,
        formState: { isSubmitSuccessful,errors }
    } = useForm();

    const onSubmit = data => {

        const msg = {
            to: data.email,
            from: 'test@example.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }

        sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })

        // const myForm = document.querySelector('#myForm');
        // emailjs.sendForm('service_3x6egur-pppp', 'template_pck5ycl-pppp', myForm, 'xm3ejTXETCQdhy-pb')
        // .then((result) => {
        //     console.log(result.text);
        //     console.log(data,'success')
        // }, (error) => {
        //     console.log(error.text);
        //     console.log(data,'error')
        // });
    };

    // useEffect(() => {
    //     if ( formState.isSubmitSuccessful ) {
    //         reset({ question: '', whichplugin: ' ', from_name: '', from_email: '',licenseKey:' ',subject:' ',message:' '});
    //     }
    // }, [formState, reset]);



    return (
    <form id="myForm" className='react-form-wrap' onSubmit={handleSubmit(onSubmit)}>
        <div className='row'>
            <div className='col-md-6 margin-bottom-15'>
                <label htmlFor="question">What is your question about?</label>
                <select
                    id="question"
                    {...register('question', {
                        required: 'Question is required',
                    })}
                >
                    <option value="">Please select...</option>
                    <option value="license">License key or plugin updates</option>
                    <option value="feature">Feature request</option>
                    <option value="quote">Quote for styling / customization</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className='col-md-6 margin-bottom-15'>
                <label htmlFor="plugin">Which Plugin?</label>
                <select
                    id="plugin"
                    {...register('plugin', {
                        required: 'Question is required',
                    })}
                >
                    <option value="">Please select...</option>
                    <option value="license">Advance Filter</option>
                </select>
            </div>
            <div className='col-md-6 margin-bottom-15'>
                <label htmlFor="from_name">Name*</label>
                <input
                    id="from_name"
                    placeholder="Name"
                    {...register('from_name', {
                        required: 'Name is required',
                        pattern: {
                            value: /^[a-zA-Z ]+$/,
                            message: 'Please enter a valid Name',
                        },
                    })}
                    type="text"
                    required
                    className="input"
                />
            </div>
            {errors && errors.from_name && (<span>Please add correct name</span>)}
            <div className='col-md-6 margin-bottom-15'>
                <label htmlFor="from_email">Email*</label>
                <input
                    id="from_email"
                    placeholder="Email"
                    {...register('from_email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Please enter a valid email',
                        },
                    })}
                    type="email"
                    required
                    className="input"
                />
            </div>
            <div className='col-md-12 margin-bottom-15'>
                <label htmlFor="licenseKey">License key</label>
                <p>You can find this in the confirmation email when you bought the plugin, or in your account.</p>
                <input
                    id="licenseKey"
                    placeholder="License key"
                    {...register('licenseKey', {
                        required: 'License is required',
                    })}
                    type="text"
                    required
                    className="input"
                />
            </div>
            <div className='col-md-12 margin-bottom-15'>
                <label htmlFor="subject">Subject</label>
                <input
                    id="subject"
                    placeholder="Subject"
                    {...register('subject', {
                        required: 'Subject is required',
                    })}
                    type="text"
                    required
                    className="input"
                />
            </div>
            <div className='col-md-12 margin-bottom-15'>
                <label htmlFor="message">Message</label>
                <textarea
                    id="message"
                    placeholder="Subject"
                    {...register('message', {
                        required: 'Subject is required',
                    })}
                    type="textarea"
                    required
                    className="input"
                />
            </div>
        </div>
        <div className='bottom-form'>
            <input type="submit" />
        </div>
    </form>
    );
}

export default Contact;