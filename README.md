  <p align="center">Plena Finance</p>

## Description

Access Key Management and Token Information Retrieval System(https://docs.google.com/document/d/1fc94aiV4yUEUdWBUjCy4aQuVqxzN2ZoDPhySSU74GOo/)

## Installation

```bash
$ cd access-key-management
$ npm install

$ cd token-info
$ npm install

```

## Access Key Commands

```bash
npm run start:command create -- --rate-limit 100 --expires-at "2024-12-31T23:59:59.999Z"

Access key created id:0453fcd8-ffbc-40ce-9609-7ff26e57133d

npm run start:command update --id "efe17e2d-bd01-44f6-8c27-5638aeb7c331" --rate-limit 101 --expires-at "2024-12-31T23:59:59.999Z"

[
  'accesskey',
  'update',
  'efe17e2d-bd01-44f6-8c27-5638aeb7c331',
  '101',
  '2024-12-31T23:59:59.999Z'
]
Access key updated id:efe17e2d-bd01-44f6-8c27-5638aeb7c331



npm run start:command delete -- --id "efe17e2d-bd01-44f6-8c27-5638aeb7c331"

npm run start:command list

Access key list: [
  AccessKey {
    id: '96a3fbf0-be97-4367-ae54-f773293c80c4',
    key: '3hkl31ev6ln',
    rateLimit: 100,
    expiresAt: 2024-12-31T23:59:59.999Z,
    isActive: true,
    createdAt: 2024-07-11T02:42:24.564Z,
    updatedAt: 2024-07-11T02:42:24.564Z
  },
  AccessKey {
    id: '0453fcd8-ffbc-40ce-9609-7ff26e57133d',
    key: 'qc1np6j25c',
    rateLimit: 101,
    expiresAt: 2024-12-31T23:59:59.999Z,
    isActive: true,
    createdAt: 2024-07-11T03:03:46.753Z,
    updatedAt: 2024-07-11T03:03:46.753Z
  }
]

```

## Running the app

```bash
# development
$ cd access-key-management
$ npm run start

$ cd token-info
$ npm run start


# watch mode
$ cd access-key-management
$ npm run start:dev

$ cd token-info
$ npm run start:dev

```

## Get Token with cURL

```bash
valid-api-key = qc1np6j25c (just example id)
curl -H "x-api-key: valid-api-key" "http://localhost:3000/token/info?tokenId=bitcoin"

{
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "web_slug": "bitcoin",
    "asset_platform_id": null,
    "platforms": { ...
}

```

## Test

```bash
# unit tests
$ cd access-key-management
$ npm run test

 PASS  src/modules/access-key/access-key.service.spec.ts
 PASS  src/api/access-key/access-key.controller.spec.ts (5.159 s)

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        5.779 s, estimated 6 s

$ cd token-info
$ npm run test

 PASS  src/app.controller.spec.ts
 PASS  src/api/token-info/token-info.controller.spec.ts
 PASS  src/modules/token-info.service.spec.ts (5.171 s)

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        5.857 s, estimated 6 s
Ran all test suites related to changed files.

```
