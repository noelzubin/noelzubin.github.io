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
        </div>
    )
} 

export default Posts;