import { h, createComponent, useState, useRef } from '@dark-engine/core';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

  return (
    <frame>
      <page actionBarHidden>
        <stack-layout>
          <label>Hello world: {count}</label>
          {count === 5 && <label>karamba!</label>}
          <button class='button' onTap={() => setCount(count + 1)}>
            fired {count} times
          </button>
        </stack-layout>
        {/* <stack-layout>
          <button class='button' onTap={() => setCount(count + 1)}>
            [aaa]fired {count} times
          </button>
          <scroll-view scrollBarIndicatorVisible>
            <stack-layout>
              {Array(100)
                .fill(null)
                .map((_, idx) => {
                  return (
                    <label key={idx}>
                      item #{idx + 1} : {count}
                    </label>
                  );
                })}
            </stack-layout>
          </scroll-view>
        </stack-layout> */}
        {/* <slider value='10' minValue='0' maxValue='100' onLoaded={() => console.log('xxx')}/> */}
        {/* <tab-view
          selectedIndex={0}
          onSelectedIndexChanged={() => {}}
          androidTabsPosition='top'
          androidOffscreenTabLimit='0'>
          <tab-view-item title='Profile'>
            <stack-layout>
              <label text='1' textWrap />
              <button text='Change Tab' onTap={() => console.log('tap', 1)} />
            </stack-layout>
          </tab-view-item>
          <tab-view-item title='Stats'>
            <stack-layout>
              <label text='2' textWrap />
              <button text='Change Tab' onTap={() => console.log('tap', 2)} />
            </stack-layout>
          </tab-view-item>
          <tab-view-item title='Settings'>
            <stack-layout>
              <label text='3' textWrap />
              <button text='Change Tab' onTap={() => console.log('tap', 3)} />
            </stack-layout>
          </tab-view-item>
        </tab-view> */}
        {/* <stack-layout>
          <web-view
            ref={ref}
            src={`
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
              <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
          `}
          />
        </stack-layout> */}
      </page>
    </frame>
  );
});

export default App;
