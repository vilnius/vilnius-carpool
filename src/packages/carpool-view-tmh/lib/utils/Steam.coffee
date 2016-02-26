# Has bad bug - if method doesn't call calback - the chain is broken
class @Steam
  idle: true
  
  constructor: (context) ->
    @context = context
    @actions = [];
    
  push: (fn, originalCb) =>
    #d "Push, idle:"+@idle
    if originalCb
      #d "Callback provided - normalize to f(cb, err, result) format"
      fnO = (next) =>
        fn.bind(@context)((err, result) =>
          originalCb.bind(@context)(err, result)
          next.bind(@context)())
      @actions.push fnO
    else
      @actions.push fn.bind(@context)

  run: (fn, originalCb) =>
    #d "Run, queue:"+@actions.length+new Error().stack
    if(fn)
      @push(fn, originalCb);
    if @idle
      #d "Idle:"+@idle 
      @runActions()         

  runActions: () =>
    #d "execute:", @actions.length
    @idle = false
    fn = @listDone.bind(@)
    list = _(@actions).reduceRight(_.wrap, fn);  
    @actions = [];
    list();
    
  listDone: () =>
    if(@actions.length > 0) 
      @runActions();
    else
      @idle = true

  #WFT?
  runActions: () ->
    #d "execute:", @actions.length
    @idle = false
    lastFn = @listDone.bind(@)
    list = _(@actions).reduceRight(_.wrap, lastFn);  
    @actions = [];
    list();
              
