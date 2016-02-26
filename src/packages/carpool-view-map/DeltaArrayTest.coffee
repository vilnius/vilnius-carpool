Tinytest.add 'DeltaArray - add new items', ()->
  delta = new DeltaArray (obj)->
    #d "Key:", obj.id
    return obj.id

  delta.push(id:"1")
  delta.push(id:"2")
  delta.flush (obj)->
      d "Adding", obj
    , (obj)->
      d "Removing", obj
  d "Initial Result:", delta.values()

  delta.push(id:"1")
  delta.flush (obj)->
      d "Adding", obj
    , (obj)->
      d "Removing", obj
  d "One removed result:", delta.values()

  delta.push(id:"1")
  delta.push(id:"2")
  delta.flush (obj)->
      d "Adding", obj
    , (obj)->
      d "Removing", obj
  d "Both added result:", delta.values()
