import React from "react"
import { graphql } from "gatsby"
import Main from '../components/Portfolio/Main'
import Posts from '../components/Portfolio/Posts'

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {

  return (
    <div className="cont">
      <Main />
      <Posts posts={edges}/>
    </div>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
            title
          }
        }
      }
    }
  }
`

