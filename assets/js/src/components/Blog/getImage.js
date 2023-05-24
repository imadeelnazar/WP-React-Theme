import React,{ useEffect, useState } from 'react';

const ImageWithPostID = ({ inputdata }) => {
    const [tsrc, setTSrc] = useState(null);

    useEffect(() => {
        fetch(wpScienceTheme.apiUrl + `/v3/fimage/id/${inputdata}`)
        .then((res) => res.json())
        .then((data) => {
            setTSrc(data);
        });
    }, [inputdata]);

    return tsrc ? <img src={tsrc[0]} alt="ddd"/> : 'hello';
}

export default ImageWithPostID;