# Web Development Fundamentals

## 1. Introduction to Web Development

Web development is the process of creating websites and web applications that users access through browsers such as Chrome, Firefox, Edge, or Safari. A modern website is not simply a collection of pages. It is usually a combination of **structure, visual design, interactivity, data, and server-side functionality**.

The three fundamental technologies of front-end web development are:

- **HTML (HyperText Markup Language)** – Defines the structure and content.
- **CSS (Cascading Style Sheets)** – Controls appearance and layout.
- **JavaScript** – Adds logic, interaction, and dynamic behavior.

A simple way to understand them is:

> **HTML = Structure → CSS = Appearance → JavaScript = Behavior**

For example, consider a login page. HTML creates the username field and login button, CSS makes them visually attractive, and JavaScript validates the input and responds when the user clicks **Login**.

---

# 2. How the Web Works

When you enter a URL such as:

```text
https://example.com
```

the browser communicates with a web server to retrieve the requested resources.

### Basic process

1. The user enters a URL.
2. The browser identifies the destination server.
3. A request is sent to the server.
4. The server processes the request.
5. The server returns resources such as HTML, CSS, JavaScript, and images.
6. The browser interprets those resources.
7. The webpage is rendered on the screen.

### Important Terms

**Client:** Usually the user's browser or device.

**Server:** A computer that processes requests and provides resources or services.

**HTTP/HTTPS:** Protocols used for communication between clients and servers.

**URL:** The address used to locate a resource on the web.

**Browser:** Software that interprets web technologies and displays webpages.

---

# 3. Front-End and Back-End Development

Web development can broadly be divided into **front-end** and **back-end** development.

## Front-End Development

Front-end development deals with everything users directly see and interact with.

It includes:

- HTML
- CSS
- JavaScript
- Responsive design
- User interfaces
- Browser interactions

Example:

```text
User
 ↓
Browser
 ↓
HTML + CSS + JavaScript
 ↓
Visible Website
```

## Back-End Development

Back-end development handles server-side operations.

It may involve:

- Server logic
- Databases
- Authentication
- APIs
- Business logic
- Data processing

Common technologies include:

- Node.js
- Python
- Java
- PHP
- C#
- SQL

A complete web application can therefore look like:

```text
Frontend
   ↓
API / Backend
   ↓
Database
```

---

# 4. HTML Fundamentals

HTML stands for **HyperText Markup Language**. It is a markup language used to describe the structure of web content.

HTML uses **elements** represented by tags.

For example:

```html
<h1>Welcome to My Website</h1>
<p>This is my first webpage.</p>
```

Here:

- `<h1>` defines a heading.
- `<p>` defines a paragraph.

---

# 5. Basic HTML Document Structure

Every HTML document normally has a standard structure.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>

<body>
    <h1>Hello World</h1>
    <p>Welcome to my website.</p>
</body>
</html>
```

### Explanation

### `<!DOCTYPE html>`

Tells the browser that the document uses modern HTML.

### `<html>`

The root element of the webpage.

### `<head>`

Contains information about the webpage that is generally not displayed directly.

Examples:

- Page title
- Metadata
- CSS references
- JavaScript references

### `<body>`

Contains the visible webpage content.

---

# 6. HTML Headings and Paragraphs

HTML provides six heading levels.

```html
<h1>Main Heading</h1>
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
```

`<h1>` is normally the most important heading, while `<h6>` represents a lower-level heading.

Paragraphs are created using `<p>`.

```html
<p>
    Web development combines structure, design and programming
    to create interactive websites.
</p>
```

### Good Practice

Use headings according to their **content hierarchy**, not simply because a particular heading looks larger.

---

# 7. Text Formatting

HTML provides several elements for emphasizing or formatting text.

```html
<p>This is <strong>important</strong> text.</p>

<p>This is <em>emphasized</em> text.</p>

<p>This is <mark>highlighted</mark> text.</p>

