# ASM Events
## An event listener manager

When script is included on page ASM.Events will be made available to start managing events.

## Examples
+ Register an event listener with an alias
```javascript
    ASM.Events.register('test').on('click', (event)=>{
        console.log(event)
    })
```
+ Add additional parameters to function for event
```javascript
    ASM.Events.register('single').on('click', ASM.Events.fn((param, event)=>{
        console.log(param, event)
    }).params('Single param'))

    // To have new parameters corresponding to each one provided 
    // add arguments like normal
    ASM.Events.register('double').on('click', ASM.Events.fn((param1, param2, event)=>{
        console.log(param1, param2, event, limitInfo)
    }).params([0,1,2,3], {second: 'second'})).limit(4)
    
    // To consolidate into a single parameter supply arguments in an array
    ASM.Events.register('compound').on('click', ASM.Events.fn((params, event)=>{
        console.log(params[0], params[1], params[2], event)
    }).params(['one', 2, {nums: [3, 4]}])).limit(4)
```
+ Limit the amount of times an event can be called before being removed. 

    Each call returns an optional limitInfo object describing the current status of the limited handler 
    if you assign the second argument of limit to true the default is false which won't return the status
    
```javascript
    { clickedAmount: 1, limit: 4, done: false }
``` 
```javascript
    ASM.Events.register('other').on('click', (event, limitInfo)=>{
        console.log(event, 'other', limitInfo)
    }).limit(2, true)

    // Or default without limit info
    ASM.Events.register('other').on('click', (event, limitInfo)=>{
        console.log(event, 'other', limitInfo)
    }).limit(2)
```
+ Limit the amount of times an event can be called on a function with extra parameters before being removed use ASM.Events.fn
```javascript
    ASM.Events.register('new').on('click', ASM.Events.fn((param, event, limitInfo)=>{
        console.log(param, event, limitInfo)
    }).params('this is extra')).limit(4, true)

```
+ Remove listener by alias
```javascript
    ASM.Events.remove('test')
```
+ Remove all event listeners that have been registered
```javascript
    ASM.Events.removeAll()
```
+ Volatile events are guaranteed to fire only once
```javascript
    ASM.Events.volatile('click', (event)=>{
        console.log("volatile", event)
    })
```
+ Overwrite an existing handler
```javascript
    ASM.Events.overwrite('other').on('click', (event, limitInfo)=>{
        console.log(event, 'another', limitInfo)
    }).limit(2, true)
```
+ Execute a handler by name without event info
```javascript
    ASM.Events.executeEvent("other")
```