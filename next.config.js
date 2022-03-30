// Before defining your Security Headers
// add Content Security Policy directives using a template string.
// Inspiration found here
// https://nextjs.org/docs/advanced-features/security-headers
// https://content-security-policy.com/
// https://www.stackhawk.com/blog/react-content-security-policy-guide-what-it-is-and-how-to-enable-it/

const ContentSecurityPolicy = `
  default-src 'self';
  base-uri 'self';
  block-all-mixed-content;
  font-src 'self' https: data:;
  form-action 'self';
  frame-ancestors 'self';
  object-src 'none';
  script-src * 'unsafe-eval';
  script-src-attr 'none';
  style-src 'self' https: 'unsafe-inline';
  upgrade-insecure-requests;
  img-src 'self' secure.gravatar.com;
  connect-src 'self';
`

module.exports = {
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://hippohelp-logic-staging.shimmershot.com' // Proxy to Backend
      }
    ]
  }
};