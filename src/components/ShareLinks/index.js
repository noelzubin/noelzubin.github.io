import React from 'react'
import  WhatsappShareButton from 'react-share/lib/WhatsappShareButton';
import  FacebookShareButton from 'react-share/lib/FacebookShareButton';
import  TwitterShareButton from 'react-share/lib/TwitterShareButton';
import  LinkedInShareButton from 'react-share/lib/LinkedinShareButton';

import  WhatsappIcon from 'react-share/lib/WhatsappIcon';
import  FacebookIcon from 'react-share/lib/FacebookIcon';
import  TwitterIcon from 'react-share/lib/TwitterIcon';
import  LinkedInIcon from 'react-share/lib/LinkedinIcon';

import s from './index.module.sass';

const ShareLinks = ({ url, title }) => {
    const size = 20;
    return (
        <div className={s.btns}>
            <WhatsappShareButton url={url} title={title}> <WhatsappIcon size={size} /> </WhatsappShareButton>
            <FacebookShareButton url={url} quote={title}><FacebookIcon size={size} /></FacebookShareButton>
            <TwitterShareButton url={url} title={title} via="noelzubin"><TwitterIcon size={size}/></TwitterShareButton>
            <LinkedInShareButton url={url} title={title}><LinkedInIcon size={size}/></LinkedInShareButton>
        </div>
    )
}

export default ShareLinks;