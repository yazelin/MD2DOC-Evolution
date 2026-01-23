import { marked } from 'marked';

const inputs = [
  {
    name: "2 spaces indent",
    markdown: `
* Top Level
  * Nested Level 1
  * Nested Level 1
`
  },
  {
    name: "4 spaces indent",
    markdown: `
* Top Level
    * Nested Level 1
    * Nested Level 1
`
  },
  {
    name: "Tab indent",
    markdown: `
* Top Level
	* Nested Level 1
	* Nested Level 1
`
  }
];

inputs.forEach(input => {
  console.log(`
--- ${input.name} ---`);
  const tokens = marked.lexer(input.markdown);
  // Log the structure, focusing on 'list' items and their 'tokens'
  console.log(JSON.stringify(tokens, (key, value) => {
    if (key === 'raw' || key === 'text') return undefined; // Hide bulky text to see structure
    return value;
  }, 2));
});