<p>This is <del>deleted</del> text.</p>
```

Common elements:

- `<strong>` – Important text
- `<em>` – Emphasized text
- `<mark>` – Highlighted text
- `<del>` – Deleted text
- `<small>` – Smaller text
- `<sub>` – Subscript
- `<sup>` – Superscript

---

# 8. Links

Links allow users to navigate between webpages.

```html
<a href="https://example.com">Visit Website</a>
```

The `href` attribute specifies the destination.

### Opening a Link in a New Tab

```html
<a href="https://example.com" target="_blank">
    Visit Website
</a>
```

Links can also point to pages within the same website.

```html
<a href="about.html">About Us</a>
```

---

# 9. Images

Images are inserted using the `<img>` element.

```html
<img src="profile.jpg" alt="Profile photo">
```

Important attributes:

- `src` – Image location
- `alt` – Alternative text
- `width` – Width
- `height` – Height

Example:

```html
<img 
    src="student.jpg"
    alt="Student working on a laptop"
    width="300"
>
```

The `alt` attribute is important for accessibility and situations where the image cannot be displayed.

---

# 10. Lists

HTML provides ordered and unordered lists.

## Unordered List

```html
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>
```

Result:

- HTML
- CSS
- JavaScript

## Ordered List

```html
<ol>
    <li>Learn HTML</li>
    <li>Learn CSS</li>
    <li>Learn JavaScript</li>
</ol>
```

Ordered lists are useful when the order of items matters.

---

# 11. HTML Tables

Tables display structured information in rows and columns.

```html
<table>
    <tr>
        <th>Name</th>
        <th>Department</th>
    </tr>

    <tr>
        <td>Arun</td>
        <td>CSE</td>
    </tr>

    <tr>
        <td>Priya</td>
        <td>AIML</td>
    </tr>
</table>
```

Important elements:

- `<table>` – Table
- `<tr>` – Table row
- `<th>` – Header cell
- `<td>` – Data cell

Tables should be used for **tabular data**, not for designing the overall layout of a webpage.

---

# 12. HTML Forms

Forms allow users to submit information.

A basic form:

```html
<form>
    <label>Name:</label>
    <input type="text">

    <label>Email:</label>
    <input type="email">

    <button type="submit">Submit</button>
</form>
```

Common input types include:

```html
<input type="text">
<input type="email">
<input type="password">
<input type="number">
<input type="date">
<input type="file">
<input type="checkbox">
<input type="radio">
```

### Example Registration Form

```html
<form>
    <h2>Registration</h2>

    <label>Name</label>
    <input type="text" required>

    <label>Email</label>
    <input type="email" required>

    <label>Password</label>
    <input type="password" required>

    <button type="submit">Register</button>
</form>
```

The `required` attribute prevents the form from being submitted without the required information.

---

# 13. Semantic HTML

Semantic HTML uses elements whose names clearly describe their purpose.

Instead of creating everything using `<div>`, developers can use:

```html
<header>
    <nav>
        ...
    </nav>
</header>

<main>
    <section>
        ...
    </section>

    <article>
        ...
    </article>
</main>

<footer>
    ...
</footer>
```

Important semantic elements include:

- `<header>`
- `<nav>`
- `<main>`
- `<section>`
- `<article>`
- `<aside>`
- `<footer>`

### Why Semantic HTML Matters

It improves:

- Accessibility
- Search engine understanding
- Code readability
- Maintainability

---

# 14. CSS Fundamentals

CSS stands for **Cascading Style Sheets**.

HTML determines what elements exist, while CSS determines how those elements look.

For example:

```html
<h1>Hello World</h1>
```

can be styled using:

```css
h1 {
    color: blue;
    font-size: 40px;
}
```

---

# 15. Ways to Add CSS

There are three main methods.

## Inline CSS

```html
<h1 style="color: red;">Hello</h1>
```

## Internal CSS

```html
<style>
    h1 {
        color: red;
    }
</style>
```

## External CSS

HTML:

```html
<link rel="stylesheet" href="style.css">
```

CSS:

```css
h1 {
    color: red;
}
```

For larger projects, **external CSS** is generally the better approach because it keeps structure and styling separate.

---

# 16. CSS Selectors

Selectors determine which HTML elements should be styled.

### Element Selector

```css
p {
    color: black;
}
```

### Class Selector

```css
.card {
    padding: 20px;
}
```

HTML:

```html
<div class="card">
    Product information
