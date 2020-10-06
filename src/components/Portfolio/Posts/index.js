import React from 'react';
import s from './index.module.sass';
import { Link } from 'gatsby';

const Posts = ({ posts }) => {
    return (
        <div className={s.post}>
            <h2>Recent Posts</h2>
            <ul className={s.articles}>
                {posts.map(({node: {frontmatter }}) => (
                   <li key={frontmatter.slug} className={s.article}>
                       <Link to={frontmatter.slug}>
                            <div className={s.date}>{frontmatter.date}</div>
                            <div className={s.title}>{frontmatter.title}</div>
                       </Link>
                   </li>
                ))}
            </ul>
            <h2>Recent Projects</h2>
            <ul className={s.projects}>
                <li>
                   <a target="_blank" href="https://github.com/noelzubin/scalable-react">Scalable React Starter</a>
                </li>
            </ul>
        </div>
    )
} 

export default Posts;