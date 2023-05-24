import React from 'react';

const ShowMetaData = ({ datas }) => {
    if(datas && datas.length > 0){
        return (
            <ul className="meta-wrap">
            {datas.map((data, index) => (
                <li className="meta-item" key={data.id}>
                    <a href={data.link}>{data.name}{index < datas.length - 1 && ', '}</a>
                </li>
            ))}
            </ul>
        );
    } else {
        return null;
    }
};

export default ShowMetaData;