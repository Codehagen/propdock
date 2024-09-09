export default [
  {
    content:
      "# Welcome to Sample Documentation\n\nThis is a basic MDX file to test if Content Collections is working correctly.\n\n## Features\n\n- Easy to use\n- Supports Markdown syntax\n- Can include React components",
    title: "Sample Documentation",
    description: "This is a sample MDX file for testing Content Collections",
    _meta: {
      filePath: "sample.mdx",
      fileName: "sample.mdx",
      directory: ".",
      extension: "mdx",
      path: "sample",
    },
    toc: [
      {
        title: "Welcome to Sample Documentation",
        url: "#welcome-to-sample-documentation",
        depth: 1,
      },
      {
        title: "Features",
        url: "#features",
        depth: 2,
      },
    ],
    structuredData: {
      contents: [
        {
          heading: "welcome-to-sample-documentation",
          content:
            "This is a basic MDX file to test if Content Collections is working correctly.",
        },
        {
          heading: "features",
          content: "Easy to use",
        },
        {
          heading: "features",
          content: "Supports Markdown syntax",
        },
        {
          heading: "features",
          content: "Can include React components",
        },
      ],
      headings: [
        {
          id: "welcome-to-sample-documentation",
          content: "Welcome to Sample Documentation",
        },
        {
          id: "features",
          content: "Features",
        },
      ],
    },
    body: 'var Component=(()=>{var h=Object.create;var c=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var x=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var _=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports),j=(e,n)=>{for(var o in n)c(e,o,{get:n[o],enumerable:!0})},r=(e,n,o,l)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of p(n))!f.call(e,i)&&i!==o&&c(e,i,{get:()=>n[i],enumerable:!(l=m(n,i))||l.enumerable});return e};var C=(e,n,o)=>(o=e!=null?h(x(e)):{},r(n||!e||!e.__esModule?c(o,"default",{value:e,enumerable:!0}):o,e)),M=e=>r(c({},"__esModule",{value:!0}),e);var a=_((D,s)=>{s.exports=_jsx_runtime});var w={};j(w,{default:()=>d});var t=C(a());function u(e){let n={h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"welcome-to-sample-documentation",children:"Welcome to Sample Documentation"}),`\n`,(0,t.jsx)(n.p,{children:"This is a basic MDX file to test if Content Collections is working correctly."}),`\n`,(0,t.jsx)(n.h2,{id:"features",children:"Features"}),`\n`,(0,t.jsxs)(n.ul,{children:[`\n`,(0,t.jsx)(n.li,{children:"Easy to use"}),`\n`,(0,t.jsx)(n.li,{children:"Supports Markdown syntax"}),`\n`,(0,t.jsx)(n.li,{children:"Can include React components"}),`\n`]})]})}function d(e={}){let{wrapper:n}=e.components||{};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(u,{...e})}):u(e)}return M(w);})();\n;return Component;',
  },
];
