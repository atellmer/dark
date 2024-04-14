# @dark-engine/web-router 🌖

The isomorphic Dark router designed for rendering universal web applications that work both on the client and on the server.

[More about Dark](https://github.com/atellmer/dark)

## Features
- 🌳 Nested routes
- 🍩 Lazy loading
- ↪️ Redirects
- 🌠 Wildcards a.k.a Fallbacks
- 🔄 Combination wildcards and redirects
- 🔢 Parameters
- 📈 Hooks
- 💽 SSR
- ✂️ No deps
- 📦 Small size (4 kB gzipped)

## Installation

npm:
```
npm install @dark-engine/web-router
```
yarn:
```
yarn add @dark-engine/web-router
```

CDN:
```html
<script src="https://unpkg.com/@dark-engine/web-router/dist/umd/dark-web-router.production.min.js"></script>
```

## API

```tsx
import {
  type Routes,
  type RouterRef,
  Router,
  Link,
  NavLink,
  useLocation,
  useHistory,
  useParams,
  useMatch,
  VERSION,
} from '@dark-engine/web-router';
```

## Defining a basic route 

```tsx
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
];

const App = component(() => {
  return (
    <Router routes={routes}>
      {slot => {
        return (
          <>
            <header>
              <NavLink to='/first-component'>first-component</NavLink>
              <NavLink to='/second-component'>second-component</NavLink>
            </header>
            <main>{slot}</main> {/*<-- a route content will be placed here*/}
          </>
        );
      }}
    </Router>
  );
});
```

## `<base href>`

You must add the <base href> element to the application's index.html for pushState routing to work.

```html
<base href="/">
```

Also you must pass the baseUrl to Router if it is different from '/'.

```tsx
<Router routes={routes} baseUrl={YOUR_BASE_URL}>{slot => slot}</Router>
```

## Route order

The order of routes is important because the Router uses a first-match wins strategy when matching routes, so more specific routes should be placed above less specific routes. List routes with a static path first, followed by an empty path route, which matches the default route. The wildcard route comes last because it matches every URL and the Router selects it only if no other routes match first.

## Getting route information

```tsx
const FirstComponent = component(() => {
  const location = useLocation(); // url, protocol, host, pathname, search, key
  const match = useMatch(); // url prefix for links

  return <div>FirstComponent</div>;
});
```

## Setting up wildcard routes

```tsx
{ path: '**', component: ComponentName }
```

## Displaying a 404 page

```tsx
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

## Setting up redirects

```tsx
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

## Nesting routes

```tsx
const routes: Routes = [
  {
    path: 'first-component',
    component: FirstComponent, // The component receives children routes as slot
    children: [
      {
        path: 'child-a', 
        component: ChildAComponent,
      },
      {
        path: 'child-b',
        component: ChildBComponent,
      },
    ],
  },
];
```

## Flat Nesting routes

```tsx
const routes: Routes = [
  {
    path: 'first-component/child-a',
    component: ChildAComponent,
  },
   {
    path: 'first-component/child-b',
    component: ChildBComponent,
  },
  {
    path: 'first-component',
    component: FirstComponent, // In this case slot will be null
  },
];
```
## Nested wildcards

```tsx
const routes: Routes = [
 {
    path: 'first-component',
    component: FirstComponent,
    children: [
      {
        path: 'child-a', 
        component: ChildAComponent,
      },
      {
        path: 'child-b',
        component: ChildBComponent,
      },
      {
        path: '**',
        redirectTo: 'child-a',
      },
    ],
  },
];
```

or 

```tsx
const routes: Routes = [
 {
    path: 'first-component',
    component: FirstComponent,
    children: [
      {
        path: 'child-a', 
        component: ChildAComponent,
      },
      {
        path: 'child-b',
        component: ChildBComponent,
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];
```

## Navigation

### via `Link` or `NavLink`

```tsx
<Link to='/user/50'>Go to profile</Link>
<NavLink to='/home'>Home</NavLink>
```

`NavLink` internally uses `Link`, but at the same time provides a CSS class `.active-link` if the current URL is equal to or contains the `to` parameter of `NavLink`.
`NavLink` can be used for headers and menus, which will continue to be on the page when it is clicked and the content is changed.
`Link` means that it will disappear from the screen after you click it and go to another page. Of course you can create your own logic based on `Link`, using it as a base component.


### via `history`

```tsx
const SomeComponent = component(() => {
  const history = useHistory();

  useEffect(() => {
    history.push('/home'); // or history.replace('/home');
  }, []);

  return <div>SomeComponent</div>;
});
```

## Parameters

Sometimes, a feature of your application requires accessing a part of a route, such as a parameter like id of something. You can define parameterized route like below.

```tsx
const routes: Routes = [
  {
    path: 'first-component/:id',
    component: FirstComponent,
  },
  {
    path: 'second-component',
    component: SecondComponent,
  },
];
```

Then get access for parameter through hook

```tsx
const FirstComponent = component(() => {
  const params = useParams();
  const id = Number(params.get('id'));

  return <div>FirstComponent: {id}</div>;
});
```

## Lazy loading

You can configure your routes to lazy load modules, which means that Dark only loads modules as needed, rather than loading all modules when the application launches.

```tsx
import { lazy } from '@dark-engine/core';

const Home = lazy(() => import('../components/home'));
const About = lazy(() => import('../components/about'));
const Contacts = lazy(() => import('../components/contacts'));

const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'contacts',
    component: Contacts,
  },
];
```

## Imperative access to router

```tsx
const App = component<AppProps>(({ url, routes }) => {
  const ref = useRef<RouterRef>(null);

  useEffect(() => {
    ref.current.navigateTo('/about');
  }, []);

  return (
    <Router ref={ref} routes={routes}>
      {slot => slot}
    </Router>
  );
});
```

## Server-Side Rendering (SSR)

If you are rendering the application on the server, then you must pass the request URL to the router to emulate routing when rendering to a string.

```tsx
server.get('*', async (req, res) => {
  const { url } = req;
  const app = await renderToString(Page({ title: 'My App', slot: App({ url }) }));
  const page = `<!DOCTYPE html>${app}`;

  res.statusCode = 200;
  res.send(page);
});
```

```tsx
const App = component(({ url }) => {
  <Router routes={routes} url={url}>{slot => slot}</Router>
})
```

Full example SSR routing you can see in `/examples`.

# LICENSE

MIT © [Alex Plex](https://github.com/atellmer)
