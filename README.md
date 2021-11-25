# Pokedex API

### Note:

This api only contains pokemon from the first generation.

Only GET requests are handled.

By default this api will return the first five pokemon. Use the `?all` query parameter to get the whole list.

### Base URL:

https://expressjs-pokedex.herokuapp.com/pokedex

### To get all pokemon:

`?all`

### Filter:

`?query`

Filter the list with your query.

`?types`

Filter the list with pokemon type. For more than one type, seperate the values with comma.

### Sort:

By default the list is ascending on column `id`.

`?orderBy`

default: `asc`

possible values: `asc`, `desc`

If the value is not `asc` or `desc`, then it will fallback to `asc`.

`?column`

default: `id`

possible values: `id`, `name`

If the value is not `id` or `name`, then it will fallback to `id`.

### Paginate:

`?offset`

From where the list should start.

`?limit`

How many items to return.

### To get the types of pokemon:

`/types`

### Examples:

```javascript
fetch('https://expressjs-pokedex.herokuapp.com/pokedex')
  .then(response => response.json())
  .then(pokemon => {
    console.log(pokemon)
  })
  .catch(err => {
    console.log(err)
  })
```

response:

```javascript
{
  data: [
    {
      id: '001',
      name: 'Bulbasaur',
      description:
        'While it is young, it uses the nutrients that are stored in the seeds on its back in order to grow.',
      img_small:
        'https://img.pokemondb.net/sprites/sword-shield/icon/bulbasaur.png',
      img_large: 'https://img.pokemondb.net/artwork/bulbasaur.jpg',
      types: ['Grass', 'Poison'],
    },
    // ...rest
  ],
  count: '151',
}
```

```javascript
fetch('https://expressjs-pokedex.herokuapp.com/pokedex/types')
  .then(response => response.json())
  .then(pokemon => {
    console.log(pokemon)
  })
  .catch(err => {
    console.log(err)
  })
```

response:

```javascript
{
  data: [
    'Grass',
    'Poison',
    'Fire',
    'Flying',
    'Water',
    'Bug',
    'Normal',
    'Electric',
    'Ground',
    'Fairy',
    'Fighting',
    'Psychic',
    'Rock',
    'Steel',
    'Ice',
    'Ghost',
    'Dragon',
  ],
  count: 17,
}
```
