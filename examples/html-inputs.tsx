import { h, Fragment, component, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

const App = component(() => {
  const [textInputValue, setTextInputValue] = useState('hello');
  const [passwordInputValue, setPasswordInputValue] = useState('12345');
  const [numberInputValue, setNumberInputValue] = useState(10);
  const [colorInputValue, setColorInputValue] = useState('#8260d2');
  const [textareaValue, setTextareaValue] = useState('world');
  const [checkboxInputValue, setCheckboxInputValue] = useState(true);
  const [radioInputValue, setRadioInputValue] = useState('phone');
  const [selectValue, setSelectValue] = useState('Cat 🐱');
  const [multiSelectValue, setMultiSelectValue] = useState(['Apple 🍎', 'Watermelon 🍉']);

  return (
    <>
      <h1>HTML input elements</h1>
      <hr />
      <div>
        html5 form validation
        <form
          onSubmit={e => {
            e.preventDefault();
            alert(
              JSON.stringify({
                login: e.target['login'].value,
                password: e.target['password'].value,
              }),
            );
          }}>
          <input
            type='text'
            name='login'
            autoFocus
            maxLength={10}
            data-item={true}
            placeholder='login (max length 10)'
            required
          />
          <input type='password' name='password' placeholder='password' required />
          <input type='submit' value='Sign in' />
        </form>
      </div>
      <hr />
      <div>
        <div>disabled input</div>
        <input value='hello' disabled />
      </div>
      <hr />
      <div>
        <div>readonly input</div>
        <input value='hello' readOnly />
      </div>
      <hr />
      <div>
        <div>text input: {textInputValue}</div>
        <input type='text' value={textInputValue} required onInput={e => setTextInputValue(e.target.value)} />
      </div>
      <hr />
      <div>
        <div>password input: {passwordInputValue}</div>
        <input type='password' value={passwordInputValue} onInput={e => setPasswordInputValue(e.target.value)} />
      </div>
      <hr />
      <div>
        <div>number input: {numberInputValue}</div>
        <input type='number' value={numberInputValue} onInput={e => setNumberInputValue(Number(e.target.value))} />
      </div>
      <hr />
      <div>
        <div style={`color: ${colorInputValue}`}>color input: {colorInputValue}</div>
        <input type='color' value={colorInputValue} onInput={e => setColorInputValue(e.target.value)} />
      </div>
      <hr />
      <div>
        <div>textarea: {textareaValue}</div>
        <textarea value={textareaValue} onInput={e => setTextareaValue(e.target.value)}></textarea>
      </div>
      <hr />
      <div>
        <label>
          <input
            type='checkbox'
            value={checkboxInputValue}
            onChange={() => setCheckboxInputValue(!checkboxInputValue)}
          />
          {checkboxInputValue ? 'checked' : 'unchecked'}
        </label>
      </div>
      <hr />
      <div>
        <div>radio input: {radioInputValue}</div>
        {['email', 'phone', 'mail'].map((x, idx) => {
          return (
            <label key={idx + x}>
              <input
                type='radio'
                name='contact'
                value={x}
                checked={radioInputValue === x}
                onChange={e => setRadioInputValue(e.target.value)}
              />
              {x}
            </label>
          );
        })}
      </div>
      <hr />
      <div>
        <div>select: {selectValue}</div>
        <label>
          Choose a pet:
          <br />
          <select name='pet' style='width: 200px' onChange={e => setSelectValue(e.target.value)}>
            {['Dog 🐶', 'Cat 🐱', 'Fox 🦊'].map((x, idx) => {
              return (
                <option key={idx + x} value={x} selected={selectValue === x}>
                  {x}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      <hr />
      <div>
        <div>multiple select: {JSON.stringify(multiSelectValue)}</div>
        <label>
          Choose a fruit:
          <br />
          <select
            name='fruit'
            style='width: 200px'
            multiple
            onChange={e => setMultiSelectValue(Array.from(e.target.selectedOptions).map(x => x.value))}>
            {['Apple 🍎', 'Banana 🍌', 'Watermelon 🍉', 'Strawberry🍓'].map((x, idx) => {
              return (
                <option key={idx + x} value={x} selected={multiSelectValue.includes(x)}>
                  {x}
                </option>
              );
            })}
          </select>
        </label>
      </div>
    </>
  );
});

createRoot(document.getElementById('root')).render(<App />);
