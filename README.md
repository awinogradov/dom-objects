# DOM Objects

DOM Objects declarations for tests, e2e, cypress and etc.

> npm i -D dom-objects

## Usage

``` ts
// utils/objects.ts
import { configureDomObjects } from 'dom-objects';


const DO = configureDomObjects({
  attributeName: 'cy',
});

export const header = DO('header');
export const createMenu = header.add('createMenu');
export const createButton = createMenu.add('createButton');
```

``` tsx
// src/components/button.tsx
import { createButton } from '../../utils/objects';

export const Page = () => (
  <main>
    <form>
      <button {...createButton.attrs}>Submit</button>
    </form>
  </main>
)
```

``` ts
// cypress/e2e/test.cy.ts
import { createButton } from '../../utils/objects';

describe('Test', () => {
  it('must be', () => {
    //...
    cy.get(createButton.query).click();
    //...
  });
});
```

### License [MIT](https://github.com/awinogradov/dom-objects/blob/main/LICENSE)
