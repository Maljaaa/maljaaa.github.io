import React from 'react';
import './style.scss';

function PageFooter({ author, githubUrl }) {
  return (
    <footer className="page-footer-wrapper">
      <p className="page-footer">
        © {new Date().getFullYear()}
        &nbsp;
        <a href={githubUrl}>{author}</a>
        &nbsp;powered by
        <a href="https://github.com/zoomKoding/zoomkoding-gatsby-blog">
          &nbsp;zoomkoding-gatsby-blog
        </a>
        <br />
        <a href="https://hits.seeyoufarm.com">
        <img 
          src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fmaljaaa.github.io&count_bg=%233D76C8&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" 
          alt="hit counter"
        />
      </a>
      </p>      
    </footer>
  );
}

export default PageFooter;
