import nextra from 'nextra'

const withNextra = nextra({
  // Keep Markdown image URLs as public assets instead of compiling them to imports.
  staticImage: false
})

export default withNextra({
  reactStrictMode: true
})
