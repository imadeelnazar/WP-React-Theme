import React from 'react';
import Footer from '../components/Footer';

const NotFound = () => {
    return (
    <div>
        <div className="wp-science_banner_wrap error-page-404">
            <div className="container">
                <div className="wp-science_banner_row">
                    <div className="banner_text">
                        <div className="large_text">404 Page Not Found</div>
                        <p className="mediume_text">Page you are looking for not Found</p>

                        <div className="plugin_link">
                            <a className="main_bton theme_color" href="#">Back to HomePage</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default NotFound;