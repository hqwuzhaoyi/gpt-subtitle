# server

## 1.10.0

### Minor Changes

- [`f991611`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/f9916112903b4dc5b98edc27254f0b4f544e1be9) Thanks [@hqwuzhaoyi](https://github.com/hqwuzhaoyi)! - Filter according to the following languages when opening, find videos without specified languages for translation, and translate based on whether subtitles are included when closing.

## 1.9.0

### Minor Changes

- [#361](https://github.com/hqwuzhaoyi/gpt-subtitle/pull/361) [`9d4a28a`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/9d4a28a3925e482dde500a7d884c8e448a4af056) Thanks [@hqwuzhaoyi](https://github.com/hqwuzhaoyi)! - Optimize server Dockerfile to reduce size

## 1.8.1

### Patch Changes

- [`7591f50`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/7591f50d673088efeaee7d55b4e1e4031ddb0c04) Thanks [@hqwuzhaoyi](https://github.com/hqwuzhaoyi)! - Increase automatic deployment of Docker

## 1.8.0

### Minor Changes

- [#298](https://github.com/hqwuzhaoyi/gpt-subtitle/pull/298) [`7314bc6`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/7314bc678802b11f80b2d1eed8124112138a21ef) Thanks [@hqwuzhaoyi](https://github.com/hqwuzhaoyi)! - Added Whisper service and model download

### Patch Changes

- Updated dependencies [[`7314bc6`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/7314bc678802b11f80b2d1eed8124112138a21ef)]:
  - shared-types@2.5.0
  - translator@0.6.0
  - nfo-parser@0.3.0
  - whisper@0.7.0
  - utils@0.5.0

## 1.7.0

### Minor Changes

- [#289](https://github.com/hqwuzhaoyi/gpt-subtitle/pull/289) [`c689087`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/c68908773728f849f080f90331ac23930e847b62) Thanks [@hqwuzhaoyi](https://github.com/hqwuzhaoyi)! - New whisper service automatic download script

### Patch Changes

- [#289](https://github.com/hqwuzhaoyi/gpt-subtitle/pull/289) [`d12f73f`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/d12f73f97e2115a7c636a40f997efe1e3f617383) Thanks [@hqwuzhaoyi](https://github.com/hqwuzhaoyi)! - New whisper service automatic download script

  Refactored the data structure returned by the server

- Updated dependencies [[`d12f73f`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/d12f73f97e2115a7c636a40f997efe1e3f617383), [`c689087`](https://github.com/hqwuzhaoyi/gpt-subtitle/commit/c68908773728f849f080f90331ac23930e847b62)]:
  - shared-types@2.4.0
  - translator@0.5.0
  - nfo-parser@0.2.1
  - whisper@0.6.0
  - utils@0.4.1

## 1.6.0

### Minor Changes

- e7bdda7: Reconstructed the interface request to support separate deployment of web.

### Patch Changes

- Updated dependencies [e7bdda7]
  - nfo-parser@0.2.0
  - shared-types@2.3.0
  - translator@0.4.0
  - utils@0.4.0
  - whisper@0.5.0

## 1.5.0

### Minor Changes

- f4ac7a3: add gallery preview modal
- 92d060a: add gallery preview modal

### Patch Changes

- Updated dependencies [f4ac7a3]
- Updated dependencies [92d060a]
  - nfo-parser@0.1.0
  - shared-types@2.2.0
  - translator@0.3.0
  - utils@0.3.0
  - whisper@0.4.0

## 1.4.0

### Minor Changes

- 7e772a8: add settings page

## 1.3.0

### Minor Changes

- 63ddeff: Add authentication

## 1.2.0

### Minor Changes

- ba9550e: add pagination

### Patch Changes

- Updated dependencies [ba9550e]
  - shared-types@2.1.0
  - translator@0.2.0
  - whisper@0.3.0
  - utils@0.2.0

## 1.1.0

### Minor Changes

- ae3e98d: Increased push notifications for Gallery

### Patch Changes

- Updated dependencies [ae3e98d]
  - whisper@0.2.0

## 1.0.0

### Major Changes

- d1bc4bb: add Gallery Menu, move eslint to eslint-config-custom

### Patch Changes

- Updated dependencies [d1bc4bb]
  - shared-types@2.0.0
  - translator@0.1.1
  - utils@0.1.1
  - whisper@0.1.1

## 0.1.1

### Patch Changes

- a753d8e: fix web app wrong version
- Updated dependencies [a753d8e]
  - shared-types@1.1.1
  - translator@0.1.1
  - utils@0.1.1
  - whisper@0.1.1

## 0.1.0

### Minor Changes

- 8c4d9e4: first version

### Patch Changes

- Updated dependencies [8c4d9e4]
  - shared-types@1.1.0
  - translator@0.1.0
  - utils@0.1.0
  - whisper@0.1.0
