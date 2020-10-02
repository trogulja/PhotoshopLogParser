# rules

- [ ] file open
  - [ ] create new object
- [ ] action count
  - [ ] assign max time for action type
- [ ] file save or file close
  - [ ] if match in db, add to file actions count
  - [ ] reset actions counter to 0
  - [ ] find all open files, set start time to this
- [ ] file save
  - [ ] update save time
  - [ ] update path
- [ ] file close
  - [ ] update close time


- [ ] any action bound to first file saved or closed
  - [ ] count them
  - [ ] if that file has open event (.psb don't have)
- [ ] for any open file, reset open time to match last close or save event
  - [ ] if that file has open event (.psb!)

# times

- [ ] file open
- [ ] file save
- [ ] file close
- [ ] file start = open
  - [ ] if multiple images open, set start to last image closed - until all images are closed
- [ ] file end = close
  - [ ] if there is something in between save and close events, file end = save + 2sec
- [ ] duration = end - start (in seconds?)
- [ ] active = Math.min(duration, sum action count max time)

# edge cases

- [ ] there is no open event
- [ ] there is no close event
- [ ] time between start and end is too large (and no events happened)