</div>
```

### ID Selector

```css
#title {
    color: green;
}
```

HTML:

```html
<h1 id="title">Welcome</h1>
```

Classes are generally preferred when a style needs to be reused across multiple elements.

---

# 17. Colors and Backgrounds

CSS supports different ways of defining colors.

```css
body {
    background-color: #f5f5f5;
}

h1 {
    color: #333333;
}
```

Colors can be represented using:

- Named colors
- HEX
- RGB
- RGBA
- HSL

Example:

```css
button {
    background-color: rgb(40, 100, 200);
    color: white;
}
```

---

# 18. CSS Box Model

The CSS box model is one of the most important concepts in web development.

Every element can be viewed as:

```text
        Margin
   ┌───────────────┐
   │    Border     │
   │ ┌───────────┐ │
   │ │  Padding  │ │
   │ │ ┌───────┐ │ │
   │ │ │Content│ │ │
   │ │ └───────┘ │ │
   │ └───────────┘ │
   └───────────────┘
```

The four components are:

- Content
- Padding
- Border
- Margin

Example:

```css
.card {
    width: 300px;
    padding: 20px;
    border: 1px solid black;
    margin: 20px;
}
```

---

# 19. CSS Fonts and Typography

Typography controls how text appears.

```css
body {
    font-family: Arial, sans-serif;
}

h1 {
    font-size: 36px;
    font-weight: bold;
}

p {
    line-height: 1.6;
}
```

Important properties:

- `font-family`
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- `text-align`

Good typography improves readability and visual hierarchy.

---

# 20. CSS Display Property

The `display` property controls how an element participates in layout.

Common values:

```css
display: block;
display: inline;
display: inline-block;
display: flex;
display: grid;
display: none;
```

For modern layouts, **Flexbox and Grid** are particularly important.

---

# 21. CSS Flexbox

Flexbox is designed primarily for arranging elements along one dimension.

Example:

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
```

HTML:

```html
<div class="container">
    <div>Box 1</div>
    <div>Box 2</div>
    <div>Box 3</div>
</div>
```

Important properties:

- `display: flex`
- `flex-direction`
- `justify-content`
- `align-items`
- `gap`
- `flex-wrap`

---

# 22. CSS Grid

CSS Grid is useful for two-dimensional layouts.

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
```

This can create a three-column layout.

Grid is especially useful for:

- Dashboards
- Product grids
- Image galleries
- Complex page layouts

---

# 23. Responsive Web Design

A responsive website adapts to different screen sizes.

A website should work properly on:

- Smartphones
- Tablets
- Laptops
- Desktop monitors

A basic media query:

```css
@media (max-width: 600px) {
    .container {
        grid-template-columns: 1fr;
    }
}
```

This changes the layout when the screen width is 600px or smaller.

### Responsive Design Principles

- Use flexible layouts.
- Avoid unnecessary fixed widths.
- Use responsive images.
- Use media queries where appropriate.
- Design for touch on mobile devices.
- Test multiple screen sizes.

---

# 24. JavaScript Fundamentals

JavaScript is a programming language used to make webpages interactive.

For example:

```html
<button onclick="showMessage()">Click Me</button>

<script>
function showMessage() {
    alert("Hello!");
}
</script>
```

When the button is clicked, JavaScript executes the function.

---

# 25. Variables

JavaScript provides `let`, `const`, and the older `var`.

```javascript
let name = "Davin";
let age = 20;

const country = "India";
```

### `let`

Used when a value may change.

```javascript
let score = 50;
score = 75;
```

### `const`

Used when the variable should not be reassigned.

```javascript
const pi = 3.14159;
```

In modern JavaScript, `let` and `const` should generally be preferred over `var`.

---

# 26. JavaScript Data Types

Common data types include:

- String
- Number
- Boolean
- Undefined
- Null
- Object
- Array

Example:

```javascript
let name = "Arun";
let age = 21;
let student = true;

