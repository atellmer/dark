import { type DarkElement, component, memo, useState, useTransition } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

const AboutTab = component(() => {
  return <p>Welcome to my profile!</p>;
});

const PostsTab = memo(
  component(() => {
    const items = [];

    console.log('...posts...');
    for (let i = 0; i < 500; i++) {
      items.push(<SlowPost key={i} index={i} />);
    }
    return <ul className='items'>{items}</ul>;
  }),
);

type SlowPostProps = {
  index: number;
};

const SlowPost = component<SlowPostProps>(({ index }) => {
  const startTime = performance.now();

  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return <li className='item'>Post #{index + 1}</li>;
});

const ContactTab = component(() => {
  return (
    <div class='red'>
      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
});

type TabButtonProps = {
  slot: DarkElement;
  isActive: boolean;
  onClick: () => void;
};

const TabButton = component<TabButtonProps>(({ slot, isActive, onClick }) => {
  if (isActive) {
    return <b>{slot}</b>;
  }

  return <button onClick={onClick}>{slot}</button>;
});

const App = component(() => {
  const [tab, setTab] = useState('about');
  const [isPending, startTransition] = useTransition();

  const selectTab = (nextTab: string) => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <>
      <TabButton isActive={tab === 'about'} onClick={() => selectTab('about')}>
        About
      </TabButton>
      <TabButton isActive={tab === 'posts'} onClick={() => selectTab('posts')}>
        Posts (slow)
      </TabButton>
      <TabButton isActive={tab === 'contact'} onClick={() => selectTab('contact')}>
        Contact
      </TabButton>
      <hr />
      {isPending ? (
        <div>PENDING...</div>
      ) : (
        <>
          {tab === 'about' && <AboutTab />}
          {tab === 'posts' && <PostsTab />}
          {tab === 'contact' && <ContactTab />}
        </>
      )}
    </>
  );
});

createRoot(document.getElementById('root')).render(<App />);
