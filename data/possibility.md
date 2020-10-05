# rules

- [x] file open
  - [x] create new object
  - [ ] if claro original file (1234original.???), ignore?
- [x] action count
  - [ ] assign max time for action type
- [x] file save or file close
  - [x] if match in db, add to file actions count
  - [x] reset actions counter to 0
  - [x] find all open files, set start time to this
- [x] file save
  - [x] ignore if we're working on .psb file (smart object) - 
  - [x] update save time
  - [x] update path
- [x] file close
  - [x] update close time


# times

- [x] file open
- [x] file save
- [x] file close
- [x] file start = open
  - [x] if multiple images open, set start to last image closed - until all images are closed
- [x] file end = close
  - [ ] if there is something in between save and close events, file end = save + 2sec
- [x] duration = end - start (in seconds?)
- [ ] active = Math.min(duration, sum action count max time)

# edge cases

- [ ] there is no open event
- [ ] there is no close event
- [ ] time between start and end is too large (and no events happened)