let subjects = ["HTML", "CSS", "JavaScript"];
```

---

# 27. Conditional Statements

Conditions allow programs to make decisions.

```javascript
let marks = 75;

if (marks >= 50) {
    console.log("Pass");
} else {
    console.log("Fail");
}
```

Multiple conditions can be handled using `else if`.

```javascript
if (marks >= 90) {
    console.log("A");
} else if (marks >= 75) {
    console.log("B");
} else {
    console.log("C");
}
```

---

# 28. Loops

Loops repeat code.

### For Loop

```javascript
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
```

### While Loop

```javascript
let i = 1;

while (i <= 5) {
    console.log(i);
    i++;
}
```

Loops are useful when processing collections of data.

---

# 29. Functions

Functions are reusable blocks of code.

```javascript
function add(a, b) {
    return a + b;
}

let result = add(10, 20);
console.log(result);
```

Functions improve:

- Reusability
- Organization
- Maintainability
- Readability

---

# 30. Arrays

Arrays store multiple values.

```javascript
let courses = [
    "HTML",
    "CSS",
    "JavaScript"
];

console.log(courses[0]);
```

Common methods include:

```javascript
courses.push("React");
courses.pop();
courses.includes("CSS");
```

---

# 31. Objects

Objects store related information using key-value pairs.

```javascript
let student = {
    name: "Arun",
    age: 21,
    department: "AIML"
};

console.log(student.name);
```

Objects are fundamental to modern JavaScript development because application data is frequently represented using objects.

---

# 32. DOM — Document Object Model

The DOM represents an HTML document as a tree of objects.

JavaScript can use the DOM to modify a webpage dynamically.

HTML:

```html
<h1 id="title">Old Text</h1>
<button onclick="changeText()">Change</button>
```

JavaScript:

```javascript
function changeText() {
    document.getElementById("title").textContent =
        "New Text";
}
```

When the button is clicked, the heading changes.

---

# 33. Selecting HTML Elements

JavaScript provides several methods.

```javascript
document.getElementById("title");

document.querySelector(".card");

document.querySelectorAll("p");
```

`querySelector()` is particularly useful because it can use CSS-style selectors.

---

# 34. JavaScript Events

Events occur when users interact with a webpage.

Examples:

- Click
- Submit
- Mouse movement
- Keyboard input
- Change
- Focus

Example:

```javascript
const button = document.querySelector("#btn");

button.addEventListener("click", function () {
    alert("Button clicked");
});
```

This separates JavaScript behavior from the HTML markup and is generally preferable to putting event handlers directly in HTML.

---

# 35. Form Validation

JavaScript can validate form input before submission.

```javascript
function validateForm() {
    let name = document.getElementById("name").value;

    if (name === "") {
        alert("Name is required");
        return false;
    }

    return true;
}
```

However, client-side validation should **not** be considered a security mechanism. Important validation must also happen on the server.

---

# 36. Fetching Data from APIs

Modern websites often communicate with APIs.

JavaScript's `fetch()` can make HTTP requests.

```javascript
fetch("https://example.com/api/users")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
```

The general flow is:

```text
Webpage
   ↓
JavaScript
   ↓
API Request
   ↓
Server
   ↓
JSON Response
   ↓
