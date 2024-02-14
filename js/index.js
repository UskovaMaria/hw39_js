const routes = [
  { path: '', component: homePage },
  { path: '/home',  component: homePage },
  { path: '/about',  component: aboutPage },
  { path: '/contacts',  component: contactsPage },
  { path: '/posts',  component: postsPage },
  { path: '/posts/:id',  component: singlePage },
  { path: '**', component: notFoundPage },
];


const menu = document.querySelector('.header__menu');

menu.innerHTML = `
    <ul class="menu">
      <li><a href="#/home">Home</a></li>
      <li><a href="#/about">About</a></li>
      <li><a href="#/contacts">Contacts</a></li>
      <li><a href="#/posts">Posts</a></li>
    </ul>
  </div>
`;

checkRoute();

addEventListener('hashchange', () => {
  checkRoute();
});

function checkRoute() {
  const { hash, id, searchParams } = getHash();
  const route = routes.find(r => r.path === hash) || routes.find(r => r.path === '**');

  render(route.component({ id, searchParams }));
  checkActivePage();
}

function homePage() {
  return `
  <h2 class="outlet__header">Home page</h2>
  <div class="outlet__content">
    <img class="outlet__img" src="img/img1.avif" alt="">
    <p class="outlet__text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
      Ut rem voluptatem sapiente ex cum excepturi quo? Rem eius, nisi a tempora 
      temporibus facere totam quia, velit cupiditate facilis eveniet nulla?
    </p>
  </div>`;
}

function aboutPage() {
  return `
  <h2 class="outlet__header">About page</h2>
  <div class="outlet__content">
    <img class="outlet__img" src="img/img2.jpg" alt="">
    <p class="outlet__text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
      Ut rem voluptatem sapiente ex cum excepturi quo? Rem eius, nisi a tempora 
      temporibus facere totam quia, velit cupiditate facilis eveniet nulla?
    </p>
  </div>
  `;
}

function contactsPage() {
  return `
  <h2 class="outlet__header">Contacts page</h2>
  <div class="outlet__content">
    <img class="outlet__img" src="img/img3.jpg" alt="">
    <p class="outlet__text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
      Ut rem voluptatem sapiente ex cum excepturi quo? Rem eius, nisi a tempora 
      temporibus facere totam quia, velit cupiditate facilis eveniet nulla?
    </p>
  </div>
  `;
}

function postsPage() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(posts => {
      render(postsPageContent(posts));
    });
}

function postsPageContent(posts) {
  const postsHtml = posts.map(post => `
    <div class="outlet__content">
      <ul class="post-list">
        <li><a href="#/posts/${post.id}" class="post-link" data-post-id="${post.id}">${post.title}</a></li>
      </ul>
    </div>`).join('');

  return `
    <h2 class="outlet__header">Post page</h2>
    ${postsHtml}`;
}

function singlePage(props) {
  const { id } = props;
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(response => response.json())
    .then(post => {
      render(singlePageContent(post));
    });
}

function singlePageContent(post) {
  return `
    <h2>Single page</h2>
    <h3>${post.title}</h3>
    <div class="post">${post.body}</div>`;
}


function notFoundPage() {
  return (
    `
      <h2>404!!! Page not found</h2>
      <a href="#">Home page</a>
    `
  );
}

function render(component) {
  const outlet = document.querySelector('.outlet');
  outlet.innerHTML = component;
}

function getHash() {
  let hash = window.location.hash.slice(1);
  const resources = hash.split('/').filter(item => item);
  const searchParams = hash.split('?')[1];
  hash = hash.split('?')[0];

  if (resources.length === 2) {
    hash = `/${resources[0]}/:id`;
  }

  return {
    hash,
    id: resources[1],
    searchParams,
  };
}

function checkActivePage() {
  const hash = window.location.hash;
  const navLink = document.querySelectorAll('.menu a');
  navLink.forEach(link => link.classList.remove('active'));

  if (hash === '#/' || hash === '') {
    navLink[0].classList.add('active');
  } else {
    navLink.forEach(link => {
      const href = link.getAttribute('href');
      if (href !== '#/' && hash.includes(href)) {
        link.classList.add('active');
      }
    });
  }
}

function getSearchParams() {
  const hash = window.location.hash.slice(1);
  const searchParams = hash.split('?')[1];

  console.log(searchParams);
  return new URLSearchParams(searchParams);
}

function openPost(postId, posts) {
  // Fetch the single post based on postId
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then(response => response.json())
    .then(post => {
      // Render the single page with the post content
      render(singlePage(posts, { id: post.id, title: post.title, body: post.body }));
    });
}

