// Syntax roles: which palette color each kind of code token uses.
// Shared by every target that colors code (CSS highlighting, VS Code).
// Documented in docs/architecture.md under "Syntax roles".
export const SYNTAX = {
  keyword: 'pink',      // if, return, const, import, operators
  function: 'green',    // function and method names
  string: 'yellow',     // strings, template literals
  number: 'purple',     // numbers, booleans, null, constants
  type: 'cyan',         // classes, types, built-ins
  parameter: 'orange',  // function parameters
  property: 'green',    // object keys, attribute names
  tag: 'pink',          // HTML/XML tags
  regex: 'red',
  comment: 'comment',
  variable: 'fg',
  punctuation: 'fg',
  link: 'cyan',
  deleted: 'red',
  inserted: 'green',
  changed: 'orange',
  heading: 'purple',    // markdown headings
  emphasis: 'yellow',
  strong: 'orange',
};

// Roles drawn in italic or bold wherever the target supports it.
export const STYLE = {
  comment: 'italic',
  parameter: 'italic',
  heading: 'bold',
  emphasis: 'italic',
  strong: 'bold',
};