Webpage
```

---

# 37. JSON

JSON stands for **JavaScript Object Notation**.

It is commonly used to exchange data between frontend and backend systems.

Example:

```json
{
    "name": "Arun",
    "age": 21,
    "department": "AIML"
}
```

JSON is widely used in REST APIs.

---

# 38. Browser Developer Tools

Every modern browser provides developer tools.

Important sections include:

- Elements
- Console
- Network
- Sources
- Application
- Performance

### Elements

Used to inspect HTML and CSS.

### Console

Used to view JavaScript output and errors.

### Network

Used to inspect:

- API requests
- Responses
- HTTP status codes
- Loading times

Developer tools are essential for debugging websites.

---

# 39. Web Accessibility

Accessibility means designing websites that can be used by people with different abilities.

Important practices include:

- Use semantic HTML.
- Provide meaningful `alt` text.
- Use labels for form controls.
- Maintain sufficient color contrast.
- Make interactive elements keyboard accessible.
- Do not rely only on color to communicate information.

Example:

```html
<label for="email">Email Address</label>
<input id="email" type="email">
```

This is better than presenting an unlabeled input field.

---

# 40. Web Performance

A slow website creates a poor user experience.

Common performance considerations:

- Compress images.
- Avoid unnecessary JavaScript.
- Minimize large resources.
- Use efficient CSS.
- Lazy-load appropriate content.
- Cache static resources.
- Reduce unnecessary network requests.

A useful principle is:

> Send the browser only what it actually needs.

---

# 41. Basic Web Security

Security must be considered from the beginning of development.

Common web security risks include:

- Cross-Site Scripting (XSS)
- SQL Injection
- Cross-Site Request Forgery (CSRF)
- Weak authentication
- Insecure data handling

### Basic Security Practices

- Validate and sanitize input.
- Never trust user input.
- Use HTTPS.
- Store passwords using secure password-hashing mechanisms.
- Keep dependencies updated.
- Avoid exposing sensitive information.
- Use proper authentication and authorization.

---

# 42. Website Project Structure

A basic project can be organized like this:

```text
my-website/
│
├── index.html
├── about.html
├── contact.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── images/
    └── logo.png
```

This structure separates:

- HTML
- CSS
- JavaScript
- Images

and makes the project easier to maintain.

---

# 43. Mini Project — Personal Portfolio

A beginner-friendly project can combine all the concepts.

### HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

<header>
    <h1>My Portfolio</h1>
    <nav>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
    </nav>
</header>

<main>

<section id="about">
    <h2>About Me</h2>
    <p>I am a student learning web development.</p>
</section>

<section id="skills">
    <h2>Skills</h2>
    <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
    </ul>
</section>

<section id="contact">
    <h2>Contact</h2>

    <form>
        <input type="text" placeholder="Name">
        <input type="email" placeholder="Email">
        <button type="submit">Send</button>
    </form>
</section>

</main>

<footer>
    <p>© 2026 My Portfolio</p>
</footer>

<script src="script.js"></script>
</body>
</html>
```

### CSS

```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    line-height: 1.6;
}

header {
    padding: 20px;
    text-align: center;
    background: #222;
    color: white;
}

nav a {
    color: white;
    margin: 10px;
    text-decoration: none;
}

section {
    padding: 40px;
    max-width: 800px;
    margin: auto;
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input,
button {
    padding: 12px;
}

button {
    cursor: pointer;
}
```

### JavaScript

```javascript
const form = document.querySelector("form");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Message submitted successfully!");
});
```

This small project demonstrates:

- HTML structure
- Semantic elements
- Navigation
- Forms
- CSS styling
- Flexbox
- JavaScript
- DOM selection
- Events

---

# 44. Recommended Learning Sequence

The course should be learned in this order:

```text
1. How the Web Works
        ↓
2. HTML Basics
        ↓
3. Semantic HTML
        ↓
4. Forms and Tables
        ↓
5. CSS Basics
        ↓
6. Box Model
        ↓
7. Flexbox
        ↓
8. CSS Grid
        ↓
9. Responsive Design
        ↓
10. JavaScript Basics
        ↓
11. DOM Manipulation
        ↓
12. Events
        ↓
13. Form Validation
        ↓
14. APIs and JSON
        ↓
15. Accessibility
        ↓
16. Performance
        ↓
17. Security Basics
        ↓
18. Final Web Project
```

# 45. Learning Outcomes

After completing **Web Development Fundamentals**, a learner should be able to:

- Explain how websites work.
- Create structured HTML webpages.
- Use semantic HTML correctly.
- Create forms and tables.
- Style webpages using CSS.
- Use Flexbox and CSS Grid.
- Build responsive layouts.
- Write basic JavaScript.
- Manipulate the DOM.
- Handle browser events.
- Validate user input.
- Consume basic APIs.
- Work with JSON.
- Debug using browser developer tools.
- Apply basic accessibility principles.
- Understand fundamental web security.
- Build and deploy a complete beginner-level responsive website.