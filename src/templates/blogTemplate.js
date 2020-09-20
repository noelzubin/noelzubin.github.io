import React from "react"
import { graphql } from "gatsby"
import s from './blogTemplate.module.sass';
import cx from 'classnames';
import { useEffect } from "react";
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';


export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  
  useEffect(() => {
    deckDeckGoHighlightElement();
  }, [])

  return (
    <div className={cx(s.cont, "cont")}>
      <div className={s.post}>
        <div className={s.heading}>
          <h1 className={s.title}>{frontmatter.title}</h1>
          <p> Posted on {frontmatter.date}</p>
        </div>
        <div
          className={s.content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className={s.footer}>
          <ul className={s.tags}>
            {frontmatter.tags.split(",").map(tag => <li> {tag} </li>)}
          </ul>
          <div className={s.social}></div>
        </div>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        tags
      }
    }
  }
`