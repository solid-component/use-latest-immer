# use-latest-immer

A hook to use [immer](https://github.com/solid-component/use-latest-immer) as a React [hook](https://reactjs.org/docs/hooks-intro.html) to manipulate state. Ant return the latest state

# Installation

`npm install immer use-latest-immer`

# API

## useLatestImmer

`useLatestImmer(initialState)` is very similar to [`useState`](https://reactjs.org/docs/hooks-state.html).
The function returns a tuple, the first value of the tuple is the current state, the second is the updater function,
which accepts an [immer producer function](https://immerjs.github.io/immer/produce) or a value as argument.  

### Managing state with immer producer function

When passing a function to the updater, the `draft` argument can be mutated freely, until the producer ends and the changes will be made immutable and become the next state.

[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

Example: https://codesandbox.io/s/l97yrzw8ol
```javascript
import React from "react";
import { useLatestImmer } from "use-latest-immer";


function App() {
  const [person, {setState: updatePerson, getLatest}] = uselatestImmer({
    name: "Michel",
    age: 33
  });
  // 🔴 Avoid
  useEffect(() => {
    fetch("...", {
      body: JSON.stringify(person)
    })
  }, [person])

  function updateName(name) {
    updatePerson(draft => {
      draft.name = name;
    });
    // ✅ Good
    fetch("...", {
      body: JSON.stringify(getLatest())
    })
    console.log("latest", getLatest())  // output the latest person
  }

  function becomeOlder() {
    updatePerson(draft => {
      draft.age++;
    });
    console.log("latest", getLatest())
  }

  return (
    <div className="App">
      <h1>
        Hello {person.name} ({person.age})
      </h1>
      <input
        onChange={e => {
          updateName(e.target.value);
          console.log("latest", getLatest())
        }}
        value={person.name}
      />
      <br />
      <button onClick={becomeOlder}>Older</button>
    </div>
  );
}
```

(obviously, immer is a little overkill for this example)

### Managing state as simple useState hook
When passing a value to the updater instead of a function, `useLatestImmer` hook behaves the same as useState hook and updates the state with that value.

```javascript
import React from 'react';
import { useLatestImmer } from 'use-latest-immer';

function BirthDayCelebrator(){
  const [age, setAge] = useLatestImmer(20);

  function birthDay(event){
    setAge(age + 1);
    alert(`Happy birthday #${age} Anon! hope you good`);
  }

  return(
    <div>
      <button onClick={birthDay}>It is my birthday</button>
    </div>
  );
}
```

Obviously if you have to deal with immutability it is better option passing a function to the updater instead of a direct value.
