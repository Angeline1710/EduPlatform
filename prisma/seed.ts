import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@eduplatform.com" },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL || "admin@eduplatform.com",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Courses (merged with previous internships)
    const coursesData = [
    {
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript from scratch and build your first responsive website.",
      topics: "HTML,CSS,JavaScript,Web",
      internRole: "Frontend Development",
      lessons: [
        {
                "title": "Lesson 1",
                "description": "When you enter a URL such as:\r \r ```text\r https://example.com\r ```\r \r the browser communicates with ...",
                "content": "When you enter a URL such as:\r\n\r\n```text\r\nhttps://example.com\r\n```\r\n\r\nthe browser communicates with a web server to retrieve the requested resources.\r\n\r\n### Basic process\r\n\r\n1. The user enters a URL.\r\n2. The browser identifies the destination server.\r\n3. A request is sent to the server.\r\n4. The server processes the request.\r\n5. The server returns resources such as HTML, CSS, JavaScript, and images.\r\n6. The browser interprets those resources.\r\n7. The webpage is rendered on the screen.\r\n\r\n### Important Terms\r\n\r\n**Client:** Usually the user's browser or device.\r\n\r\n**Server:** A computer that processes requests and provides resources or services.\r\n\r\n**HTTP/HTTPS:** Protocols used for communication between clients and servers.\r\n\r\n**URL:** The address used to locate a resource on the web.\r\n\r\n**Browser:** Software that interprets web technologies and displays webpages.\r\n\r\n---"
        },
        {
                "title": "Lesson 2",
                "description": "Web development can broadly be divided into **front-end** and **back-end** development.\r \r ## Front-...",
                "content": "Web development can broadly be divided into **front-end** and **back-end** development.\r\n\r\n## Front-End Development\r\n\r\nFront-end development deals with everything users directly see and interact with.\r\n\r\nIt includes:\r\n\r\n- HTML\r\n- CSS\r\n- JavaScript\r\n- Responsive design\r\n- User interfaces\r\n- Browser interactions\r\n\r\nExample:\r\n\r\n```text\r\nUser\r\n ↓\r\nBrowser\r\n ↓\r\nHTML + CSS + JavaScript\r\n ↓\r\nVisible Website\r\n```\r\n\r\n## Back-End Development\r\n\r\nBack-end development handles server-side operations.\r\n\r\nIt may involve:\r\n\r\n- Server logic\r\n- Databases\r\n- Authentication\r\n- APIs\r\n- Business logic\r\n- Data processing\r\n\r\nCommon technologies include:\r\n\r\n- Node.js\r\n- Python\r\n- Java\r\n- PHP\r\n- C#\r\n- SQL\r\n\r\nA complete web application can therefore look like:\r\n\r\n```text\r\nFrontend\r\n   ↓\r\nAPI / Backend\r\n   ↓\r\nDatabase\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 3",
                "description": "HTML stands for **HyperText Markup Language**. It is a markup language used to describe the structur...",
                "content": "HTML stands for **HyperText Markup Language**. It is a markup language used to describe the structure of web content.\r\n\r\nHTML uses **elements** represented by tags.\r\n\r\nFor example:\r\n\r\n```html\r\n<h1>Welcome to My Website</h1>\r\n<p>This is my first webpage.</p>\r\n```\r\n\r\nHere:\r\n\r\n- `<h1>` defines a heading.\r\n- `<p>` defines a paragraph.\r\n\r\n---"
        },
        {
                "title": "Lesson 4",
                "description": "Every HTML document normally has a standard structure.\r \r ```html\r <!DOCTYPE html>\r <html>\r <head>\r ...",
                "content": "Every HTML document normally has a standard structure.\r\n\r\n```html\r\n<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <title>My Website</title>\r\n</head>\r\n\r\n<body>\r\n    <h1>Hello World</h1>\r\n    <p>Welcome to my website.</p>\r\n</body>\r\n</html>\r\n```\r\n\r\n### Explanation\r\n\r\n### `<!DOCTYPE html>`\r\n\r\nTells the browser that the document uses modern HTML.\r\n\r\n### `<html>`\r\n\r\nThe root element of the webpage.\r\n\r\n### `<head>`\r\n\r\nContains information about the webpage that is generally not displayed directly.\r\n\r\nExamples:\r\n\r\n- Page title\r\n- Metadata\r\n- CSS references\r\n- JavaScript references\r\n\r\n### `<body>`\r\n\r\nContains the visible webpage content.\r\n\r\n---"
        },
        {
                "title": "Lesson 5",
                "description": "HTML provides six heading levels.\r \r ```html\r <h1>Main Heading</h1>\r <h2>Section Heading</h2>\r <h3>S...",
                "content": "HTML provides six heading levels.\r\n\r\n```html\r\n<h1>Main Heading</h1>\r\n<h2>Section Heading</h2>\r\n<h3>Subsection Heading</h3>\r\n<h4>Heading 4</h4>\r\n<h5>Heading 5</h5>\r\n<h6>Heading 6</h6>\r\n```\r\n\r\n`<h1>` is normally the most important heading, while `<h6>` represents a lower-level heading.\r\n\r\nParagraphs are created using `<p>`.\r\n\r\n```html\r\n<p>\r\n    Web development combines structure, design and programming\r\n    to create interactive websites.\r\n</p>\r\n```\r\n\r\n### Good Practice\r\n\r\nUse headings according to their **content hierarchy**, not simply because a particular heading looks larger.\r\n\r\n---"
        },
        {
                "title": "Lesson 6",
                "description": "HTML provides several elements for emphasizing or formatting text.\r \r ```html\r <p>This is <strong>im...",
                "content": "HTML provides several elements for emphasizing or formatting text.\r\n\r\n```html\r\n<p>This is <strong>important</strong> text.</p>\r\n\r\n<p>This is <em>emphasized</em> text.</p>\r\n\r\n<p>This is <mark>highlighted</mark> text.</p>\r\n\r\n<p>This is <del>deleted</del> text.</p>\r\n```\r\n\r\nCommon elements:\r\n\r\n- `<strong>` – Important text\r\n- `<em>` – Emphasized text\r\n- `<mark>` – Highlighted text\r\n- `<del>` – Deleted text\r\n- `<small>` – Smaller text\r\n- `<sub>` – Subscript\r\n- `<sup>` – Superscript\r\n\r\n---"
        },
        {
                "title": "Lesson 7",
                "description": "Links allow users to navigate between webpages.\r \r ```html\r <a href=\"https://example.com\">Visit Webs...",
                "content": "Links allow users to navigate between webpages.\r\n\r\n```html\r\n<a href=\"https://example.com\">Visit Website</a>\r\n```\r\n\r\nThe `href` attribute specifies the destination.\r\n\r\n### Opening a Link in a New Tab\r\n\r\n```html\r\n<a href=\"https://example.com\" target=\"_blank\">\r\n    Visit Website\r\n</a>\r\n```\r\n\r\nLinks can also point to pages within the same website.\r\n\r\n```html\r\n<a href=\"about.html\">About Us</a>\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 8",
                "description": "Images are inserted using the `<img>` element.\r \r ```html\r <img src=\"profile.jpg\" alt=\"Profile photo...",
                "content": "Images are inserted using the `<img>` element.\r\n\r\n```html\r\n<img src=\"profile.jpg\" alt=\"Profile photo\">\r\n```\r\n\r\nImportant attributes:\r\n\r\n- `src` – Image location\r\n- `alt` – Alternative text\r\n- `width` – Width\r\n- `height` – Height\r\n\r\nExample:\r\n\r\n```html\r\n<img \r\n    src=\"student.jpg\"\r\n    alt=\"Student working on a laptop\"\r\n    width=\"300\"\r\n>\r\n```\r\n\r\nThe `alt` attribute is important for accessibility and situations where the image cannot be displayed.\r\n\r\n---"
        },
        {
                "title": "Lesson 9",
                "description": "HTML provides ordered and unordered lists.\r \r ## Unordered List\r \r ```html\r <ul>\r     <li>HTML</li>\r...",
                "content": "HTML provides ordered and unordered lists.\r\n\r\n## Unordered List\r\n\r\n```html\r\n<ul>\r\n    <li>HTML</li>\r\n    <li>CSS</li>\r\n    <li>JavaScript</li>\r\n</ul>\r\n```\r\n\r\nResult:\r\n\r\n- HTML\r\n- CSS\r\n- JavaScript\r\n\r\n## Ordered List\r\n\r\n```html\r\n<ol>\r\n    <li>Learn HTML</li>\r\n    <li>Learn CSS</li>\r\n    <li>Learn JavaScript</li>\r\n</ol>\r\n```\r\n\r\nOrdered lists are useful when the order of items matters.\r\n\r\n---"
        },
        {
                "title": "Lesson 10",
                "description": "Tables display structured information in rows and columns.\r \r ```html\r <table>\r     <tr>\r         <t...",
                "content": "Tables display structured information in rows and columns.\r\n\r\n```html\r\n<table>\r\n    <tr>\r\n        <th>Name</th>\r\n        <th>Department</th>\r\n    </tr>\r\n\r\n    <tr>\r\n        <td>Arun</td>\r\n        <td>CSE</td>\r\n    </tr>\r\n\r\n    <tr>\r\n        <td>Priya</td>\r\n        <td>AIML</td>\r\n    </tr>\r\n</table>\r\n```\r\n\r\nImportant elements:\r\n\r\n- `<table>` – Table\r\n- `<tr>` – Table row\r\n- `<th>` – Header cell\r\n- `<td>` – Data cell\r\n\r\nTables should be used for **tabular data**, not for designing the overall layout of a webpage.\r\n\r\n---"
        },
        {
                "title": "Lesson 11",
                "description": "Forms allow users to submit information.\r \r A basic form:\r \r ```html\r <form>\r     <label>Name:</labe...",
                "content": "Forms allow users to submit information.\r\n\r\nA basic form:\r\n\r\n```html\r\n<form>\r\n    <label>Name:</label>\r\n    <input type=\"text\">\r\n\r\n    <label>Email:</label>\r\n    <input type=\"email\">\r\n\r\n    <button type=\"submit\">Submit</button>\r\n</form>\r\n```\r\n\r\nCommon input types include:\r\n\r\n```html\r\n<input type=\"text\">\r\n<input type=\"email\">\r\n<input type=\"password\">\r\n<input type=\"number\">\r\n<input type=\"date\">\r\n<input type=\"file\">\r\n<input type=\"checkbox\">\r\n<input type=\"radio\">\r\n```\r\n\r\n### Example Registration Form\r\n\r\n```html\r\n<form>\r\n    <h2>Registration</h2>\r\n\r\n    <label>Name</label>\r\n    <input type=\"text\" required>\r\n\r\n    <label>Email</label>\r\n    <input type=\"email\" required>\r\n\r\n    <label>Password</label>\r\n    <input type=\"password\" required>\r\n\r\n    <button type=\"submit\">Register</button>\r\n</form>\r\n```\r\n\r\nThe `required` attribute prevents the form from being submitted without the required information.\r\n\r\n---"
        },
        {
                "title": "Lesson 12",
                "description": "Semantic HTML uses elements whose names clearly describe their purpose.\r \r Instead of creating every...",
                "content": "Semantic HTML uses elements whose names clearly describe their purpose.\r\n\r\nInstead of creating everything using `<div>`, developers can use:\r\n\r\n```html\r\n<header>\r\n    <nav>\r\n        ...\r\n    </nav>\r\n</header>\r\n\r\n<main>\r\n    <section>\r\n        ...\r\n    </section>\r\n\r\n    <article>\r\n        ...\r\n    </article>\r\n</main>\r\n\r\n<footer>\r\n    ...\r\n</footer>\r\n```\r\n\r\nImportant semantic elements include:\r\n\r\n- `<header>`\r\n- `<nav>`\r\n- `<main>`\r\n- `<section>`\r\n- `<article>`\r\n- `<aside>`\r\n- `<footer>`\r\n\r\n### Why Semantic HTML Matters\r\n\r\nIt improves:\r\n\r\n- Accessibility\r\n- Search engine understanding\r\n- Code readability\r\n- Maintainability\r\n\r\n---"
        },
        {
                "title": "Lesson 13",
                "description": "CSS stands for **Cascading Style Sheets**.\r \r HTML determines what elements exist, while CSS determi...",
                "content": "CSS stands for **Cascading Style Sheets**.\r\n\r\nHTML determines what elements exist, while CSS determines how those elements look.\r\n\r\nFor example:\r\n\r\n```html\r\n<h1>Hello World</h1>\r\n```\r\n\r\ncan be styled using:\r\n\r\n```css\r\nh1 {\r\n    color: blue;\r\n    font-size: 40px;\r\n}\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 14",
                "description": "There are three main methods.\r \r ## Inline CSS\r \r ```html\r <h1 style=\"color: red;\">Hello</h1>\r ```\r ...",
                "content": "There are three main methods.\r\n\r\n## Inline CSS\r\n\r\n```html\r\n<h1 style=\"color: red;\">Hello</h1>\r\n```\r\n\r\n## Internal CSS\r\n\r\n```html\r\n<style>\r\n    h1 {\r\n        color: red;\r\n    }\r\n</style>\r\n```\r\n\r\n## External CSS\r\n\r\nHTML:\r\n\r\n```html\r\n<link rel=\"stylesheet\" href=\"style.css\">\r\n```\r\n\r\nCSS:\r\n\r\n```css\r\nh1 {\r\n    color: red;\r\n}\r\n```\r\n\r\nFor larger projects, **external CSS** is generally the better approach because it keeps structure and styling separate.\r\n\r\n---"
        },
        {
                "title": "Lesson 15",
                "description": "Selectors determine which HTML elements should be styled.\r \r ### Element Selector\r \r ```css\r p {\r   ...",
                "content": "Selectors determine which HTML elements should be styled.\r\n\r\n### Element Selector\r\n\r\n```css\r\np {\r\n    color: black;\r\n}\r\n```\r\n\r\n### Class Selector\r\n\r\n```css\r\n.card {\r\n    padding: 20px;\r\n}\r\n```\r\n\r\nHTML:\r\n\r\n```html\r\n<div class=\"card\">\r\n    Product information\r\n</div>\r\n```\r\n\r\n### ID Selector\r\n\r\n```css\r\n#title {\r\n    color: green;\r\n}\r\n```\r\n\r\nHTML:\r\n\r\n```html\r\n<h1 id=\"title\">Welcome</h1>\r\n```\r\n\r\nClasses are generally preferred when a style needs to be reused across multiple elements.\r\n\r\n---"
        },
        {
                "title": "Lesson 16",
                "description": "CSS supports different ways of defining colors.\r \r ```css\r body {\r     background-color: #f5f5f5;\r }...",
                "content": "CSS supports different ways of defining colors.\r\n\r\n```css\r\nbody {\r\n    background-color: #f5f5f5;\r\n}\r\n\r\nh1 {\r\n    color: #333333;\r\n}\r\n```\r\n\r\nColors can be represented using:\r\n\r\n- Named colors\r\n- HEX\r\n- RGB\r\n- RGBA\r\n- HSL\r\n\r\nExample:\r\n\r\n```css\r\nbutton {\r\n    background-color: rgb(40, 100, 200);\r\n    color: white;\r\n}\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 17",
                "description": "The CSS box model is one of the most important concepts in web development.\r \r Every element can be ...",
                "content": "The CSS box model is one of the most important concepts in web development.\r\n\r\nEvery element can be viewed as:\r\n\r\n```text\r\n        Margin\r\n   ┌───────────────┐\r\n   │    Border     │\r\n   │ ┌───────────┐ │\r\n   │ │  Padding  │ │\r\n   │ │ ┌───────┐ │ │\r\n   │ │ │Content│ │ │\r\n   │ │ └───────┘ │ │\r\n   │ └───────────┘ │\r\n   └───────────────┘\r\n```\r\n\r\nThe four components are:\r\n\r\n- Content\r\n- Padding\r\n- Border\r\n- Margin\r\n\r\nExample:\r\n\r\n```css\r\n.card {\r\n    width: 300px;\r\n    padding: 20px;\r\n    border: 1px solid black;\r\n    margin: 20px;\r\n}\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 18",
                "description": "Typography controls how text appears.\r \r ```css\r body {\r     font-family: Arial, sans-serif;\r }\r \r h...",
                "content": "Typography controls how text appears.\r\n\r\n```css\r\nbody {\r\n    font-family: Arial, sans-serif;\r\n}\r\n\r\nh1 {\r\n    font-size: 36px;\r\n    font-weight: bold;\r\n}\r\n\r\np {\r\n    line-height: 1.6;\r\n}\r\n```\r\n\r\nImportant properties:\r\n\r\n- `font-family`\r\n- `font-size`\r\n- `font-weight`\r\n- `line-height`\r\n- `letter-spacing`\r\n- `text-align`\r\n\r\nGood typography improves readability and visual hierarchy.\r\n\r\n---"
        },
        {
                "title": "Lesson 19",
                "description": "The `display` property controls how an element participates in layout.\r \r Common values:\r \r ```css\r ...",
                "content": "The `display` property controls how an element participates in layout.\r\n\r\nCommon values:\r\n\r\n```css\r\ndisplay: block;\r\ndisplay: inline;\r\ndisplay: inline-block;\r\ndisplay: flex;\r\ndisplay: grid;\r\ndisplay: none;\r\n```\r\n\r\nFor modern layouts, **Flexbox and Grid** are particularly important.\r\n\r\n---"
        },
        {
                "title": "Lesson 20",
                "description": "Flexbox is designed primarily for arranging elements along one dimension.\r \r Example:\r \r ```css\r .co...",
                "content": "Flexbox is designed primarily for arranging elements along one dimension.\r\n\r\nExample:\r\n\r\n```css\r\n.container {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    gap: 20px;\r\n}\r\n```\r\n\r\nHTML:\r\n\r\n```html\r\n<div class=\"container\">\r\n    <div>Box 1</div>\r\n    <div>Box 2</div>\r\n    <div>Box 3</div>\r\n</div>\r\n```\r\n\r\nImportant properties:\r\n\r\n- `display: flex`\r\n- `flex-direction`\r\n- `justify-content`\r\n- `align-items`\r\n- `gap`\r\n- `flex-wrap`\r\n\r\n---"
        },
        {
                "title": "Lesson 21",
                "description": "CSS Grid is useful for two-dimensional layouts.\r \r ```css\r .container {\r     display: grid;\r     gri...",
                "content": "CSS Grid is useful for two-dimensional layouts.\r\n\r\n```css\r\n.container {\r\n    display: grid;\r\n    grid-template-columns: repeat(3, 1fr);\r\n    gap: 20px;\r\n}\r\n```\r\n\r\nThis can create a three-column layout.\r\n\r\nGrid is especially useful for:\r\n\r\n- Dashboards\r\n- Product grids\r\n- Image galleries\r\n- Complex page layouts\r\n\r\n---"
        },
        {
                "title": "Lesson 22",
                "description": "A responsive website adapts to different screen sizes.\r \r A website should work properly on:\r \r - Sm...",
                "content": "A responsive website adapts to different screen sizes.\r\n\r\nA website should work properly on:\r\n\r\n- Smartphones\r\n- Tablets\r\n- Laptops\r\n- Desktop monitors\r\n\r\nA basic media query:\r\n\r\n```css\r\n@media (max-width: 600px) {\r\n    .container {\r\n        grid-template-columns: 1fr;\r\n    }\r\n}\r\n```\r\n\r\nThis changes the layout when the screen width is 600px or smaller.\r\n\r\n### Responsive Design Principles\r\n\r\n- Use flexible layouts.\r\n- Avoid unnecessary fixed widths.\r\n- Use responsive images.\r\n- Use media queries where appropriate.\r\n- Design for touch on mobile devices.\r\n- Test multiple screen sizes.\r\n\r\n---"
        },
        {
                "title": "Lesson 23",
                "description": "JavaScript is a programming language used to make webpages interactive.\r \r For example:\r \r ```html\r ...",
                "content": "JavaScript is a programming language used to make webpages interactive.\r\n\r\nFor example:\r\n\r\n```html\r\n<button onclick=\"showMessage()\">Click Me</button>\r\n\r\n<script>\r\nfunction showMessage() {\r\n    alert(\"Hello!\");\r\n}\r\n</script>\r\n```\r\n\r\nWhen the button is clicked, JavaScript executes the function.\r\n\r\n---"
        },
        {
                "title": "Lesson 24",
                "description": "JavaScript provides `let`, `const`, and the older `var`.\r \r ```javascript\r let name = \"Davin\";\r let ...",
                "content": "JavaScript provides `let`, `const`, and the older `var`.\r\n\r\n```javascript\r\nlet name = \"Davin\";\r\nlet age = 20;\r\n\r\nconst country = \"India\";\r\n```\r\n\r\n### `let`\r\n\r\nUsed when a value may change.\r\n\r\n```javascript\r\nlet score = 50;\r\nscore = 75;\r\n```\r\n\r\n### `const`\r\n\r\nUsed when the variable should not be reassigned.\r\n\r\n```javascript\r\nconst pi = 3.14159;\r\n```\r\n\r\nIn modern JavaScript, `let` and `const` should generally be preferred over `var`.\r\n\r\n---"
        },
        {
                "title": "Lesson 25",
                "description": "Common data types include:\r \r - String\r - Number\r - Boolean\r - Undefined\r - Null\r - Object\r - Array\r...",
                "content": "Common data types include:\r\n\r\n- String\r\n- Number\r\n- Boolean\r\n- Undefined\r\n- Null\r\n- Object\r\n- Array\r\n\r\nExample:\r\n\r\n```javascript\r\nlet name = \"Arun\";\r\nlet age = 21;\r\nlet student = true;\r\n\r\nlet subjects = [\"HTML\", \"CSS\", \"JavaScript\"];\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 26",
                "description": "Conditions allow programs to make decisions.\r \r ```javascript\r let marks = 75;\r \r if (marks >= 50) {...",
                "content": "Conditions allow programs to make decisions.\r\n\r\n```javascript\r\nlet marks = 75;\r\n\r\nif (marks >= 50) {\r\n    console.log(\"Pass\");\r\n} else {\r\n    console.log(\"Fail\");\r\n}\r\n```\r\n\r\nMultiple conditions can be handled using `else if`.\r\n\r\n```javascript\r\nif (marks >= 90) {\r\n    console.log(\"A\");\r\n} else if (marks >= 75) {\r\n    console.log(\"B\");\r\n} else {\r\n    console.log(\"C\");\r\n}\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 27",
                "description": "Loops repeat code.\r \r ### For Loop\r \r ```javascript\r for (let i = 1; i <= 5; i++) {\r     console.log...",
                "content": "Loops repeat code.\r\n\r\n### For Loop\r\n\r\n```javascript\r\nfor (let i = 1; i <= 5; i++) {\r\n    console.log(i);\r\n}\r\n```\r\n\r\n### While Loop\r\n\r\n```javascript\r\nlet i = 1;\r\n\r\nwhile (i <= 5) {\r\n    console.log(i);\r\n    i++;\r\n}\r\n```\r\n\r\nLoops are useful when processing collections of data.\r\n\r\n---"
        },
        {
                "title": "Lesson 28",
                "description": "Functions are reusable blocks of code.\r \r ```javascript\r function add(a, b) {\r     return a + b;\r }\r...",
                "content": "Functions are reusable blocks of code.\r\n\r\n```javascript\r\nfunction add(a, b) {\r\n    return a + b;\r\n}\r\n\r\nlet result = add(10, 20);\r\nconsole.log(result);\r\n```\r\n\r\nFunctions improve:\r\n\r\n- Reusability\r\n- Organization\r\n- Maintainability\r\n- Readability\r\n\r\n---"
        },
        {
                "title": "Lesson 29",
                "description": "Arrays store multiple values.\r \r ```javascript\r let courses = [\r     \"HTML\",\r     \"CSS\",\r     \"JavaS...",
                "content": "Arrays store multiple values.\r\n\r\n```javascript\r\nlet courses = [\r\n    \"HTML\",\r\n    \"CSS\",\r\n    \"JavaScript\"\r\n];\r\n\r\nconsole.log(courses[0]);\r\n```\r\n\r\nCommon methods include:\r\n\r\n```javascript\r\ncourses.push(\"React\");\r\ncourses.pop();\r\ncourses.includes(\"CSS\");\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 30",
                "description": "Objects store related information using key-value pairs.\r \r ```javascript\r let student = {\r     name...",
                "content": "Objects store related information using key-value pairs.\r\n\r\n```javascript\r\nlet student = {\r\n    name: \"Arun\",\r\n    age: 21,\r\n    department: \"AIML\"\r\n};\r\n\r\nconsole.log(student.name);\r\n```\r\n\r\nObjects are fundamental to modern JavaScript development because application data is frequently represented using objects.\r\n\r\n---"
        },
        {
                "title": "Lesson 31",
                "description": "The DOM represents an HTML document as a tree of objects.\r \r JavaScript can use the DOM to modify a ...",
                "content": "The DOM represents an HTML document as a tree of objects.\r\n\r\nJavaScript can use the DOM to modify a webpage dynamically.\r\n\r\nHTML:\r\n\r\n```html\r\n<h1 id=\"title\">Old Text</h1>\r\n<button onclick=\"changeText()\">Change</button>\r\n```\r\n\r\nJavaScript:\r\n\r\n```javascript\r\nfunction changeText() {\r\n    document.getElementById(\"title\").textContent =\r\n        \"New Text\";\r\n}\r\n```\r\n\r\nWhen the button is clicked, the heading changes.\r\n\r\n---"
        },
        {
                "title": "Lesson 32",
                "description": "JavaScript provides several methods.\r \r ```javascript\r document.getElementById(\"title\");\r \r document...",
                "content": "JavaScript provides several methods.\r\n\r\n```javascript\r\ndocument.getElementById(\"title\");\r\n\r\ndocument.querySelector(\".card\");\r\n\r\ndocument.querySelectorAll(\"p\");\r\n```\r\n\r\n`querySelector()` is particularly useful because it can use CSS-style selectors.\r\n\r\n---"
        },
        {
                "title": "Lesson 33",
                "description": "Events occur when users interact with a webpage.\r \r Examples:\r \r - Click\r - Submit\r - Mouse movement...",
                "content": "Events occur when users interact with a webpage.\r\n\r\nExamples:\r\n\r\n- Click\r\n- Submit\r\n- Mouse movement\r\n- Keyboard input\r\n- Change\r\n- Focus\r\n\r\nExample:\r\n\r\n```javascript\r\nconst button = document.querySelector(\"#btn\");\r\n\r\nbutton.addEventListener(\"click\", function () {\r\n    alert(\"Button clicked\");\r\n});\r\n```\r\n\r\nThis separates JavaScript behavior from the HTML markup and is generally preferable to putting event handlers directly in HTML.\r\n\r\n---"
        },
        {
                "title": "Lesson 34",
                "description": "JavaScript can validate form input before submission.\r \r ```javascript\r function validateForm() {\r  ...",
                "content": "JavaScript can validate form input before submission.\r\n\r\n```javascript\r\nfunction validateForm() {\r\n    let name = document.getElementById(\"name\").value;\r\n\r\n    if (name === \"\") {\r\n        alert(\"Name is required\");\r\n        return false;\r\n    }\r\n\r\n    return true;\r\n}\r\n```\r\n\r\nHowever, client-side validation should **not** be considered a security mechanism. Important validation must also happen on the server.\r\n\r\n---"
        },
        {
                "title": "Lesson 35",
                "description": "Modern websites often communicate with APIs.\r \r JavaScript's `fetch()` can make HTTP requests.\r \r ``...",
                "content": "Modern websites often communicate with APIs.\r\n\r\nJavaScript's `fetch()` can make HTTP requests.\r\n\r\n```javascript\r\nfetch(\"https://example.com/api/users\")\r\n    .then(response => response.json())\r\n    .then(data => {\r\n        console.log(data);\r\n    })\r\n    .catch(error => {\r\n        console.error(error);\r\n    });\r\n```\r\n\r\nThe general flow is:\r\n\r\n```text\r\nWebpage\r\n   ↓\r\nJavaScript\r\n   ↓\r\nAPI Request\r\n   ↓\r\nServer\r\n   ↓\r\nJSON Response\r\n   ↓\r\nWebpage\r\n```\r\n\r\n---"
        },
        {
                "title": "Lesson 36",
                "description": "JSON stands for **JavaScript Object Notation**.\r \r It is commonly used to exchange data between fron...",
                "content": "JSON stands for **JavaScript Object Notation**.\r\n\r\nIt is commonly used to exchange data between frontend and backend systems.\r\n\r\nExample:\r\n\r\n```json\r\n{\r\n    \"name\": \"Arun\",\r\n    \"age\": 21,\r\n    \"department\": \"AIML\"\r\n}\r\n```\r\n\r\nJSON is widely used in REST APIs.\r\n\r\n---"
        },
        {
                "title": "Lesson 37",
                "description": "Every modern browser provides developer tools.\r \r Important sections include:\r \r - Elements\r - Conso...",
                "content": "Every modern browser provides developer tools.\r\n\r\nImportant sections include:\r\n\r\n- Elements\r\n- Console\r\n- Network\r\n- Sources\r\n- Application\r\n- Performance\r\n\r\n### Elements\r\n\r\nUsed to inspect HTML and CSS.\r\n\r\n### Console\r\n\r\nUsed to view JavaScript output and errors.\r\n\r\n### Network\r\n\r\nUsed to inspect:\r\n\r\n- API requests\r\n- Responses\r\n- HTTP status codes\r\n- Loading times\r\n\r\nDeveloper tools are essential for debugging websites.\r\n\r\n---"
        },
        {
                "title": "Lesson 38",
                "description": "Accessibility means designing websites that can be used by people with different abilities.\r \r Impor...",
                "content": "Accessibility means designing websites that can be used by people with different abilities.\r\n\r\nImportant practices include:\r\n\r\n- Use semantic HTML.\r\n- Provide meaningful `alt` text.\r\n- Use labels for form controls.\r\n- Maintain sufficient color contrast.\r\n- Make interactive elements keyboard accessible.\r\n- Do not rely only on color to communicate information.\r\n\r\nExample:\r\n\r\n```html\r\n<label for=\"email\">Email Address</label>\r\n<input id=\"email\" type=\"email\">\r\n```\r\n\r\nThis is better than presenting an unlabeled input field.\r\n\r\n---"
        },
        {
                "title": "Lesson 39",
                "description": "A slow website creates a poor user experience.\r \r Common performance considerations:\r \r - Compress i...",
                "content": "A slow website creates a poor user experience.\r\n\r\nCommon performance considerations:\r\n\r\n- Compress images.\r\n- Avoid unnecessary JavaScript.\r\n- Minimize large resources.\r\n- Use efficient CSS.\r\n- Lazy-load appropriate content.\r\n- Cache static resources.\r\n- Reduce unnecessary network requests.\r\n\r\nA useful principle is:\r\n\r\n> Send the browser only what it actually needs.\r\n\r\n---"
        },
        {
                "title": "Lesson 40",
                "description": "Security must be considered from the beginning of development.\r \r Common web security risks include:...",
                "content": "Security must be considered from the beginning of development.\r\n\r\nCommon web security risks include:\r\n\r\n- Cross-Site Scripting (XSS)\r\n- SQL Injection\r\n- Cross-Site Request Forgery (CSRF)\r\n- Weak authentication\r\n- Insecure data handling\r\n\r\n### Basic Security Practices\r\n\r\n- Validate and sanitize input.\r\n- Never trust user input.\r\n- Use HTTPS.\r\n- Store passwords using secure password-hashing mechanisms.\r\n- Keep dependencies updated.\r\n- Avoid exposing sensitive information.\r\n- Use proper authentication and authorization.\r\n\r\n---"
        },
        {
                "title": "Lesson 41",
                "description": "A basic project can be organized like this:\r \r ```text\r my-website/\r │\r ├── index.html\r ├── about.ht...",
                "content": "A basic project can be organized like this:\r\n\r\n```text\r\nmy-website/\r\n│\r\n├── index.html\r\n├── about.html\r\n├── contact.html\r\n│\r\n├── css/\r\n│   └── style.css\r\n│\r\n├── js/\r\n│   └── script.js\r\n│\r\n└── images/\r\n    └── logo.png\r\n```\r\n\r\nThis structure separates:\r\n\r\n- HTML\r\n- CSS\r\n- JavaScript\r\n- Images\r\n\r\nand makes the project easier to maintain.\r\n\r\n---"
        },
        {
                "title": "Lesson 42",
                "description": "A beginner-friendly project can combine all the concepts.\r \r ### HTML\r \r ```html\r <!DOCTYPE html>\r <...",
                "content": "A beginner-friendly project can combine all the concepts.\r\n\r\n### HTML\r\n\r\n```html\r\n<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <title>My Portfolio</title>\r\n    <link rel=\"stylesheet\" href=\"style.css\">\r\n</head>\r\n\r\n<body>\r\n\r\n<header>\r\n    <h1>My Portfolio</h1>\r\n    <nav>\r\n        <a href=\"#about\">About</a>\r\n        <a href=\"#skills\">Skills</a>\r\n        <a href=\"#contact\">Contact</a>\r\n    </nav>\r\n</header>\r\n\r\n<main>\r\n\r\n<section id=\"about\">\r\n    <h2>About Me</h2>\r\n    <p>I am a student learning web development.</p>\r\n</section>\r\n\r\n<section id=\"skills\">\r\n    <h2>Skills</h2>\r\n    <ul>\r\n        <li>HTML</li>\r\n        <li>CSS</li>\r\n        <li>JavaScript</li>\r\n    </ul>\r\n</section>\r\n\r\n<section id=\"contact\">\r\n    <h2>Contact</h2>\r\n\r\n    <form>\r\n        <input type=\"text\" placeholder=\"Name\">\r\n        <input type=\"email\" placeholder=\"Email\">\r\n        <button type=\"submit\">Send</button>\r\n    </form>\r\n</section>\r\n\r\n</main>\r\n\r\n<footer>\r\n    <p>© 2026 My Portfolio</p>\r\n</footer>\r\n\r\n<script src=\"script.js\"></script>\r\n</body>\r\n</html>\r\n```\r\n\r\n### CSS\r\n\r\n```css\r\nbody {\r\n    font-family: Arial, sans-serif;\r\n    margin: 0;\r\n    line-height: 1.6;\r\n}\r\n\r\nheader {\r\n    padding: 20px;\r\n    text-align: center;\r\n    background: #222;\r\n    color: white;\r\n}\r\n\r\nnav a {\r\n    color: white;\r\n    margin: 10px;\r\n    text-decoration: none;\r\n}\r\n\r\nsection {\r\n    padding: 40px;\r\n    max-width: 800px;\r\n    margin: auto;\r\n}\r\n\r\nform {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n}\r\n\r\ninput,\r\nbutton {\r\n    padding: 12px;\r\n}\r\n\r\nbutton {\r\n    cursor: pointer;\r\n}\r\n```\r\n\r\n### JavaScript\r\n\r\n```javascript\r\nconst form = document.querySelector(\"form\");\r\n\r\nform.addEventListener(\"submit\", function(event) {\r\n    event.preventDefault();\r\n    alert(\"Message submitted successfully!\");\r\n});\r\n```\r\n\r\nThis small project demonstrates:\r\n\r\n- HTML structure\r\n- Semantic elements\r\n- Navigation\r\n- Forms\r\n- CSS styling\r\n- Flexbox\r\n- JavaScript\r\n- DOM selection\r\n- Events\r\n\r\n---"
        },
        {
                "title": "Lesson 43",
                "description": "The course should be learned in this order:\r \r ```text\r 1. How the Web Works\r         ↓\r 2. HTML Bas...",
                "content": "The course should be learned in this order:\r\n\r\n```text\r\n1. How the Web Works\r\n        ↓\r\n2. HTML Basics\r\n        ↓\r\n3. Semantic HTML\r\n        ↓\r\n4. Forms and Tables\r\n        ↓\r\n5. CSS Basics\r\n        ↓\r\n6. Box Model\r\n        ↓\r\n7. Flexbox\r\n        ↓\r\n8. CSS Grid\r\n        ↓\r\n9. Responsive Design\r\n        ↓\r\n10. JavaScript Basics\r\n        ↓\r\n11. DOM Manipulation\r\n        ↓\r\n12. Events\r\n        ↓\r\n13. Form Validation\r\n        ↓\r\n14. APIs and JSON\r\n        ↓\r\n15. Accessibility\r\n        ↓\r\n16. Performance\r\n        ↓\r\n17. Security Basics\r\n        ↓\r\n18. Final Web Project\r\n```"
        },
        {
                "title": "Lesson 44",
                "description": "After completing **Web Development Fundamentals**, a learner should be able to:\r \r - Explain how web...",
                "content": "After completing **Web Development Fundamentals**, a learner should be able to:\r\n\r\n- Explain how websites work.\r\n- Create structured HTML webpages.\r\n- Use semantic HTML correctly.\r\n- Create forms and tables.\r\n- Style webpages using CSS.\r\n- Use Flexbox and CSS Grid.\r\n- Build responsive layouts.\r\n- Write basic JavaScript.\r\n- Manipulate the DOM.\r\n- Handle browser events.\r\n- Validate user input.\r\n- Consume basic APIs.\r\n- Work with JSON.\r\n- Debug using browser developer tools.\r\n- Apply basic accessibility principles.\r\n- Understand fundamental web security.\r\n- Build and deploy a complete beginner-level responsive website."
        }
]
    },
    {
      title: "React from Zero to Hero",
      description: "Master modern React with hooks, context, and component patterns used in production apps.",
      topics: "React,JavaScript,Frontend",
      internRole: "Frontend Development",
      lessons: []
    },
    {
      title: "Python for Data Analysis",
      description: "Use pandas, NumPy, and matplotlib to clean, analyze, and visualize real datasets.",
      topics: "Python,Data,Pandas,Numpy",
      internRole: "Data Science",
      lessons: []
    },
    {
      title: "SQL and Database Design",
      description: "Write efficient queries and design normalized schemas that scale with your application.",
      topics: "SQL,Database,Design",
      internRole: "Backend Development",
      lessons: []
    },
    {
      title: "UI/UX Design Principles",
      description: "Understand layout, typography, color, and usability to design interfaces people love.",
      topics: "UI,UX,Design",
      internRole: "UI/UX Design",
      lessons: []
    },
    {
      title: "Machine Learning Basics",
      description: "A practical introduction to supervised learning, model evaluation, and scikit-learn.",
      topics: "Machine Learning,Python,AI",
      internRole: "Data Science",
      lessons: []
    },
    {
      title: "Digital Marketing Essentials",
      description: "Grow an audience with SEO, content strategy, email funnels, and paid ads that convert.",
      topics: "Marketing,SEO,Ads",
      internRole: "Marketing",
      lessons: []
    },
    {
      title: "Business English Communication",
      description: "Write clear emails, run confident meetings, and present your ideas professionally.",
      topics: "English,Business,Communication",
      internRole: "Business",
      lessons: []
    },
    {
      title: "Graphic Design with Figma",
      description: "Go from blank canvas to polished design system using Figma's modern workflow.",
      topics: "Figma,Design,Graphics",
      internRole: "Graphic Design",
      lessons: []
    },
    {
      title: "Mobile App Development with React Native",
      description: "Build and ship cross-platform iOS and Android apps from a single codebase.",
      topics: "React Native,Mobile,iOS,Android",
      internRole: "Mobile Development",
      lessons: []
    },
    {
      title: "Cybersecurity Awareness",
      description: "Recognize phishing, secure your accounts, and understand the basics of staying safe online",
      topics: "Security,Cybersecurity",
      internRole: "Security",
      lessons: []
    },
    {
      title: "Public Speaking Masterclass",
      description: "Beat stage fright and deliver talks that hold an audience from first line to last.",
      topics: "Speaking,Communication,Public Speaking",
      internRole: "Communication",
      lessons: []
    }
  ];

  // We need to delete old lessons first if we run upsert on courses, 
  // because nested create won't update existing lessons correctly.
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.internship.deleteMany();

  for (const c of coursesData) {
    const courseId = c.title.replace(/[\s\/]+/g, "-").toLowerCase();
    await prisma.course.upsert({
      where: { id: courseId },
      update: {
        description: c.description,
        topics: c.topics,
        internRole: c.internRole,
        lessons: {
          create: c.lessons.map((l, index) => ({
            title: l.title,
            description: l.description,
            content: l.content,
            order: index + 1
          }))
        }
      },
      create: {
        id: courseId,
        title: c.title,
        description: c.description,
        topics: c.topics,
        internRole: c.internRole,
        lessons: {
          create: c.lessons.map((l, index) => ({
            title: l.title,
            description: l.description,
            content: l.content,
            order: index + 1
          }))
        }
      },
    });
  }
  console.log(`✅ ${coursesData.length} courses seeded with 6-8 lessons each`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
