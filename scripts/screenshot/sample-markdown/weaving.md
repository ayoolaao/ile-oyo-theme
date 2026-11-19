# Weaving aṣọ-òkè

Aṣọ-òkè is woven in narrow strips on a horizontal loom, then sewn edge to edge into cloth. The three classic styles are **ẹtù**, **sányán** and **àlàárì**; see the [pattern notes](https://github.com/ayoolaao/ile-oyo-theme) for *more*.

## Threads

| Style | Color | Used for |
| ----- | ----- | -------- |
| Ẹtù | indigo | ceremonies |
| Sányán | beige silk | elders |
| Àlàárì | crimson | celebrations |

> A strip is only as strong as its weakest thread.

- [x] Wind the warp
- [x] Set the heddles
- [ ] Weave *twelve strips* for one cloth

```ts
// Count strips that use a thread
export function tally(strips: Strip[], thread = "ẹtù"): number {
  return strips.filter((s) => s.threads.includes(thread)).length; // 12
}
```

Run `weave --width 4` to start a new strip.
